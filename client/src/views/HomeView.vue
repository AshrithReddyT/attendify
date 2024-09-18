<script setup>
import { login } from "../utils/login";
import { useRouter } from "vue-router";
import { inject } from "vue";

const isAuthenticated = inject("isAuthenticated");
const router = useRouter();

const loginRedirect = async () => {
  await login();
  // Redirect to dashboard
  console.log("HAHAHA");
  console.log(router);
  isAuthenticated.value = true;
  router.push("/dashboard");
};
</script>

<style scoped>
.bgimg-inner {
  font-size: larger;
  font-weight: bold;
  color: rgb(226, 226, 226);
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  margin-left: 0;
}

.main-content {
  width: 100%;
  height: 100%;
  padding: 2em;
  justify-content: flex-start;
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
  background-image: url("/site-images/calendar-home.jpeg");
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
  min-height: 650px;
  top: 0;
  left: 0;
  background-color: rgba(6, 6, 6, 0.479);
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
  color: rgb(52, 52, 52);
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
        <div class="bgimg-inner">
          <h4>ALL-IN-ONE MEETING MANAGEMENT</h4>
          <h1>Everything you need to organize meeting</h1>
          <p><br /></p>
          <!-- <button class="google-sign" @click="googlePlus">Sign In with Google</button> -->
          <!-- <GoogleLogin :callback="callback" /> -->
          <button class="google-sign" @click="loginRedirect">
            <img src="/logo-images/google-logo.png" class="google-logo" />
            Sign in with Google
          </button>
          <h5>Attendify helps you schedule meetings and track the attendance.</h5>
        </div>
      </div>
    </div>
  </section>
</template>
