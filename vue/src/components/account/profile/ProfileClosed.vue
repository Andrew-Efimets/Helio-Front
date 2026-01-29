<template>
  <div class="closed">
    <div class="closed__avatar avatar__container">
      <div v-if="isLoading || !user?.avatar" class="avatar__wrapper">
        <div class="avatar__empty"></div>
      </div>
      <div v-else class="avatar__wrapper">
        <img :src="user.avatar" alt="аватар" class="avatar__img" />
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
    <div class="closed__info info">
      <div v-if="isLoading" class="info__wrapper">
        <span class="info__loader"></span>
      </div>
      <div v-else class="info__wrapper">
        <div class="info__name-wrapper">
          <p class="info__name">
            {{ user?.name }}
          </p>
        </div>
        <p class="info__notify">Закрытый аккаунт</p>
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
@import '@/assets/css/profile/profile-info.css';

.closed {
  display: flex;
}

.info__notify {
  font-size: 18px;
  font-weight: 700;
  color: #6e2c11;
  padding: 20px;
}
</style>
