<template>
  <section class="settings">
    <div class="links">
      <div class="link">
        <RouterLink :to="{ name: 'profile-settings' }" class="link-item">
          <h3 class="title">Личные данные</h3>
        </RouterLink>
      </div>
      <div class="link">
        <RouterLink :to="{ name: 'avatar-settings' }" class="link-item">
          <h3 class="title">Аватар профиля</h3>
        </RouterLink>
      </div>
      <div class="link">
        <RouterLink :to="{ name: 'privacy-settings' }" class="link-item">
          <h3 class="title">Настройки приватности</h3>
        </RouterLink>
      </div>
    </div>
    <div class="pages">
      <RouterView />
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.settings {
  margin-left: 40px;
}

.links {
  margin-top: 50px;
  display: flex;
}

.link-item {
  padding: 10px 20px;
  display: block;
  color: #6e2c11;
  text-decoration: none;
  width: 100%;
  font-size: 18px;
  font-weight: 600;
}

.links .link:has(.router-link-exact-active) {
  background-color: #f0ccaa;
}

.links .link:hover:not(:has(.router-link-exact-active)) {
  background-color: #ead7c3;
}

.router-link-exact-active {
  color: #a34809;
  font-weight: bold;
  background-color: #f0ccaa;
}

.pages {
  background-color: #f0ccaa;
}

@media screen and (max-width: 1024px) {
  .settings {
    margin: 0;
  }

  .title {
    font-size: 18px;
  }
}

@media screen and (max-width: 768px) {
  .title {
    font-size: 16px;
  }

  .link-item {
    padding: 5px;
  }
}
</style>
