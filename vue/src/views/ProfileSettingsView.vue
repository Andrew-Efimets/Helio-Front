<template>
  <section class="settings">
    <div class="settings__links">
      <div class="settings__link">
        <RouterLink :to="{ name: 'profile-settings' }" class="settings__link-item">
          <h3 class="settings__title">Личные данные</h3>
        </RouterLink>
      </div>
      <div class="settings__link">
        <RouterLink :to="{ name: 'avatar-settings' }" class="settings__link-item">
          <h3 class="settings__title">Аватар профиля</h3>
        </RouterLink>
      </div>
      <div class="settings__link">
        <RouterLink :to="{ name: 'privacy-settings' }" class="settings__link-item">
          <h3 class="settings__title">Настройки приватности</h3>
        </RouterLink>
      </div>
    </div>
    <div class="settings__pages">
      <RouterView />
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
@import '@/assets/css/settings/main-settings.css';
</style>
