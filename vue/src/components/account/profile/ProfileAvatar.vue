<template>
  <div class="avatar">
    <div class="container">
      <div v-if="isLoading || !user?.avatar" class="wrapper">
        <div class="empty"></div>
      </div>
      <div v-else class="wrapper">
        <RouterLink :to="{ name: 'wall' }">
          <img :src="user.avatar" alt="аватар" class="img" />
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
    <div v-if="user && user.id !== authStore.user?.id" class="menu">
      <div v-for="link in menuLinks" :key="link.name" class="list">
        <RouterLink :to="{ name: link.name }" class="item">
          {{ link.label }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { useRoute, RouterLink } from 'vue-router'
import { ref } from 'vue'
import api from '@/api'

const menuLinks = [
  { name: 'photos', label: 'Фотографии' },
  { name: 'videos', label: 'Видеозаписи' },
  { name: 'contacts', label: 'Контакты' },
]

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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px;
  padding: 20px;
  background-color: #f5ddc5;
}

.wrapper {
  width: 200px;
  height: 250px;
}

.empty {
  background-color: #957f6f;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: #6e2c11 2px solid;
  box-shadow: 0 0 15px 5px rgba(190, 127, 25, 0.5);
}

.menu {
  display: flex;
  flex-direction: column;
  margin: 40px;
  padding: 20px;
  background-color: #f5ddc5;
}

.list {
  padding: 10px 0;
}

.item {
  font-size: 18px;
  font-weight: 500;
  color: #6e2c11;
  text-decoration: none;
  box-shadow: 0 2px 0 0 rgba(190, 127, 25, 0.2);
}
</style>
