<template>
  <div class="main-component">
    <nav>
      <button @click="showSection('photo')">Photo</button>
      <button @click="showSection('location')" v-if="isOnline">Localisation</button>
      <button @click="showSection('call')" v-if="isOnline">Appel</button> <!-- Nouvel onglet pour l'appel -->
      <span v-if="batteryLevel !== null">Batterie: {{ batteryLevel }}%</span> <!-- Affichage du niveau de batterie -->
    </nav>
    <PhotoSection v-if="currentSection === 'photo'" />
    <LocationSection v-if="currentSection === 'location' && isOnline" :latitude="latitude" :longitude="longitude" :address="address" />
    <CallSection v-if="currentSection === 'call'" />
  </div>
</template>

<script>
import config from '../config.json';
import PhotoSection from './PhotoSection.vue';
import LocationSection from './LocationSection.vue';
import CallSection from './CallSection.vue';

export default {
  name: 'MainComponent',
  components: {
    PhotoSection,
    LocationSection,
    CallSection
  },
  data() {
    return {
      photos: [],
      latitude: null,
      longitude: null,
      address: '',
      isOnline: navigator.onLine,
      currentSection: 'photo',
      batteryLevel: null
    };
  },
  mounted() {
    this.displayPhotos();
    this.startCamera();
    if (this.isOnline) {
      this.getLocation();
    }
    this.getBatteryLevel(); 
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  },
  methods: {
    startCamera() {
      // Simuler la prise d'une photo
      setTimeout(() => {
        this.photos.push('new photo');
        this.notifyPhotoTaken();
      }, 1000);
    },
    displayPhotos() {
    },
    updateOnlineStatus() {
      this.isOnline = navigator.onLine;
      if (this.isOnline) {
        this.getLocation();
      }
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.getAddress();
        });
      }
    },
    getAddress() {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.longitude},${this.latitude}.json?access_token=${config.mapboxToken}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            this.address = data.features[0].place_name;
          }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération de l\'adresse:', error);
        });
    },
    showSection(section) {
      this.currentSection = section;
    },
    notifyPhotoTaken() {
      if (Notification.permission === 'granted') {
        new Notification('Photo prise avec succès!');
        this.vibrate();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Photo prise avec succès!');
            this.vibrate();
          }
        });
      }
    },
    vibrate() {
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    },
    getBatteryLevel() {
      if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
          this.batteryLevel = Math.round(battery.level * 100);
          battery.addEventListener('levelchange', () => {
            this.batteryLevel = Math.round(battery.level * 100);
          });
        });
      }
    }
  }
};
</script>
