<script setup>
import { RouterView, useRoute } from "vue-router";
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import { ref } from "vue";

import { provide } from "vue";

const isAuthenticated = ref(false);
provide("isAuthenticated", isAuthenticated);
if (localStorage.userProfile) {
  isAuthenticated.value = true;
}
const route = useRoute();
</script>

<template>
  <div id="app">
    <the-header :isAuthenticated="isAuthenticated"></the-header>
    <router-view :isAuthenticated="isAuthenticated" :key="route.fullPath"></router-view>
    <the-footer></the-footer>
  </div>
</template>
