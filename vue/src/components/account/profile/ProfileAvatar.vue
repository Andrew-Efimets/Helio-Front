<template>
  <div class="avatar">
    <div class="avatar__container">
      <div v-if="isLoading || !user?.avatar" class="avatar__wrapper">
        <div class="avatar__empty"></div>
      </div>
      <div v-else class="avatar__wrapper">
        <RouterLink :to="{ name: 'wall' }">
          <img :src="user.avatar" alt="аватар" class="avatar__img" />
        </RouterLink>
      </div>
      <button
        v-if="user && user.id !== authStore.user?.id"
        class="button"
        @click="addContact"
        :disabled="isAddition"
      >
        {{ user.is_contact ? 'Удалить из контактов' : 'Добавить в контакты' }}
      </button>
    </div>
    <div v-if="user && user.id !== authStore.user?.id" class="avatar__menu menu">
      <div class="menu__list">
        <RouterLink :to="{ name: 'photos' }" class="menu__item">Фотографии</RouterLink>
      </div>
      <div class="menu__list">
        <RouterLink :to="{ name: 'videos' }" class="menu__item">Видео</RouterLink>
      </div>
      <div class="menu__list">
        <RouterLink :to="{ name: 'contacts' }" class="menu__item">Контакты</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { useRoute, RouterLink } from 'vue-router'
import { ref } from 'vue'
import api from '@/api'

const props = defineProps<{
  user: any
  isLoading: boolean
}>()

const emit = defineEmits(['update-user'])

const authStore = useAuthStore()
const route = useRoute()
const isAddition = ref(false)

const addContact = async () => {
  try {
    isAddition.value = true
    const response = await api.post(`/user/${route.params.id}/contact`)

    const updatedUser = { ...props.user, is_contact: response.data.is_contact }
    emit('update-user', updatedUser)
    isAddition.value = false
  } catch (err) {
    console.error('Ошибка при работе с контактами', err)
  }
}
</script>

<style scoped>
@import '@/assets/css/profile/profile-avatar.css';
</style>
