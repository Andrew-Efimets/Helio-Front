<template>
  <div class="header">
    <div class="header__wrapper">
      <div class="header__title">
        <RouterLink :to="{ name: 'home' }" class="header__link">
          <img
            alt="Vue logo"
            class="header__logo"
            src="../../assets/heliologo.png"
            width="64"
            height="64"
          />
        </RouterLink>
        <RouterLink :to="{ name: 'home' }" class="header__link">
          <h3>{{ info }}</h3>
        </RouterLink>
      </div>
      <div class="header__search">
        <input type="text" class="header__input" placeholder="Поиск" />
        <div class="header__icon-wrapper">
          <p class="header__separator">|</p>
          <RouterLink :to="{ name: 'users' }" class="header__link-item">
            <img src="../../assets/search.png" alt="поиск" class="header__icon" />
          </RouterLink>
        </div>
      </div>
      <div v-if="!authStore.isVerified" class="header__navbar">
        <RouterLink :to="{ name: 'register' }" class="header__navbar-link">Регистрация</RouterLink>
        <RouterLink :to="{ name: 'login' }" class="header__navbar-link">Вход</RouterLink>
      </div>
      <div v-else class="header__navbar">
        <div v-if="!authStore.user?.avatar" class="header__avatar-empty"></div>
        <div v-else>
          <img src="#" alt="аватар" />
        </div>
        <RouterLink
          v-if="authStore.isVerified && authStore.user?.id"
          :to="{ name: 'wall', params: { id: String(authStore.user?.id || '') } }"
          class="header__navbar-link"
          >{{ authStore.user?.name }}
        </RouterLink>
        <a href="#" class="header__navbar-link" @click.prevent="handleLogout">Выход</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter, RouterLink } from 'vue-router'
import api from '@/api'
import { ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    const exitData = await api.post('/logout')
    console.log(exitData.data.message)
    authStore.reset()
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Ошибка выхода', error)
  }
}

const info = ref('Heliophone')
</script>

<style scoped>
@import '@/assets/css/header.css';
</style>
