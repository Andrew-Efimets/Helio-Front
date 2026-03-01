import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api.ts'
import { useAuthStore } from '@/stores/auth.ts'
import router from '@/router'

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const chat = ref<any>(null)
  const allChats = ref<any>(null)

  const fetchAllChats = async (chatType: string) => {
    try {
      isLoading.value = true
      const response = await api.get(`/chats`, {
        params: {
          type: chatType,
        },
      })
      allChats.value = response.data.data
    } catch (e) {
      throw e
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

  const fetchChat = async (chatId: string | number) => {
    try {
      const myId = authStore.user?.id
      if (!myId) return

      isLoading.value = true
      const response = await api.get(`/chats/chat/${chatId}`)
      chat.value = response.data.data
    } catch (e) {
      console.error(e)
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

  const addMessage = async (userId: string | number, text: string, chatId) => {
    try {
      const response = await api.post(`/chats/chat/${chatId}/messages`, { text })
      if (chat.value && chat.value.messages && chat.value.messages.data) {
        chat.value.messages.data.push(response.data.data)
      }
    } catch (e) {
      console.error('Ошибка отправки', e)
      throw e
    }
  }

  const addEchoMessage = (message: any) => {
    if (chat.value) {
      const exists = chat.value.messages.data.some((m: any) => m.id === message.id)
      if (!exists) {
        chat.value.messages.data.push(message)
      }
    }
  }

  const loadPreviousMessages = async (chatId: string | number) => {
    const pagination = chat.value?.messages
    if (isLoading.value || !pagination?.next_page_url) return

    try {
      isLoading.value = true
      const response = await api.get(pagination.next_page_url)

      const oldMessages = response.data.data.messages.data
      chat.value.messages.data = [...oldMessages, ...chat.value.messages.data]
      chat.value.messages.next_page_url = response.data.data.messages.next_page_url
      chat.value.messages.current_page = response.data.data.messages.current_page
    } finally {
      isLoading.value = false
    }
  }

  return {
    chat,
    isLoading,
    allChats,
    addMessage,
    addEchoMessage,
    loadPreviousMessages,
    initChat,
    fetchChat,
    fetchAllChats,
    updateChatTitle,
    deleteChat,
  }
})
