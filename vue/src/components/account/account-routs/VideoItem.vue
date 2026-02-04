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
    <div class="video__bottom">
      <LikesMedia />
      <button
        class="button button--danger"
        type="button"
        @click="isConfirmOpen = true"
        :disabled="isDeleting"
      >
        {{ isDeleting ? 'удаление' : 'удалить видео' }}
      </button>
    </div>
    <ConfirmModal :is-open="isConfirmOpen" @close="isConfirmOpen = false" @confirm="deleteVideo">
      <p>Вы действительно хотите удалить видео?</p>
      <template #button__text>Да, удалить</template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/videos.ts'
import CommentsMedia from '@/components/details/CommentsMedia.vue'
import LikesMedia from '@/components/details/LikesMedia.vue'
import ConfirmModal from '@/components/details/ConfirmModal.vue'
import api from '@/api.ts'
import { useNotificationStore } from '@/stores/notifications'

const notify = useNotificationStore()
const route = useRoute()
const router = useRouter()
const videoStore = useVideoStore()
const isConfirmOpen = ref(false)
const isDeleting = ref(false)

const video = computed(() => {
  const videoId = Number(route.params.videoId)
  return videoStore.allVideos.find((v) => v.id === videoId) || null
})

const deleteVideo = async () => {
  isConfirmOpen.value = false
  const videoId = Number(route.params.videoId)
  const userId = Number(route.params.id)

  videoStore.removeVideoFromStore(videoId)
  router.push({ name: 'videos', params: { id: userId } })

  try {
    isDeleting.value = true
    await api.delete(`/user/${userId}/video/${videoId}`)
    isDeleting.value = false
  } catch (error: any) {
    console.error(error.formattedMessage)
    isDeleting.value = false
    notify.show('Видео не удалось удалить. Попробуйте снова', 'error')
  }
}

onMounted(async () => {
  if (videoStore.allVideos.length === 0) {
    await videoStore.fetchVideos(route.params.id as string)
  }
})
</script>

<style scoped>
@import '@/assets/css/pages/video-item.css';
</style>
