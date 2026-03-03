import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api.ts'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.ts'
import { useMessageStore } from '@/stores/messages.ts'

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const isListLoading = ref(false)
  const chat = ref<any>(null)
  const allChats = ref<any>(null)

  const fetchAllChats = async (chatType: string) => {
    try {
      isListLoading.value = true
      allChats.value = []
      const response = await api.get(`/chats`, {
        params: {
          type: chatType,
        },
      })
      allChats.value = response.data.data
    } catch (e) {
      throw e
    } finally {
      isListLoading.value = false
    }
  }

  const fetchChat = async (chatId: string | number) => {
    const messageStore = useMessageStore()
    try {
      const myId = authStore.user?.id
      if (!myId) return
      chat.value = null
      isLoading.value = true
      const chatData = await messageStore.fetchMessages(chatId)
      if (chatData.id == chatId) {
        chat.value = chatData
      }
      chat.value = chatData
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const initChat = async (contactId: string | number) => {
    try {
      isLoading.value = true
      const response = await api.post(`/chats/chat`, { contactId })
      const chatId = response.data.data.id
      await router.push({ name: 'chat', params: { chatId: chatId } })
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const updateChatTitle = async (chatId: number, title: string) => {
    await api.patch(`/chats/chat/${chatId}`, { title })
  }

  const deleteChat = async (chatId: number) => {
    await api.delete(`/chats/chat/${chatId}`)
  }

  return {
    chat,
    isLoading,
    isListLoading,
    allChats,
    initChat,
    fetchChat,
    fetchAllChats,
    updateChatTitle,
    deleteChat,
  }
})
