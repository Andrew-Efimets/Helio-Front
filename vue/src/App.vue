<template>
  <AppHeader />
  <div class="app__container">
    <NotificationsView />
    <RouterView />
  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { onMounted, ref, watch, onUnmounted } from 'vue'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/footer/AppFooter.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useVideoStore } from '@/stores/videos'
import { usePhotoStore } from '@/stores/photos'
import NotificationsView from '@/views/NotificationsView.vue'
import { useNotificationStore } from '@/stores/notifications.ts'
// import { useChatStore } from '@/stores/chats'
import { useUserStore } from '@/stores/user'

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
const route = useRoute()
const userStore = useUserStore()

const setupGlobalListeners = (userId: number | string) => {
  const channel = window.Echo.private(`user.${userId}`)

  channel.listen('.VideoProcessed', (e: any) => {
    videoStore.updateVideoInList(e.video)
    notify.show('Видео доступно к просмотру!', 'success')
  })

  channel.listen('.PhotoProcessed', (e: any) => {
    photoStore.updatePhotoInList(e.photo)
  })

  channel.listen('.NewMessage', (e: any) => {
    // chatStore.addMessage(e.message)
    // if (route.name !== 'chat') toast.info(`Новое сообщение от ${e.message.user.name}`)
  })

  channel.listen('.contact.request', (e: any) => {
    const myId = Number(authStore.user?.id)
    if (Number(e.senderId) === myId) return

    notify.show(e.message, 'info')

    if (authStore.user && Number(e.receiverId) === myId) {
      authStore.setUser({
        ...authStore.user,
        pending_contacts_count: (authStore.user.pending_contacts_count || 0) + 1,
      })
    }

    if (userStore.profile && Number(userStore.profile.id) === Number(e.senderId)) {
      userStore.updateStatus({ type: 'pending', is_sender: true })
    }
  })

  channel.listen('.contact.accepted', (e: any) => {
    const myId = Number(authStore.user?.id)
    if (Number(e.receiverId) === myId) return

    notify.show(e.message, 'success')

    if (authStore.user) {
      authStore.setUser({
        ...authStore.user,
        contacts_count: (authStore.user.contacts_count || 0) + 1,
      })
    }

    if (userStore.profile && Number(userStore.profile.id) === Number(e.senderId)) {
      userStore.updateStatus(
        { type: 'accepted', is_sender: false },
        (userStore.profile.contacts_count || 0) + 1,
      )
    }
  })

  channel.listen('.contact.deleted', (e: any) => {
    const myId = Number(authStore.user?.id)
    if (Number(e.senderId) === myId) return

    if (authStore.user) {
      const newUser = { ...authStore.user }
      if (e.status === 'pending') {
        notify.show(`${e.senderName} отклонил(а) заявку`, 'info')
        newUser.pending_contacts_count = Math.max(0, (newUser.pending_contacts_count || 0) - 1)
      } else {
        notify.show(`${e.senderName} удалился(ась) из контактов`, 'info')
        newUser.contacts_count = Math.max(0, (newUser.contacts_count || 0) - 1)
      }
      authStore.setUser(newUser)
    }

    if (userStore.profile && Number(userStore.profile.id) === Number(e.senderId)) {
      const currentCount = userStore.profile.contacts_count || 0
      const newCount = e.status === 'accepted' ? Math.max(0, currentCount - 1) : currentCount
      userStore.updateStatus(null, newCount)
    }
  })
}

watch(
  () => authStore.user?.id,
  (newId, oldId) => {
    if (newId) {
      setupGlobalListeners(newId)
    } else if (oldId) {
      window.Echo.leave(`user.${oldId}`)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (authStore.user?.id) {
    window.Echo.leave(`user.${authStore.user.id}`)
  }
})
</script>

<style></style>
