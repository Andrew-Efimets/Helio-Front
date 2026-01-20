<template>
  <div class="header">
    <div class="header-wrapper">
      <div class="title">
        <RouterLink :to="{ name: 'home' }" class="header-link">
          <img
            alt="Vue logo"
            class="logo"
            src="../../assets/heliologo.png"
            width="64"
            height="64"
          />
        </RouterLink>
        <RouterLink :to="{ name: 'home' }" class="header-link">
          <h3>{{ info }}</h3>
        </RouterLink>
      </div>
      <div class="search">
        <input type="text" class="input" placeholder="Поиск" />
        <div class="icon-wrapper">
          <p class="separator">|</p>
          <RouterLink :to="{ name: 'account-search' }" class="link">
            <img src="../../assets/search.png" alt="поиск" class="icon" />
          </RouterLink>
        </div>
      </div>
      <div class="navbar">
        <RouterLink :to="{ name: 'register' }" class="navbar-link">Регистрация</RouterLink>
        <RouterLink :to="{ name: 'login' }" class="navbar-link">Вход</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const info = ref('Heliophone')
</script>

<style scoped>
@import '@/assets/css/header.css';
</style>
