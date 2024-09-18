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

<script>
import axios from "axios";
import QrcodeVue from "qrcode.vue";
import { reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  components: {
    QrcodeVue,
  },
  setup() {
    const qrCodeData = ref(null);
    const size = 300;
    const timeLeft = ref(30);
    const invalidMeetingMessage = ref("");
    const route = useRoute();

    const generateQRAndStartTimer = async () => {
      await generateQR();
      startTimer();
    };

    const generateQR = async () => {
      try {
        console.log("TESTSTST:", route.params.meetingId);
        const url = "http://localhost:3000/api/qr/generateQR";
        //const meetingObj = JSON.parse(localStorage.meeting);
        const userObj = JSON.parse(localStorage.userProfile);
        const response = await axios.post(
          url,
          { meetingId: route.params.meetingId, userId: userObj.email },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("tokens")).access_token
              }`,
            },
          }
        );
        console.log(response.data);
        qrCodeData.value = response.data;
        timeLeft.value = 30;
      } catch (error) {
        invalidMeetingMessage.value = "Not a valid meeting or user";
        console.error(error);
      }
    };

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

    onMounted(async () => {
      generateQRAndStartTimer();
    });

    return {
      qrCodeData,
      size,
      generateQRAndStartTimer,
      timeLeft,
      invalidMeetingMessage,
    };
  },
};
</script>

<style scoped>
h1 {
  color: rgb(58, 58, 58);
  font-size: 1.6rem;
}

h2 {
  color: rgb(58, 58, 58);
  font-size: 1.6rem;
}
.refresh-qr {
  border: none;
  width: 230px;
  padding: 10px;
  font-size: 18px;
  border-radius: 4px;
  background-color: rgb(78, 51, 255);
  color: rgb(220, 220, 220);
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 30px;
  font-weight: 550;
}

.refresh-qr:hover {
  background-color: rgb(97, 73, 255);
  cursor: pointer;
  color: rgb(255, 255, 255);
  font-weight: 700;
}
.qr-container {
  min-height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  align-items: center;
}

.code-cont {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
