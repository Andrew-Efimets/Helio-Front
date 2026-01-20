<template>
  <AppHeader />
  <div class="container">
    <RouterView />
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import AppHeader from '@/components/header/AppHeader.vue'
import axios from 'axios'

onMounted(async () => {
  try {
    await axios.get('/sanctum/csrf-cookie')
    console.log('CSRF получен. Источник: cookie. Приложение готово')
  } catch (error) {
    console.error('Ошибка инициализации защиты')
  }
})
</script>

<style>
@import '@/assets/css/app.css';
</style>
