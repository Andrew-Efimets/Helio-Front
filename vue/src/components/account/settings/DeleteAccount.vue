<template>
  <div class="delete-account">
    <h3 class="delete-account__header">Удаление аккаунта</h3>
    <p class="delete-account__notify">Вы уверены? Все данные будут стерты.</p>
    <div class="button__wrapper">
      <button @click="$router.back()" class="button">Отмена</button>
      <button @click="handleDelete" class="button button--danger" :disabled="isLoading">
        Удалить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import api from '@/api'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)

const handleDelete = async () => {
  try {
    isLoading.value = true
    const response = await api.delete(`/user/${route.params.id}`)
    authStore.reset()
    router.push('/login')
  } catch (e) {
    console.error('Ошибка удаления')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import '@/assets/css/settings/profile-settings.css';
</style>
