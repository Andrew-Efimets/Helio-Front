<template>
  <section class="main">
    <ProfileMenu />
    <main class="content">
      <RouterView />
    </main>
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
</style>
