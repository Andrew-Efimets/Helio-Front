<template>
  <div class="videos">
    <div v-if="privacyError" class="container">
      <p class="error-message">{{ privacyError }}</p>
    </div>

    <div v-else class="container">
      <span v-if="videoStore.isLoading" class="app-loader"></span>

      <template v-else>
        <MediaAddBlock
          v-if="Number(authStore.user?.id) === Number(route.params.id)"
          media-type="video"
          :label="'Загрузить видео'"
          :is-upload="isUpload"
          :upload-progress="uploadProgress"
          @file-selected="sendVideo"
        />

        <div class="notify-wrapper">
          <p class="notify">
            {{ !videoStore.allVideos.length ? 'Видеозаписей пока нет' : 'Видеозаписи' }}
          </p>
        </div>

        <div v-if="videoStore.allVideos.length" class="wrapper">
          <div
            v-for="video in sortedDescDateVideos"
            :key="video.id"
            class="item"
            @mouseenter="playVideo"
            @mouseleave="pauseVideo"
          >
            <MediaLoadingPlaceholder v-if="!video.preview_url && !video.thumbnail_url" />
            <RouterLink :to="{ name: 'video', params: { videoId: video.id } }" class="link">
              <img v-if="video.thumbnail_url" :src="video.thumbnail_url" class="img img--poster" />
              <video
                v-if="video.preview_url"
                :src="video.preview_url"
                class="video-preview"
                muted
                loop
                playsinline
              ></video>
            </RouterLink>
          </div>
        </div>
      </template>
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
import MediaLoadingPlaceholder from '@/components/details/MediaLoadingPlaceholder.vue'
import MediaAddBlock from '@/components/details/MediaAddBlock.vue'

const notify = useNotificationStore()
const authStore = useAuthStore()
const videoStore = useVideoStore()
const route = useRoute()

const privacyError = ref<string | null>(null)
const isUpload = ref(false)
const uploadProgress = ref(0)

const sendVideo = async (file: File) => {
  if (!file) return
  if (file.size > 1024 * 1024 * 1024) {
    return notify.show('Файл слишком большой!', 'error')
  }

  try {
    isUpload.value = true
    const formData = new FormData()
    formData.append('video', file)

    const { data } = await api.post(`/user/${route.params.id}/video`, formData, {
      onUploadProgress: (p) => {
        if (p.total) uploadProgress.value = Math.round((p.loaded * 100) / p.total)
      },
    })

    notify.show('Видео загружено и обрабатывается', 'success')
    videoStore.allVideos.unshift(data.data.video)
  } catch (error: any) {
    notify.show('Ошибка загрузки', 'error')
  } finally {
    isUpload.value = false
    uploadProgress.value = 0
  }
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId && route.name === 'videos') {
      videoStore
        .fetchVideos(newId as string)
        .catch((e) => (privacyError.value = e.formattedMessage))
    }
  },
  { immediate: true },
)

const sortedDescDateVideos = computed(() =>
  [...videoStore.allVideos].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  ),
)

const playVideo = (e: Event) => (e.currentTarget as HTMLDivElement).querySelector('video')?.play()
const pauseVideo = (e: Event) => {
  const v = (e.currentTarget as HTMLDivElement).querySelector('video')
  if (v) {
    v.pause()
    v.currentTime = 0
  }
}
</script>

<style scoped>
.videos {
  padding: 10px 0 10px;
}

.container {
  background-color: #f5ddc5;
  min-width: 600px;
  min-height: 600px;
  text-align: center;
  padding-top: 10px;
}

.notify {
  color: #6e2c11;
  font-size: 18px;
  font-weight: 700;
}

.wrapper {
  margin: auto;
  width: fit-content;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.notify-wrapper {
  padding: 20px;
}

.error-message {
  width: 100%;
  font-size: 16px;
  padding: 20px;
  background-color: #e99a9a;
  color: darkred;
}

.link {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.video-preview {
  opacity: 0;
  transition: 0.3s;
}

.img--poster {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  transition: opacity 0.3s ease;
}

.item:hover .video-preview {
  opacity: 1;
}

.item:hover .img--poster {
  opacity: 0;
}

.item {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f7e4d2;
  border-radius: 8px;
}
</style>
