<template>
  <div v-if="!authStore.isVerified" class="navbar">
    <RouterLink :to="{ name: 'register' }" class="navbar-link">Регистрация</RouterLink>
    <RouterLink :to="{ name: 'login' }" class="navbar-link">Вход</RouterLink>
  </div>
  <div v-else class="navbar">
    <div v-if="authStore.user?.avatar" class="avatar">
      <img :src="authStore.user?.avatar" alt="аватар" class="avatar-img" />
    </div>
    <RouterLink
      v-if="authStore.isVerified && authStore.user?.id"
      :to="{ name: 'wall', params: { id: String(authStore.user?.id || '') } }"
      class="navbar-link"
      >{{ authStore.user?.name }}
    </RouterLink>
    <span class="navbar-link" @click.prevent="handleLogout">Выход</span>
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
    authStore.reset()
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Ошибка выхода', error)
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  column-gap: 30px;
  margin-right: 40px;
}

.navbar-link {
  text-decoration: none;
  color: #6e2c11;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 15px 5px rgba(215, 142, 22, 0.5);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

@media screen and (max-width: 768px) {
  .navbar {
    column-gap: 15px;
    margin-right: 0;
  }
}
</style>
