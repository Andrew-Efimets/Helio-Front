<template>
  <div class="wrapper">
    <div class="item">
      <span v-if="videoStore.isLoading" class="app-loader"></span>
      <template v-else-if="video">
        <div class="player">
          <video
            v-if="video.video_url"
            :src="video.video_url"
            controls
            autoplay
            class="content"
          ></video>
          <div v-else class="loader">Видео обрабатывается сервером...</div>
        </div>
      </template>
      <div v-else class="notify">Видео не найдено</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useVideoStore } from '@/stores/videos.ts'
import { useNotificationStore } from '@/stores/notifications.ts'

const notify = useNotificationStore()
const route = useRoute()
const videoStore = useVideoStore()

const video = computed(() => {
  const id = Number(route.params.videoId)
  return videoStore.allVideos.find((v) => v.id === id) || null
})

onMounted(async () => {
  if (!video.value && route.params.videoId) {
    try {
      await videoStore.fetchVideoById(route.params.id as string, route.params.videoId as string)
    } catch (e: any) {
      notify.show('Видео не найдено', 'error')
    }
  }
})
</script>

<style scoped>
.wrapper {
  position: relative;
  margin: 20px;
}

.item {
  max-width: 600px;
  width: 100%;
  object-fit: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f2e7;
}

.player {
  object-fit: cover;
}

.content {
  max-width: 100%;
  max-height: 100%;
}

.loader {
  color: #6e2c11;
  font-size: 22px;
  padding: 40px;
}

.notify {
  color: #6e2c11;
  font-size: 22px;
  padding: 40px;
}

@media (max-width: 768px) {
  .item {
    margin: 0 auto;
  }
}
</style>
