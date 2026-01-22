<template>
  <nav class="menu">
    <ul class="menu-wrapper">
      <li class="menu-item">
        <RouterLink class="menu-link" :to="{ name: 'wall', params: { id: authStore.user?.id } }"
          >Мой аккаунт
        </RouterLink>
      </li>
      <li class="menu-item">
        <RouterLink class="menu-link" :to="{ name: 'chats' }">Чаты</RouterLink>
      </li>
      <li class="menu-item">
        <RouterLink class="menu-link" :to="{ name: 'contacts' }">Контакты</RouterLink>
      </li>
      <li class="menu-item">
        <RouterLink class="menu-link" :to="{ name: 'photos' }">Мои фотографии</RouterLink>
      </li>
      <li class="menu-item">
        <RouterLink class="menu-link" :to="{ name: 'videos' }">Мои видео</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const authStore = useAuthStore()
</script>

<style scoped>
@import '@/assets/css/profile/profile-menu.css';
</style>
