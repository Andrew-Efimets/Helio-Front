<template>
  <div class="info">
    <div v-if="isLoading" class="info__wrapper">
      <span class="info__loader"></span>
    </div>
    <div v-else class="info__wrapper">
      <div class="info__name-wrapper">
        <RouterLink :to="{ name: 'wall' }" class="info__name">
          {{ user?.name }}
        </RouterLink>
      </div>
      <div class="info__list">
        <p class="info__item-title">Страна:</p>
        <p class="info__item">{{ user?.profile.country }}</p>
      </div>
      <div class="info__list">
        <p class="info__item-title">Город:</p>
        <p class="info__item">{{ user?.profile.city }}</p>
      </div>
      <div class="info__list">
        <p class="info__item-title">День рождения:</p>
        <p class="info__item">{{ formatDate(user?.profile.birthday) }}</p>
      </div>
      <div v-if="authStore.canSee(user, 'show_phone')" class="info__list">
        <p class="info__item-title">Телефон:</p>
        <p class="info__item">+ {{ user?.phone }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

defineProps<{
  user: any
  isLoading: boolean
}>()

const authStore = useAuthStore()

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'не указан'

  const date = new Date(dateString)

  return new Intl.DateTimeFormat('ru-RU').format(date)
}
</script>

<style scoped>
@import '@/assets/css/profile/profile-info.css';
</style>
