import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api.ts'
import { useAuthStore } from '@/stores/auth.ts'
import router from '@/router'

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const chat = ref<any>(null)
  const initChat = async (userId: string | number) => {
    try {
      isLoading.value = true
      const response = await api.post(`/user/${userId}/chat`)
      const chatId = response.data.data.id
      await router.push({ name: 'chat', params: { chatId: chatId } })
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const fetchChat = async (chatId: string | number) => {
    try {
      const myId = authStore.user?.id
      if (!myId) return

      isLoading.value = true
      const response = await api.get(`/user/${authStore.user?.id}/chat/${chatId}`)
      chat.value = response.data.data
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    chat,
    isLoading,
    initChat,
    fetchChat,
  }
})
