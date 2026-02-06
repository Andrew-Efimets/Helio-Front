<template>
  <div class="video">
    <div class="container">
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
          <div v-else class="notify">Видео не найдено (ID: {{ route.params.videoId }})</div>
        </div>
      </div>
      <CommentsMedia />
    </div>
    <div class="bottom">
      <LikesMedia />
      <button
        v-if="isOwner"
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
import { useAuthStore } from '@/stores/auth.ts'
import CommentsMedia from '@/components/details/media/CommentsMedia.vue'
import LikesMedia from '@/components/details/media/LikesMedia.vue'
import ConfirmModal from '@/components/details/ConfirmModal.vue'
import api from '@/api.ts'
import { useNotificationStore } from '@/stores/notifications'

const authStore = useAuthStore()
const notify = useNotificationStore()
const route = useRoute()
const router = useRouter()
const videoStore = useVideoStore()
const isConfirmOpen = ref(false)
const isDeleting = ref(false)
const isOwner = computed(() => Number(authStore.user?.id) === Number(route.params.id))

const video = computed(() => {
  const id = Number(route.params.videoId)
  return videoStore.allVideos.find((v) => v.id === id) || null
})

onMounted(async () => {
  if (!video.value) {
    try {
      await videoStore.fetchVideoById(route.params.id as string, route.params.videoId as string)
    } catch (e: any) {
      notify.show('Видео не найдено', 'error')
    }
  }
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
    notify.show('Видео успешно удалено', 'success')
  } catch (error: any) {
    console.error(error.formattedMessage)
    isDeleting.value = false
    notify.show('Видео не удалось удалить. Попробуйте снова', 'error')
  }
}
</script>

<style scoped>
.video {
  user-select: none;
  max-width: 100%;
  max-height: 100%;
}

.container {
  display: flex;
  align-items: center;
}

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

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-self: center;
  }
  .item {
    margin: 0 auto;
  }
}
</style>
