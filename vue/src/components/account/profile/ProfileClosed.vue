<template>
  <div class="closed">
    <ProfileAvatar
      :user="user"
      :is-loading="isLoading"
      @update-user="(val) => userStore.setProfile(val)"
    />
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
import ProfileAvatar from '@/components/account/profile/ProfileAvatar.vue'
import { useUserStore } from '@/stores/user.ts'

const props = defineProps<{
  user: any
  isLoading: boolean
}>()

const emit = defineEmits(['update-user'])
const userStore = useUserStore()
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

.notify {
  font-size: 18px;
  font-weight: 700;
  color: #6e2c11;
  padding: 20px;
}

.info {
  padding: 40px 0 20px;
  width: 100%;
}

.wrapper {
  display: flex;
  flex-direction: column;
  background-color: #f5ddc5;
  min-height: 200px;
  box-shadow: var(--main-box-shadow);
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
