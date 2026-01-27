import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

interface ExternalUser {
  id: number
  name: string
  avatar?: string
  phone?: string
  profile?: {
    country?: string
    city?: string
    birthday?: string
    privacy: Record<string, string>
  }
}

export const useUserStore = defineStore('user', () => {
  const viewedUser = ref<ExternalUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUser(id: string | number) {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get(`/user/${id}`)
      viewedUser.value = response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Пользователь не найден'
      viewedUser.value = null
    } finally {
      isLoading.value = false
    }
  }

  function clearViewedUser() {
    viewedUser.value = null
    error.value = null
  }

  return { viewedUser, isLoading, error, fetchUser, clearViewedUser }
})
