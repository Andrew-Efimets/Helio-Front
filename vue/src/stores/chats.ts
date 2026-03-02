import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api.ts'
import { useAuthStore } from '@/stores/auth.ts'
import router from '@/router'

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const isListLoading = ref(false)
  const chat = ref<any>(null)
  const allChats = ref<any>(null)
  const replyTo = ref<any>(null)

  const setReply = (comment: any) => (replyTo.value = comment)
  const clearReply = () => (replyTo.value = null)

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
      chat.value = []
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

  const addMessage = async (text: string, chatId) => {
    const payload = {
      text: text,
      parent_id: replyTo.value ? replyTo.value.id : null,
      parent_content: replyTo.value ? replyTo.value.content : null,
    }
    try {
      isLoading.value = true
      const response = await api.post(`/chats/chat/${chatId}/messages`, payload)
      if (chat.value && chat.value.messages && chat.value.messages.data) {
        chat.value.messages.data.push(response.data.data)
      }
      clearReply()
    } catch (e) {
      console.error('Ошибка отправки', e)
      throw e
    } finally {
      isLoading.value = false
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

  const updateMessage = async (
    messageId: number | string,
    text: string,
    chatId: number | string,
  ) => {
    try {
      isLoading.value = true
      const response = await api.patch(`/chats/chat/${chatId}/messages/${messageId}`, { text })

      if (chat.value?.messages?.data) {
        const index = chat.value.messages.data.findIndex((m: any) => m.id === messageId)
        if (index !== -1) {
          chat.value.messages.data[index] = response.data.data
        }
      }
    } catch (e) {
      console.error('Ошибка редактирования', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const deleteMessage = async (messageId: number | string, chatId: number | string) => {
    try {
      isLoading.value = true
      await api.delete(`/chats/chat/${chatId}/messages/${messageId}`)

      if (chat.value?.messages?.data) {
        chat.value.messages.data = chat.value.messages.data.filter((m: any) => m.id !== messageId)
      }
    } catch (e) {
      console.error('Ошибка удаления', e)
      throw e
    } finally {
      isLoading.value = false
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
    isListLoading,
    allChats,
    replyTo,
    addMessage,
    addEchoMessage,
    loadPreviousMessages,
    initChat,
    fetchChat,
    fetchAllChats,
    updateChatTitle,
    deleteChat,
    updateMessage,
    deleteMessage,
    setReply,
    clearReply,
  }
})
