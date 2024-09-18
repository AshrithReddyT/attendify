  
  <script>
  import axios from "axios";
  import QrcodeVue from "qrcode.vue";
  import { reactive, ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  
  const startTimer = () => {
      timeLeft.value = 30;
      const timer = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--;
        } else {
          clearInterval(timer);
        }
      }, 1000);
    };

</script>  

<template>
    <div v-if="invalidMeetingMessage" class="qr-container">
      <h2>{{ invalidMeetingMessage }}</h2>
    </div>
    <div v-else class="qr-container">
      <h1 v-if="timeLeft > 0">Your code will expire in {{ timeLeft }} seconds.</h1>
      <h1 v-else>QR code expired. Please refresh the code.</h1>
      <div v-if="qrCodeData" class="code-cont">
        <qrcode-vue :value="qrCodeData" :size="size" level="L" />
        <button class="refresh-qr" @click="generateQRAndStartTimer">Refresh Code</button>
      </div>
    </div>
  </template>