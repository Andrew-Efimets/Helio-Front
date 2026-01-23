<template>
  <section class="main-container">
    <ProfileMenu />
    <main class="main-content">
      <RouterView />
    </main>
  </section>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ProfileMenu from '@/components/account/profile/ProfileMenu.vue'
</script>

<style scoped>
.main-container {
  display: flex;
}
</style>
