<template>
  <nav v-if="authStore.user?.id" class="menu">
    <ul class="menu-wrapper">
      <li class="menu-item">
        <RouterLink class="menu-link" :to="{ name: 'wall', params: { id: myId } }"
          >Мой аккаунт
        </RouterLink>
      </li>
      <li class="menu-item">
        <RouterLink class="menu-link" :to="{ name: 'chats', params: { id: myId } }"
          >Чаты
        </RouterLink>
      </li>
      <li class="menu-item">
        <RouterLink class="menu-link" :to="{ name: 'contacts', params: { id: myId } }"
          >Контакты
        </RouterLink>
      </li>
      <li class="menu-item">
        <RouterLink class="menu-link" :to="{ name: 'photos', params: { id: myId } }">
          Мои фотографии
        </RouterLink>
      </li>
      <li class="menu-item">
        <RouterLink class="menu-link" :to="{ name: 'videos', params: { id: myId } }">
          Мои видео
        </RouterLink>
      </li>
      <li class="menu-separator"></li>
      <li>
        <RouterLink class="menu-link" :to="{ name: 'settings', params: { id: myId } }"
          >Настройки профиля
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const authStore = useAuthStore()
const myId = authStore.user?.id
</script>

<style scoped>
@import '@/assets/css/profile/profile-menu.css';
</style>
