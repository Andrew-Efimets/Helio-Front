import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api.ts'
import { useChatStore } from '@/stores/chats.ts'
import { useRoute } from 'vue-router'

export const useMessageStore = defineStore('message', () => {
  const isLoading = ref(false)
  const messages = ref<any[]>([])
  const pagination = ref<any>(null)
  const replyTo = ref<any>(null)
  const editingMessage = ref<any>(null)
  const forwardingMessage = ref<any>(null)
  const route = useRoute()

  const setReply = (message: any) => {
    replyTo.value = message
    editingMessage.value = null
  }
  const clearReply = () => (replyTo.value = null)

  const setEdit = (message: any) => {
    editingMessage.value = message
    replyTo.value = null
  }
  const clearEdit = () => (editingMessage.value = null)

  const setForward = (message: any) => (forwardingMessage.value = message)
  const clearForward = () => (forwardingMessage.value = null)

  const fetchMessages = async (chatId: string | number) => {
    try {
      isLoading.value = true
      messages.value = []
      const response = await api.get(`/chats/chat/${chatId}`)
      messages.value = response.data.data.messages.data
      pagination.value = response.data.data.messages
      return response.data.data
    } finally {
      isLoading.value = false
    }
  }

  const addMessage = async (text: string, chatId: number | string) => {
    const payload = {
      text,
      parent_id: replyTo.value?.id || null,
      parent_content: replyTo.value?.content || null,
    }
    const response = await api.post(`/chats/chat/${chatId}/messages`, payload)
    messages.value.push(response.data.data)
    clearReply()
  }

  const updateMessage = async (
    messageId: number | string,
    text: string,
    chatId: number | string,
  ) => {
    const response = await api.patch(`/chats/chat/${chatId}/messages/${messageId}`, { text })
    const index = messages.value.findIndex((m) => m.id === messageId)
    if (index !== -1) messages.value[index] = response.data.data
  }

  const deleteMessage = async (messageId: number | string, chatId: number | string) => {
    await api.delete(`/chats/chat/${chatId}/messages/${messageId}`)
    messages.value = messages.value.filter((m) => m.id !== messageId)
  }

  const addEchoMessage = (message: any) => {
    if (Number(message.chat_id) !== Number(route.params.chatId)) return
    if (!messages.value.some((m) => m.id === message.id)) {
      messages.value.push(message)
    }
  }

  const updateEchoMessage = (updatedMsg: any) => {
    const index = messages.value.findIndex((m) => m.id === updatedMsg.id)
    if (index !== -1) messages.value[index] = updatedMsg
  }

  const deleteEchoMessage = (msgId: number | string) => {
    messages.value = messages.value.filter((m) => Number(m.id) !== Number(msgId))

    if (Number(replyTo.value?.id) === Number(msgId)) {
      clearReply()
    }
  }

  const loadPreviousMessages = async (chatId: string | number) => {
    if (isLoading.value || !pagination.value?.next_page_url) return

    try {
      isLoading.value = true
      const response = await api.get(pagination.value.next_page_url)
      const oldMessages = response.data.data.messages.data
      const newPagination = response.data.data.messages
      messages.value = [...oldMessages, ...messages.value]
      pagination.value = newPagination
    } catch (e) {
      console.error('Ошибка подгрузки сообщений', e)
    } finally {
      isLoading.value = false
    }
  }

  const markAsRead = async (chatId: number | string) => {
    const chatStore = useChatStore()
    if (document.visibilityState !== 'visible') return

    try {
      await api.post(`/chats/chat/${chatId}/read`)
      const chat = chatStore.allChats?.find((c) => c.id === chatId)
      if (chat) chat.unread_count = 0
    } catch (e) {
      console.error('Ошибка прочтения:', e)
    }
  }

  return {
    messages,
    pagination,
    isLoading,
    replyTo,
    editingMessage,
    forwardingMessage,
    markAsRead,
    fetchMessages,
    addMessage,
    addEchoMessage,
    loadPreviousMessages,
    updateEchoMessage,
    deleteEchoMessage,
    updateMessage,
    deleteMessage,
    setReply,
    clearReply,
    setEdit,
    clearEdit,
    setForward,
    clearForward,
  }
})
