<template>
  <AppHeader />
  <div class="app__container">
    <NotificationsView />
    <RouterView />
    <ScrollToTop />
  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { onMounted, watch, onUnmounted } from 'vue'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/footer/AppFooter.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useVideoStore } from '@/stores/videos'
import { usePhotoStore } from '@/stores/photos'
import NotificationsView from '@/views/NotificationsView.vue'
import { useNotificationStore } from '@/stores/notifications'
import { useUserStore } from '@/stores/user'
import ScrollToTop from '@/components/details/ScrollToTop.vue'
import { useChatStore } from '@/stores/chats.ts'
import { useMessageStore } from '@/stores/messages.ts'

onMounted(async () => {
  try {
    await axios.get('/sanctum/csrf-cookie')
  } catch (error) {
    console.error('Ошибка инициализации защиты')
  }
})

const authStore = useAuthStore()
const videoStore = useVideoStore()
const photoStore = usePhotoStore()
const notify = useNotificationStore()
const userStore = useUserStore()
const chatStore = useChatStore()
const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const setupGlobalListeners = (userId: number | string) => {
  const channel = window.Echo.private(`user.${userId}`)

  channel.listen('.VideoProcessed', (e: any) => {
    videoStore.updateVideoInList(e.video)
    notify.show('Видео доступно к просмотру!', 'success')
  })

  channel.listen('.PhotoProcessed', (e: any) => {
    photoStore.updatePhotoInList(e.photo)
  })

  channel.listen('.message.received', (e: any) => {
    const chatId = e.message.chat_id
    const chat = chatStore.allChats?.find((c) => Number(c.id) === Number(chatId))

    if (chat) {
      const isCurrentChat = Number(route.params.chatId) === Number(chatId)

      if (!isCurrentChat) {
        chat.unread_count = (chat.unread_count || 0) + 1
        chatStore.allChats = [
          chat,
          ...chatStore.allChats.filter((c) => Number(c.id) !== Number(chatId)),
        ]
      } else {
        chatStore.allChats = [
          chat,
          ...chatStore.allChats.filter((c) => Number(c.id) !== Number(chatId)),
        ]
      }
    }
  })

  channel.listen('.message.deleted', (e: any) => {
    messageStore.deleteEchoMessage(e.messageId)
    chatStore.fetchAllChats(undefined, true)
  })

  channel.listen('.chat.created', (e: any) => {
    chatStore.fetchAllChats(undefined, true)
  })

  channel.listen('.chat.terminated', (e: any) => {
    if (chatStore.allChats) {
      chatStore.allChats = chatStore.allChats.filter((c) => Number(c.id) !== Number(e.chatId))
    }

    if (Number(route.params.chatId) === Number(e.chatId)) {
      router.push({ name: 'chats' })
      chatStore.chat = null
    }
  })

  channel.listen('.member.added', (e: any) => {
    chatStore.fetchAllChats(undefined, true)
    if (Number(route.params.chatId) !== Number(e.chatId)) {
      notify.show(`${e.initiatorName} добавил(а) вас в группу '${e.chatTitle}'`, 'info')
    }
  })

  channel.listen('.member.deleted', (e: any) => {
    if (Number(route.params.chatId) !== Number(e.chatId)) {
      notify.show(`Вы удалены администратором из группы '${e.chatTitle}'`, 'error')
    } else {
      router.push({ name: 'chats' })
    }
    chatStore.fetchAllChats(undefined, true)
  })

  channel.listen('.contact.request', (data: any) => {
    userStore.triggerRefresh()
    const e = typeof data === 'string' ? JSON.parse(data) : data

    const myId = Number(authStore.user?.id)
    const senderId = Number(e.senderId)
    const receiverId = Number(e.receiverId)

    if (senderId === myId) {
      userStore.updateUserInList(receiverId, {
        type: 'pending',
        is_sender: false,
      })
      return
    }

    if (receiverId === myId) {
      notify.show(e.message, 'info')

      authStore.setUser({
        ...authStore.user,
        pending_contacts_count: (authStore.user?.pending_contacts_count || 0) + 1,
      })

      const newStatus = { type: 'pending', is_sender: true }

      if (userStore.profile && Number(userStore.profile.id) === senderId) {
        userStore.updateStatus(newStatus)
      }

      userStore.updateUserInList(senderId, newStatus)
    }
  })

  channel.listen('.contact.accepted', (e: any) => {
    userStore.triggerRefresh()
    const myId = Number(authStore.user?.id)
    if (Number(e.senderId) === myId) return

    notify.show(e.message, 'success')

    const isReceiver = Number(e.receiverId) === myId

    authStore.setUser({
      ...authStore.user,
      contacts_count: (authStore.user?.contacts_count || 0) + 1,
      pending_contacts_count: !isReceiver
        ? Math.max(0, (authStore.user?.pending_contacts_count || 0) - 1)
        : authStore.user?.pending_contacts_count,
    })

    const newStatus = { type: 'accepted', is_sender: false }
    if (userStore.profile && Number(userStore.profile.id) === Number(e.senderId)) {
      const newCount = (userStore.profile.contacts_count || 0) + 1
      userStore.updateStatus(newStatus, newCount)
    }
    userStore.updateUserInList(Number(e.senderId), {
      type: 'accepted',
      is_sender: false,
    })
  })

  channel.listen('.contact.deleted', (e: any) => {
    userStore.triggerRefresh()
    const myId = Number(authStore.user?.id)

    if (Number(e.senderId) === myId) return

    if (authStore.user) {
      const newUser = { ...authStore.user }

      if (e.status === 'pending') {
        if (e.isInitiator) {
          notify.show(`${e.senderName} отменил(а) запрос`, 'info')
          newUser.pending_contacts_count = Math.max(0, (newUser.pending_contacts_count || 0) - 1)
        } else {
          notify.show(`${e.senderName} отклонил(а) вашу заявку`, 'info')
        }
      } else {
        notify.show(`${e.senderName} удалил(а) вас из контактов`, 'info')
        newUser.contacts_count = Math.max(0, (newUser.contacts_count || 0) - 1)
      }

      authStore.setUser(newUser)
    }

    if (userStore.profile && Number(userStore.profile.id) === Number(e.senderId)) {
      const currentCount = userStore.profile.contacts_count || 0
      const newCount = e.status === 'accepted' ? Math.max(0, currentCount - 1) : currentCount
      userStore.updateStatus(null, newCount)
    }

    userStore.updateUserInList(Number(e.senderId), {
      type: null,
      is_sender: false,
    })
  })

  window.Echo.join('online')
    .here((users: any[]) => {
      userStore.setOnlineUsers(users)
    })
    .joining((user: any) => {
      userStore.addOnlineUser(user)
    })
    .leaving((user: any) => {
      userStore.removeOnlineUser(user)
    })
}

const storageSync = (event: StorageEvent) => {
  if (event.key === 'user_data' && event.newValue) {
    try {
      const freshUserData = JSON.parse(event.newValue)
      authStore.setUser(freshUserData)
    } catch (e) {
      console.error('Ошибка синхронизации вкладок', e)
    }
  }
}

window.addEventListener('storage', storageSync)

watch(
  () => authStore.user?.id,
  (newId, oldId) => {
    if (newId) {
      setupGlobalListeners(newId)
      chatStore.fetchAllChats()
    } else if (oldId) {
      window.Echo.leave(`user.${oldId}`)
      window.Echo.leave('online')
      userStore.setOnlineUsers([])
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  window.removeEventListener('storage', storageSync)
})
</script>
