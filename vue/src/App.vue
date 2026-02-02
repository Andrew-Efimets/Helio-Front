<template>
  <AppHeader />
  <div class="app__container">
    <RouterView />
  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref, watch, onUnmounted } from 'vue'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/footer/AppFooter.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useVideoStore } from '@/stores/videos'
import { usePhotoStore } from '@/stores/photos'
// import { useChatStore } from '@/stores/chats'
// import { useToast } from 'vue-toastification'

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
// const toast = useToast()

const setupGlobalListeners = (userId: number | string) => {
  const channel = window.Echo.private(`user.${userId}`)

  channel.listen('.VideoProcessed', (e: any) => {
    videoStore.updateVideoInList(e.video)
    console.log(e.video)
    // toast.success('Ваше видео готово!')
  })

  channel.listen('.PhotoProcessed', (e: any) => {
    photoStore.updatePhotoInList(e.photo)
  })

  channel.listen('.NewMessage', (e: any) => {
    // chatStore.addMessage(e.message)
    // if (route.name !== 'chat') toast.info(`Новое сообщение от ${e.message.user.name}`)
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

<style>
@import '@/assets/css/app.css';
</style>
