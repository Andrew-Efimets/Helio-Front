<template>
  <AppHeader />
  <div class="container">
    <RouterView />
  </div>

  <div class="button-wrapper">
    <button @click="getAll" class="button">Все пользователи</button>
  </div>

  <li v-for="user in users" :key="user.id">{{ user.name }} — {{ user.phone }}</li>
  <AppFooter />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/footer/AppFooter.vue'
import axios from 'axios'
import api from '@/api.ts'

interface User {
  id: number
  name: string
  phone: string
}

// 2. Указываем тип для ref
const users = ref<User[]>([])

onMounted(async () => {
  try {
    await axios.get('/sanctum/csrf-cookie')
    console.log('CSRF получен. Источник: cookie. Приложение готово')
  } catch (error) {
    console.error('Ошибка инициализации защиты')
  }
})

const getAll = async () => {
  try {
    const response = await api.get('/users')
    users.value = response.data
    console.log('Получено :)')
  } catch {
    console.log('Не получено :(')
  }
}
</script>

<style>
@import '@/assets/css/app.css';
.button-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.button {
  margin-top: auto;
}
</style>
