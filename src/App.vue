<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style scoped>
  .app {
    display: grid;
    place-content: center;
    width: 100vw;
    height: 100vh;
  }
</style>
