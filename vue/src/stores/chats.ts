import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api.ts'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.ts'
import { useMessageStore } from '@/stores/messages.ts'
import { useRoute } from 'vue-router'
import { useNotificationStore } from '@/stores/notifications.ts'

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const isListLoading = ref(false)
  const chat = ref<any>(null)
  const allChats = ref<any>(null)
  const route = useRoute()
  const notify = useNotificationStore()
  const editingGroup = ref<any | null>(null)
  const searchQuery = ref('')

  const filteredChats = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return allChats.value

    return allChats.value.filter((chat) => {
      const titleMatch = chat.title?.toLowerCase().includes(query)

      const companionMatch = chat.participants?.some((p) => p.name.toLowerCase().includes(query))

      return titleMatch || companionMatch
    })
  })

  const fetchAllChats = async (chatType?: string, silent = false) => {
    try {
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

  const startEdit = (chatData: any) => {
    editingGroup.value = chatData
  }

  const cancelEdit = () => {
    editingGroup.value = null
  }

  const updateGroup = async (chatId: number, title: string, avatar: File | null) => {
    try {
      const formData = new FormData()
      formData.append('title', title)

      formData.append('_method', 'PATCH')

      if (avatar) {
        formData.append('avatar', avatar)
      }

      const response = await api.post(`/chats/chat/${chatId}`, formData)
      const updatedChat = response.data.data

      if (updatedChat) {
        if (chat.value && Number(chat.value.id) === Number(chatId)) {
          chat.value = { ...chat.value, ...updatedChat }
        }

        const index = allChats.value.findIndex((c) => Number(c.id) === Number(chatId))
        if (index !== -1) {
          allChats.value[index] = { ...allChats.value[index], ...updatedChat }
        }
      }
      return updatedChat
    } catch (e) {
      console.error('Ошибка при редактировании группы:', e)
      throw e
    }
  }

  const totalUnreadCount = computed(() => {
    if (!allChats.value) return 0
    return allChats.value.filter((chat) => (chat.unread_count || 0) > 0).length
  })

  const leaveChat = async (chatId: any) => {
    try {
      const chat = allChats.value.find((c) => Number(c.id) === Number(chatId))
      const notifyText = chat?.type === 'private' ? 'Чат удалён' : 'Группа удалена'
      await api.post(`/chats/chat/${chatId}/leave`)
      allChats.value = allChats.value.filter((chat) => Number(chat.id) !== Number(chatId))

      if (Number(route.params.chatId) === Number(chatId)) {
        router.push({ name: 'chats' })
      }

      notify.show(notifyText, 'success')
    } catch (e) {
      console.error('Ошибка при выходе из чата:', e)
    }
  }

  const setGroup = async (title: string, avatar: File | null) => {
    try {
      const formData = new FormData()
      formData.append('title', title)

      if (avatar) {
        formData.append('avatar', avatar)
      }

      const response = await api.post(`/chats/group`, formData)

      if (response.data.data) {
        allChats.value.unshift(response.data.data)
      }

      return response.data.data
    } catch (e) {
      console.error('Ошибка при создании группы:', e)
      throw e
    }
  }

  const addMember = async (chatId: string | number, userId: string | number) => {
    try {
      const { data } = await api.post(`/chats/chat/${chatId}/members/${userId}`)
      if (chat.value && data.newMember) {
        chat.value.participants.push(data.newMember)
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const deleteMember = async (chatId: string | number, userId: string | number) => {
    try {
      await api.delete(`/chats/chat/${chatId}/members/${userId}`)
      if (chat.value) {
        chat.value.participants = chat.value.participants.filter(
          (p: any) => Number(p.id) !== Number(userId),
        )
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  return {
    chat,
    isLoading,
    isListLoading,
    allChats,
    totalUnreadCount,
    editingGroup,
    filteredChats,
    searchQuery,
    startEdit,
    cancelEdit,
    initChat,
    fetchChat,
    fetchAllChats,
    updateGroup,
    leaveChat,
    setGroup,
    deleteMember,
    addMember,
  }
})
