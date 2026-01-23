<template>
  <AppHeader />
  <div class="app__container">
    <RouterView />
  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/footer/AppFooter.vue'
import axios from 'axios'

onMounted(async () => {
  try {
    await axios.get('/sanctum/csrf-cookie')
  } catch (error) {
    console.error('Ошибка инициализации защиты')
  }
})
</script>

<style>
@import '@/assets/css/app.css';
</style>
