<template>
  <div class="photo-section">
    <video ref="video" autoplay></video>
    <div class="photo-actions">
      <button @click="takePhoto" :disabled="photos.length >= photoQuota" title="Prendre une photo.">
        <i :class="photos.length >= photoQuota ? 'bx bx-camera-off' : 'bx bx-camera'"></i>
      </button>
      <button @click="clearPhotos" title="Effacer l'ensemble des photos."><i class='bx bx-trash'></i></button>
    </div>
    <div id="photoGallery">
      <div v-for="(photo, index) in photos" :key="index" class="photo-item">
        <img :src="photo" @click="openPhotoInNewTab(photo)" />
        <button @click="deletePhoto(index)"><i class='bx bx-trash'></i> Supprimer</button>
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
      photoQuota: 8
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
        try {
          localStorage.setItem('photos', JSON.stringify(photos));
          this.displayPhotos();
        } catch (e) {
          if (e.name === 'QuotaExceededError') {
            this.showNotification('Erreur: Quota de stockage local dépassé!');
          } else {
            console.error('Erreur lors de l\'enregistrement de la photo:', e);
          }
        }
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
    },
    openPhotoInNewTab(photo) {
      const newWindow = window.open();
      newWindow.document.write(`<img src="${photo}" style="width:100%">`);
    }
  }
};
</script>
