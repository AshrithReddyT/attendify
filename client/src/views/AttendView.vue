<script setup>
import axios from "axios";
import { googleSdkLoaded } from "vue3-google-login";
import { useRouter, useRoute } from "vue-router";

import { ref } from "vue";

const isValidMeeting = ref(false);
const message = ref("");
const router = useRouter();
const route = useRoute();

// Fetch the meeting data from the server
const fetchMeeting = async (id, passkey) => {
  console.log("IN fetch meeting");
  try {
    if (!id || !passkey) {
      message.value = "Not a valid meeting!";
      return;
    } else {
      const response = await axios.get(
        `http://localhost:3000/api/meeting/${id}/${passkey}`
      );
      localStorage.setItem("meeting", JSON.stringify(response.data));
      isValidMeeting.value = true;
    }
  } catch (error) {
    message.value = error.response.data.message;
  }
};

// Call fetchMeeting with the route params when the component is mounted
fetchMeeting(route.params.id, route.params.passkey);

const exchangeCodeForToken = async (code) => {
  try {
    const resp = await axios.post(import.meta.env.VITE_SERVER_ENDPOINT + "/auth/google", {
      code: code,
    });
    const { tokens, userProfile } = resp.data;

    // Store tokens and userProfile in local storage
    localStorage.setItem("tokens", JSON.stringify(tokens));
    localStorage.setItem("userProfile", JSON.stringify(userProfile));

    // Redirect to Qr page
    router.push(`/qr/${route.params.id}`);
  } catch (error) {
    console.log(error);
  }
};

const login = () => {
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initCodeClient({
        client_id:
          "1054586386822-oqloh2jc5tmhsnmicntac5il7o4hfiqn.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/calendar",
        callback: (response) => {
          console.log("Handle the response", response);
          exchangeCodeForToken(response.code);
        },
        ux_mode: "popup",
      })
      .requestCode();
  });

  // googleTokenLogin().then((response) => {
  //   console.log("token ", response.access_token);
  //   const userData = decodeCredential(response.access_token);
  //   localStorage.token = response.access_token;
  //   router.push("/dashboard");
  //   console.log("Handle the userData", userData);
  // });
};
</script>

<style scoped>
.bgimg-inner-attend {
  font-size: larger;
  font-weight: bold;
  color: rgb(226, 226, 226);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  margin-left: 0;
  align-items: center;
}

.main-content {
  width: 100%;
  height: 100%;
  padding: 2em;
  justify-content: center;
  display: flex;
  flex-direction: row;
}

.sub-content {
  padding: 1em 0.4em 0 1em;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  /* background-image: url("/site-images/sub-content-bg.jpeg"); */
}

.x-large {
  margin-bottom: 0.7em;
  font-size: 1.8rem;
  line-height: 1.2;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.content-img {
  width: 134px;
  height: 200px;
  opacity: 0.65;
  align-self: center;
}

.cta-button-container {
  display: flex;
  justify-content: center;
}

.bg-hero {
  position: relative;
  background-attachment: fixed;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 75vh;
  background-image: url("/site-images/attend-hero.jpeg");
}

.cta-button {
  background-color: #005ab6;
  border-radius: 6px;
  color: #fff;
  border: none;
  padding: 10px;
  margin-top: 10px;
  font-weight: 500;
  font-family: BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
    "Open Sans", "Helvetica Neue", sans-serif;
}

.dark-overlay {
  height: 100%;
  width: 100%;
  min-height: 70vh;
  top: 0;
  left: 0;
  background-color: rgba(6, 6, 6, 0.89);
}

.cta-button:hover {
  background-color: #0069d2;
  cursor: pointer;
  font-weight: 550;
}

.google-sign {
  width: 230px;
  padding: 10px;
  font-size: 18px;
  border-radius: 4px;
  background-color: rgb(238, 238, 238);
  color: rgb(67, 67, 67);
  border: 1px solid rgb(162, 162, 162);
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.google-sign:hover {
  background-color: rgb(244, 244, 244);
  cursor: pointer;
  color: rgb(32, 32, 32);
}

.google-logo {
  height: 24px;
  width: 24px;
  background-image: url("/logo-images/google-logo.png");
}
h5 {
  margin-top: 1em;
}
</style>

<template>
  <section class="bg-hero">
    <div class="dark-overlay">
      <div class="main-content">
        <div class="bgimg-inner-attend">
          <h1 v-if="message">{{ message }}</h1>
          <button v-else class="google-sign" @click="login">
            <img src="/logo-images/google-logo.png" class="google-logo" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
