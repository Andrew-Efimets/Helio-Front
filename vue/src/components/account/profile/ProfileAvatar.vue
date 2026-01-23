<template>
  <div class="avatar">
    <div class="avatar__container">
      <div class="avatar__wrapper">
        <div class="avatar__empty"></div>
      </div>
    </div>
    <div class="avatar__menu">
      <div class="menu__list"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'

const authStore = useAuthStore()
console.log(authStore)
</script>

<style scoped>
@import '@/assets/css/profile/profile-avatar.css';
</style>
