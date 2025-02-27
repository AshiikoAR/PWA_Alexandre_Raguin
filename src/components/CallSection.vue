<template>
  <div class="call-section">
    <span>
      <h1>Passer un appel téléphonique</h1>
      <div class="form-simple">
        <div>
          <input type="tel" v-model="phoneNumber" placeholder="Entrez le numéro de téléphone" />
          <i class='bx bxs-phone'></i>
        </div>
        <button @click="makeCall">Appeler</button>
      </div>
    </span>
    <span>
      <h1>Envoyer un mot de passe par SMS (OTP)</h1>
      <div class="form-simple">
        <div>
          <input type="tel" v-model="otpPhoneNumber" placeholder="Entrez le numéro de téléphone" />
          <i class='bx bxs-send' ></i>
        </div>
        <button @click="sendOtp">Envoyer</button>
      </div>
      <div class="form-simple">
        <div>
          <input type="text" v-model="otp" placeholder="Entrez le mot de passe (OTP)" />
          <i class='bx bxs-badge-check'></i>
        </div>
        <button @click="validateOtp">Valider</button>
      </div>
    </span>
  </div>
</template>

<script>
export default {
  name: 'CallSection',
  data() {
    return {
      phoneNumber: '',
      otpPhoneNumber: '',
      otp: ''
    };
  },
  mounted() {
    this.readOtpFromSms();
  },
  methods: {
    makeCall() {
      if (this.phoneNumber) {
        window.location.href = `tel:${this.phoneNumber}`;
      } else {
        alert('Veuillez entrer un numéro de téléphone valide.');
      }
    },
    sendOtp() {
      if (this.otpPhoneNumber) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Générer un OTP aléatoire
        this.otp = otp;

        alert(`Mot de passe envoyé à ${this.otpPhoneNumber}: ${otp}`); // Simuler l'envoi du SMS
      } else {
        alert('Veuillez entrer un numéro de téléphone valide.');
      }
    },
    readOtpFromSms() {
      if ('OTPCredential' in window) {
        window.addEventListener('DOMContentLoaded', () => {
          const input = document.querySelector('input[autocomplete="one-time-code"]');
          if (input) {
            const ac = new AbortController();
            navigator.credentials.get({
              otp: { transport: ['sms'] },
              signal: ac.signal
            }).then(otp => {
              input.value = otp.code;
              this.otp = otp.code;
            }).catch(err => {
              console.error('Erreur lors de la lecture du SMS:', err);
            });
          }
        });
      }
    },
    validateOtp() {
      if (this.otp) {
        alert('Mot de passe validé: ' + this.otp);
      } else {
        alert('Veuillez entrer un mot de passe valide.');
      }
    }
  }
};
</script>