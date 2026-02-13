<template>
  <section class="main">
    <ProfileMenu />
    <RouterView />
  </section>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ProfileMenu from '@/components/account/profile/ProfileMenu.vue'
</script>

<style scoped>
.main {
  display: flex;
}

@media screen and (max-width: 1024px) {
  .main {
    flex-direction: column;
  }
}
</style>
