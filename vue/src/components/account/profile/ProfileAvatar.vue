<template>
  <div class="avatar-container">
    <div>
      <div class="no-avatar"></div>
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
