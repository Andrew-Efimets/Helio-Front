<template>
  <Header />
  <div class="container">
    <RouterView />
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/header/Header.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}
</style>
