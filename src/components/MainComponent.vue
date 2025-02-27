<template>
  <div class="main-component">
    <div id="choose-background">
      <img src="@/assets/background.gif" alt="Background" />
    </div>
    <div class="menu-nav">
      <nav>
        <button :class="{ active: currentSection === 'photo' }" @click="showSection('photo')">Photo</button>
        <button :class="{ active: currentSection === 'location' }" @click="showSection('location')" v-if="isOnline">Localisation</button>
        <button :class="{ active: currentSection === 'call' }" @click="showSection('call')" v-if="isOnline">Appel</button> <!-- Nouvel onglet pour l'appel -->
        <span v-if="batteryLevel !== null">
          <i :class="batteryIcon"></i> {{ batteryLevel }}%
        </span> <!-- Affichage du niveau de batterie -->
      </nav>
    </div>
    <div id="choose-container">
      <PhotoSection v-if="currentSection === 'photo'" />
      <LocationSection v-if="currentSection === 'location' && isOnline" :latitude="latitude" :longitude="longitude" :address="address" />
      <CallSection v-if="currentSection === 'call'" />
      <div id="choose-footer">
        Ashiko &bull; Alexandre RAGUIN
      </div>
    </div>
    <div id="theme-toggle" title="Toggle light/dark theme." onClick={handleThemeToggle}>
      <i class="bx bx-moon"></i>
    </div>
    <div id="return-toggle" title="Retour au repository GitHub&copy;.">
        <a href="https://github.com/AshiikoAR/PWA_Alexandre_Raguin"><i className="bx bx-arrow-back"></i></a>
    </div>
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
      batteryLevel: null,
      isCharging: false
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
          this.updateBatteryStatus(battery);
          battery.addEventListener('levelchange', () => {
            this.updateBatteryStatus(battery);
          });
          battery.addEventListener('chargingchange', () => {
            this.updateBatteryStatus(battery);
          });
        });
      }
    },
    updateBatteryStatus(battery) {
      this.batteryLevel = Math.round(battery.level * 100);
      this.isCharging = battery.charging;
    }
  },
  computed: {
    batteryIcon() {
      if (this.isCharging) {
        return 'bx bxs-battery-charging';
      } else if (this.batteryLevel <= 20) {
        return 'bx bxs-battery-low';
      } else {
        return 'bx bx-battery';
      }
    }
  }
};
</script>
