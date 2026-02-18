<template>
  <div class="avatar">
    <div class="container">
      <div v-if="isLoading || !user?.avatar" class="wrapper">
        <div class="empty"></div>
      </div>
      <div v-else class="wrapper">
        <RouterLink :to="{ name: 'wall' }">
          <AppTransition>
            <img :src="user.avatar" alt="аватар" class="img" />
          </AppTransition>
        </RouterLink>
      </div>
      <template v-if="user && user.id !== authStore.user?.id">
        <button
          v-if="!user.contact_status"
          class="button"
          @click="toggleContact"
          :disabled="isAddition"
        >
          Добавить в контакты
        </button>

        <template v-else>
          <button
            v-if="user.contact_status.type === 'accepted'"
            class="button"
            @click="toggleContact"
            :disabled="isAddition"
          >
            Удалить из контактов
          </button>

          <template v-else-if="user.contact_status.type === 'pending'">
            <template v-if="!user.contact_status.is_sender">
              <button class="button" @click="acceptContact" :disabled="isAddition">
                Принять заявку
              </button>
              <button class="button danger" @click="toggleContact" :disabled="isAddition">
                Отклонить заявку
              </button>
            </template>

            <button v-else class="button secondary" @click="toggleContact" :disabled="isAddition">
              Отменить запрос
            </button>
          </template>
        </template>
      </template>
    </div>
    <div v-if="user && user.id !== authStore.user?.id" class="menu">
      <div v-for="link in menuLinks" :key="link.name" class="list">
        <RouterLink :to="{ name: link.name }" class="item">
          {{ link.label }}
          <template v-if="Number(props.user[link.count]) > 0">
            ({{ props.user[link.count] }})
          </template>
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
import { useNotificationStore } from '@/stores/notifications.ts'
import AppTransition from '@/components/details/AppTransition.vue'

const menuLinks = [
  { name: 'photos', label: 'Фотографии', count: 'photos_count' },
  { name: 'videos', label: 'Видеозаписи', count: 'videos_count' },
  { name: 'contacts', label: 'Контакты', count: 'contacts_count' },
]

const props = defineProps<{
  user: any
  isLoading: boolean
}>()

const emit = defineEmits(['update-user'])

const notify = useNotificationStore()
const authStore = useAuthStore()
const route = useRoute()
const isAddition = ref(false)

const toggleContact = async () => {
  try {
    isAddition.value = true
    const response = await api.post(`/user/${route.params.id}/contact`)

    const updatedUser = {
      ...props.user,
      contact_status: response.data.contact_status,
      contacts_count: response.data.contacts_count,
    }
    emit('update-user', updatedUser)

    if (response.data.pending_contacts_count !== undefined) {
      authStore.setUser({
        pending_contacts_count: response.data.pending_contacts_count,
      })
    }

    if (response.data.message) {
      notify.show(response.data.message, 'info')
    }
    isAddition.value = false
  } catch (err) {
    console.error('Ошибка при работе с контактами', err)
  }
}

const acceptContact = async () => {
  try {
    isAddition.value = true
    const response = await api.post(`/user/${route.params.id}/contact/accept`)

    const updatedData = response.data

    const updatedUser = {
      ...props.user,
      contact_status: updatedData.contact_status,
      contacts_count: updatedData.contacts_count,
    }
    emit('update-user', updatedUser)

    if (updatedData.pending_contacts_count !== undefined) {
      authStore.setUser({ pending_contacts_count: updatedData.pending_contacts_count })
    }
    isAddition.value = false
  } catch (err) {
    console.error('Ошибка при работе с контактами', err)
  }
}
</script>

<style scoped>
.avatar {
  flex-shrink: 0;
}

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
