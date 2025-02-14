<template>
  <div class="photo-section">
    <video ref="video" autoplay width="400px"></video>
    <button @click="takePhoto" v-if="photos.length < photoQuota">Prendre une photo</button>
    <button @click="clearPhotos">Effacer les photos</button>
    <div id="photoGallery">
      <div v-for="(photo, index) in photos" :key="index" class="photo-item">
        <img :src="photo" />
        <button @click="deletePhoto(index)">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PhotoSection',
  data() {
    return {
      photos: [],
      photoQuota: 9
    };
  },
  mounted() {
    this.displayPhotos();
    this.startCamera();
  },
  methods: {
    startCamera() {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.$refs.video.srcObject = stream;
        })
        .catch(error => {
          console.error('Erreur lors de l\'accès à la caméra:', error);
        });
    },
    takePhoto() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = this.$refs.video.videoWidth;
      canvas.height = this.$refs.video.videoHeight;
      context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL('image/png');
      this.savePhoto(photo);
      this.showNotification('Photo prise avec succès!');
    },
    showNotification(message) {
      if (Notification.permission === 'granted') {
        new Notification(message);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(message);
          }
        });
      }
    },
    savePhoto(photo) {
      let photos = JSON.parse(localStorage.getItem('photos')) || [];
      if (photos.length < this.photoQuota) {
        photos.push(photo);
        localStorage.setItem('photos', JSON.stringify(photos));
        this.displayPhotos();
      } else {
        this.showNotification('Quota de photos atteint!');
      }
    },
    displayPhotos() {
      const photos = JSON.parse(localStorage.getItem('photos')) || [];
      this.photos = photos;
    },
    clearPhotos() {
      localStorage.removeItem('photos');
      this.displayPhotos();
    },
    deletePhoto(index) {
      let photos = JSON.parse(localStorage.getItem('photos')) || [];
      photos.splice(index, 1);
      localStorage.setItem('photos', JSON.stringify(photos));
      this.displayPhotos();
    }
  }
};
</script>
