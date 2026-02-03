<template>
  <div class="video">
    <div class="video__container">
      <div class="video__wrapper">
        <div class="video__item">
          <div v-if="video" class="video__player">
            <video
              v-if="video.video_url"
              :src="video.video_url"
              controls
              autoplay
              class="video__content"
            ></video>
            <div v-else class="video__loader">Обработка...</div>
          </div>
          <div v-else class="video__notify">Видео не найдено (ID: {{ route.params.videoId }})</div>
        </div>
      </div>
      <CommentsMedia />
    </div>
    <LikesMedia />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useVideoStore } from '@/stores/videos.ts'
import CommentsMedia from '@/components/details/CommentsMedia.vue'
import LikesMedia from '@/components/details/LikesMedia.vue'

const route = useRoute()
const videoStore = useVideoStore()

const video = computed(() => {
  const videoId = Number(route.params.videoId)
  return videoStore.allVideos.find((v) => v.id === videoId) || null
})
</script>

<style scoped>
@import '@/assets/css/pages/video-item.css';
</style>
