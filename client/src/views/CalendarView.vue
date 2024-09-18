<style scoped>
h2 {
  font-size: 1rem;
  margin-bottom: 10px;
}

h1 {
  font-size: 1.5rem;
}
.scan-container {
  padding: 120px;
  padding-bottom: 200px;
  height: 800px;
}

.decode-result {
  color: rgb(54, 54, 54);
  margin-bottom: 50px;
  width: 100%;
}
</style>

<template>
  <div class="cont">
    <div class="scan-container">
      <p class="error">{{ error }}</p>
      <div class="decode-result">
        <h2>Last result: {{ result }}</h2>
        <h1>
          Status: <b>{{ serverMsg }}</b>
        </h1>
      </div>

      <qrcode-stream @decode="onDecode" @init="onInit" />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue3-qrcode-reader";
import axios from "axios";

export default {
  components: { QrcodeStream },

  data() {
    return {
      result: "",
      error: "",
      serverMsg: "",
    };
  },

  methods: {
    async onDecode(result) {
      this.result = result;
      try {
        const response = await axios.post(
          "http://localhost:3000/api/qr/verifyQR",
          {
            qrCode: result,
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("tokens")).access_token
              }`,
            },
          }
        );
        if (response.status === 200) {
          // Display success message
          console.log("QR code verified");
          this.serverMsg = "QR code verified";
        } else {
          // Display error message from server
          console.log(response.data.message);
          this.serverMsg += response.data.message;
        }
      } catch (error) {
        if (error.response.status === 400) {
          // Display error message from server
          console.log(error.response.data.message);
          this.serverMsg = error.response.data.message;
        } else if (error.response.status === 500) {
          // Display server error message
          console.error(error);
          this.serverMsg = "Server error";
        }
      }
    },

    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permission";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        } else if (error.name === "InsecureContextError") {
          this.error =
            "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
        } else {
          this.error = `ERROR: Camera error (${error.name})`;
        }
      }
    },
  },
};
</script>
