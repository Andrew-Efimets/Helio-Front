<template>
  <div class="media">
    <div class="container">
      <PhotoItem v-if="mediaType === 'photo'" />
      <VideoItem v-if="mediaType === 'video'" />
      <CommentsMedia
        v-if="mediaId && mediaType"
        :key="`${mediaType}-${mediaId}`"
        :media-id="mediaId"
        :media-type="mediaType"
        :owner-id="ownerId"
      />
    </div>
    <div class="bottom">
      <LikesMedia
        v-if="mediaId && mediaType"
        :media-id="mediaId"
        :media-type="mediaType"
        :owner-id="ownerId"
      />
      <button
        v-if="isOwner"
        class="button button--danger"
        type="button"
        @click="isConfirmOpen = true"
        :disabled="isLoading"
      >
        {{
          isLoading ? 'удаление...' : `удалить ${mediaType === 'video' ? 'видео' : 'фотографию'}`
        }}
      </button>
    </div>
    <ConfirmModal
      v-if="isConfirmOpen"
      :is-open="isConfirmOpen"
      @close="isConfirmOpen = false"
      @confirm="deleteMedia"
    >
      <p>Вы действительно хотите удалить {{ mediaType === 'video' ? 'видео' : 'фотографию' }}?</p>
      <template #button__text>Да, удалить</template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/videos'
import { usePhotoStore } from '@/stores/photos'
import { useAuthStore } from '@/stores/auth'
import PhotoItem from '@/components/details/media/PhotoItem.vue'
import VideoItem from '@/components/details/media/VideoItem.vue'
import CommentsMedia from '@/components/details/media/CommentsMedia.vue'
import LikesMedia from '@/components/details/media/LikesMedia.vue'
import ConfirmModal from '@/components/details/ConfirmModal.vue'

const route = useRoute()
const router = useRouter()
const videoStore = useVideoStore()
const photoStore = usePhotoStore()
const authStore = useAuthStore()
const isConfirmOpen = ref(false)

const mediaType = computed(() => {
  if (route.params.videoId) return 'video'
  if (route.params.photoId) return 'photo'
  return null
})

const mediaId = computed(() => {
  const id = route.params.videoId || route.params.photoId
  return Array.isArray(id) ? id[0] : String(id || '')
})

const ownerId = computed((): string => {
  const id = route.params.id
  const rawId = Array.isArray(id) ? id[0] : id
  return String(rawId || '')
})
const isOwner = computed(() => Number(authStore.user?.id) === Number(route.params.id))
const isLoading = computed(() => videoStore.isLoading || photoStore.isLoading)

const deleteMedia = async () => {
  isConfirmOpen.value = false
  const userId = route.params.id as string

  try {
    if (mediaType.value === 'video') {
      const videoId = route.params.videoId as string
      router.push({ name: 'videos', params: { id: userId } })
      videoStore.removeVideoFromStore(videoId)
      await videoStore.deleteVideo(userId, videoId)
    } else if (mediaType.value === 'photo') {
      const photoId = Number(route.params.photoId)
      const nextId = photoStore.getNextPhotoId(photoId)
      const prevId = photoStore.getPrevPhotoId(photoId)
      photoStore.removePhotoFromStore(photoId)

      if (nextId) {
        router.replace({ params: { ...route.params, photoId: nextId } })
      } else if (prevId) {
        router.replace({ params: { ...route.params, photoId: prevId } })
      } else {
        router.push({ name: 'photos', params: { id: userId } })
      }
      await photoStore.deletePhoto(userId, photoId)
    }
  } catch (error) {
    console.error('Удаление прервано из-за ошибки сервера')
  }
}
</script>

<style scoped>
.media {
  user-select: none;
  max-width: 100%;
  max-height: 100%;
}

.container {
  display: flex;
  align-items: center;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
}

@media screen and (max-width: 1024px) {
  .container {
    flex-direction: column;
    align-self: center;
  }

  .media {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bottom {
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .bottom {
    flex-direction: column;
  }
}
</style>
