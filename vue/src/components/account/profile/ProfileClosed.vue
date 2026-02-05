<template>
  <div class="closed">
    <div class="avatar__container">
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
    <div class="info">
      <div v-if="isLoading" class="wrapper">
        <span class="app-loader"></span>
      </div>
      <div v-else class="wrapper">
        <div class="name-wrapper">
          <p class="name">
            {{ user?.name }}
          </p>
        </div>
        <p class="notify">Закрытый аккаунт</p>
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
.closed {
  display: flex;
}

.avatar__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px;
  padding: 20px;
  background-color: #f5ddc5;
}

.avatar__wrapper {
  width: 200px;
  height: 250px;
}

.avatar__empty {
  background-color: #957f6f;
}

.avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: #6e2c11 2px solid;
  box-shadow: 0 0 15px 5px rgba(190, 127, 25, 0.5);
}

.notify {
  font-size: 18px;
  font-weight: 700;
  color: #6e2c11;
  padding: 20px;
}

.info {
  padding: 40px 0 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  background-color: #f5ddc5;
  min-width: 600px;
  min-height: 200px;
}

.name-wrapper {
  margin: 0 10px;
  box-shadow: 0 10px 4px -2px rgba(196, 114, 51, 0.2);
  border-radius: 5px;
  padding: 10px;
}

.name {
  color: #6e2c11;
  font-size: 22px;
  font-weight: 700;
  text-decoration: none;
}
</style>
