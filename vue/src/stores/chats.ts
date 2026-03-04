import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

  const fetchAllChats = async (chatType?: string, silent = false) => {
    try {
      console.log(silent)
      if (!silent) {
        isListLoading.value = true
      }
      const response = await api.get(`/chats`, {
        params: {
          type: chatType,
        },
      })
      const chats = response.data.data
      allChats.value = chats.sort((a: any, b: any) => {
        const timeA = a.latest_message
          ? new Date(a.latest_message.created_at).getTime()
          : new Date(a.updated_at).getTime()
        const timeB = b.latest_message
          ? new Date(b.latest_message.created_at).getTime()
          : new Date(b.updated_at).getTime()

        return timeB - timeA
      })
    } catch (e) {
      throw e
    } finally {
      if (!silent) {
        isListLoading.value = false
      }
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

      chat.value = chatData

      if (allChats.value) {
        const chatIndex = allChats.value.findIndex((c) => Number(c.id) === Number(chatId))

        if (chatIndex !== -1) {
          const targetChat = { ...allChats.value[chatIndex] }
          targetChat.unread_count = 0
          targetChat.updated_at = new Date().toISOString()

          const otherChats = allChats.value.filter((c) => Number(c.id) !== Number(chatId))
          allChats.value = [targetChat, ...otherChats]
        }
      }
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

  const totalUnreadCount = computed(() => {
    if (!allChats.value) return 0
    return allChats.value.filter((chat) => (chat.unread_count || 0) > 0).length
  })

  return {
    chat,
    isLoading,
    isListLoading,
    allChats,
    totalUnreadCount,
    initChat,
    fetchChat,
    fetchAllChats,
    updateChatTitle,
    deleteChat,
  }
})
