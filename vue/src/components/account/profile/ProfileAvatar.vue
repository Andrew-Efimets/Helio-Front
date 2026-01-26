<template>
  <div class="avatar">
    <div class="avatar__container">
      <div v-if="isLoading || !user?.avatar" class="avatar__wrapper">
        <div class="avatar__empty"></div>
      </div>
      <div v-else class="avatar__wrapper">
        <img :src="user.avatar" alt="аватар" class="avatar__img" />
      </div>
      <button
        v-if="user && user.id !== authStore.user?.id"
        class="avatar__button"
        @click="addContact"
      >
        Добавить в контакты
      </button>
    </div>
    <div v-if="user && user.id !== authStore.user?.id" class="avatar__menu">
      <div class="menu__list">Фото пользователя</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import api from '@/api'

defineProps<{
  user: any
  isLoading: boolean
}>()

const authStore = useAuthStore()
const route = useRoute()

const addContact = async () => {
  try {
    await api.post(`/contact/${route.params.id}`)
    console.log('Контакт добавлен')
  } catch (err) {
    console.error('Ошибка при добавлении', err)
  }
}
</script>

<style scoped>
@import '@/assets/css/profile/profile-avatar.css';
</style>
