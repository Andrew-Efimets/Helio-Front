<template>
  <div class="item" @mouseenter="play" @mouseleave="pause">
    <MediaLoadingPlaceholder v-if="!video.preview_url && !video.thumbnail_url" />
    <RouterLink
      :to="{ name: 'video', params: { id: route.params.id, videoId: video.id } }"
      class="link"
    >
      <img v-if="video.thumbnail_url" :src="video.thumbnail_url" class="img img--poster" />
      <video
        ref="videoPlayer"
        v-if="video.preview_url"
        :src="video.preview_url"
        class="video-preview"
        muted
        loop
        playsinline
      ></video>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MediaLoadingPlaceholder from '@/components/details/media/MediaLoadingPlaceholder.vue'
import { RouterLink, useRoute } from 'vue-router'

defineProps<{ video: any }>()
const videoPlayer = ref<HTMLVideoElement | null>(null)
const route = useRoute()

const play = () => {
  if (videoPlayer.value) videoPlayer.value.play().catch(() => {})
}
const pause = () => {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.currentTime = 0
  }
}
</script>

<style scoped>
.item {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f7e4d2;
  border-radius: 8px;
  position: relative;
}

.link {
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
}

.img--poster,
.video-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-preview {
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1;
}

.item:hover .video-preview {
  opacity: 1;
}

.item:hover .img--poster {
  opacity: 0;
}
</style>
