<template>
  <div class="videos">
    <div v-if="privacyError" class="videos__container">
      <p class="videos__error-message">{{ privacyError }}</p>
    </div>
    <div v-else class="videos__container">
      <div v-if="videoStore.isLoading">
        <span class="videos__loader"></span>
      </div>
      <div
        v-else-if="Number(authStore.user?.id) === Number(route.params.id)"
        class="videos__add-wrapper"
      >
        <p class="videos__add-label">
          {{ isUpload ? 'Загрузка видео...' : 'Загрузить видео' }}
        </p>

        <div v-if="isUpload" class="videos__loading" disabled>
          <span class="videos__percent">{{ uploadProgress }}%</span>
          <div class="videos__progress-back">
            <div class="videos__progress-line" :style="{ width: uploadProgress + '%' }"></div>
          </div>
        </div>

        <div v-else class="videos__button-wrapper" @click="!isUpload && fileInput?.click()">
          <p class="videos__button">&plus;</p>
        </div>

        <input
          type="file"
          ref="fileInput"
          style="display: none"
          accept="video/*"
          @change="onFileSelected"
        />
      </div>

      <div v-if="!videoStore.isLoading" class="videos__notify-wrapper">
        <p class="videos__notify">
          {{ !videoStore.allVideos?.length ? 'Видеозаписей пока нет' : 'Видеозаписи' }}
        </p>
      </div>
      <div class="videos__wrapper" v-if="videoStore.allVideos.length > 0">
        <div
          class="videos__item"
          v-for="video in sortedDescDateVideos"
          :key="video.id"
          @mouseenter="playVideo($event)"
          @mouseleave="pauseVideo($event)"
        >
          <div v-if="!video.video_url" class="videos__placeholder">
            <div class="videos__skeleton-pulse"></div>
            <span class="videos__status-tag">Обработка...</span>
          </div>
          <RouterLink
            :to="{ name: 'video', params: { id: route.params.id, videoId: video.id } }"
            class="videos__link"
          >
            <img
              v-if="video.thumbnail_url"
              :src="video.thumbnail_url"
              class="videos__img videos__img--poster"
            />
            <video
              v-if="video.preview_url"
              :src="video.preview_url"
              class="videos__img videos__video"
              preload="none"
              muted
              loop
              playsinline
              crossorigin="anonymous"
            ></video>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api'
import { useAuthStore } from '@/stores/auth.ts'
import { useVideoStore } from '@/stores/videos.ts'
import { useRoute, RouterLink } from 'vue-router'
import { watch, ref, computed } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

const notify = useNotificationStore()
const authStore = useAuthStore()
const videoStore = useVideoStore()
const route = useRoute()
const privacyError = ref()
const isUpload = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadProgress = ref(0)

const getVideos = async (userId?: string | string[]) => {
  const id = userId || route.params.id
  privacyError.value = null
  videoStore.allVideos = []

  if (!id) return

  try {
    await videoStore.fetchVideos(id as string)
    privacyError.value = null
  } catch (error: any) {
    privacyError.value = error.formattedMessage
  }
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 1024 * 1024 * 1024) {
      alert('Файл слишком большой!')
      return
    }
    sendVideo(file)
  }
}

const sendVideo = async (file: File) => {
  try {
    isUpload.value = true
    uploadProgress.value = 0

    const formData = new FormData()
    formData.append('video', file)

    const response = await api.post(`/user/${route.params.id}/video`, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      },
    })

    notify.show('Видео на сервере. Ожидайте уведомление о загрузке!', 'success')
    videoStore.allVideos.unshift(response.data.data.video)
  } catch (error: any) {
    console.log(error.formattedMessage, error)
    notify.show('Видео загрузилось не удалось. Попробуйте ещё раз', 'error')
  } finally {
    if (fileInput.value) fileInput.value.value = ''
    isUpload.value = false
    uploadProgress.value = 0
  }
}

const sortedDescDateVideos = computed(() => {
  return [...videoStore.allVideos].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
})

const playVideo = (event: MouseEvent) => {
  const container = event.currentTarget as HTMLElement
  const video = container.querySelector('video') as HTMLVideoElement
  const img = container.querySelector('img') as HTMLImageElement

  if (video) {
    video
      .play()
      .then(() => {
        video.style.opacity = '1'
        if (img) img.style.opacity = '0'
      })
      .catch(() => {})
  }
}

const pauseVideo = (event: MouseEvent) => {
  const container = event.currentTarget as HTMLElement
  const video = container.querySelector('video') as HTMLVideoElement
  const img = container.querySelector('img') as HTMLImageElement

  if (video) {
    video.pause()
    video.currentTime = 0
    video.style.opacity = '0'
    if (img) img.style.opacity = '1'
  }
}

watch(
  () => [route.params.id, route.name],
  ([newId, newName]) => {
    if (newId && newName === 'videos') {
      getVideos(newId as string)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
@import '@/assets/css/pages/videos-list.css';
</style>
