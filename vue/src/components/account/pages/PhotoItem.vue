<template>
  <div class="photo">
    <div class="container">
      <span class="app-loader" v-if="photoStore.isLoading"></span>
      <template v-else>
        <div class="wrapper">
          <div class="arrow-wrapper left">
            <span
              class="arrow"
              @click="prev"
              v-if="photoStore.getPrevPhotoId(Number(route.params?.photoId))"
            >
              &#10094;
            </span>
          </div>
          <div class="arrow-wrapper right">
            <span
              class="arrow"
              @click="next"
              v-if="photoStore.getNextPhotoId(Number(route.params?.photoId))"
            >
              &#10095;
            </span>
          </div>
          <div class="item-wrapper">
            <img class="item" v-if="currentPhoto" :src="currentPhoto.photo_url" alt="photo" />
          </div>
        </div>
      </template>
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
        {{ isDeleting ? 'Удаление...' : 'Удалить фотографию' }}
      </button>
    </div>
    <ConfirmModal :is-open="isConfirmOpen" @close="isConfirmOpen = false" @confirm="deletePhoto">
      <p>Вы действительно хотите удалить фотографию?</p>
      <template #button__text>Да, удалить</template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import ConfirmModal from '@/components/details/ConfirmModal.vue'
import LikesMedia from '@/components/details/media/LikesMedia.vue'
import CommentsMedia from '@/components/details/media/CommentsMedia.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePhotoStore } from '@/stores/photos'
import api from '@/api'
import { useAuthStore } from '@/stores/auth.ts'
import { useNotificationStore } from '@/stores/notifications.ts'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const photoStore = usePhotoStore()
const isDeleting = ref(false)
const isConfirmOpen = ref(false)
const notify = useNotificationStore()
const isOwner = computed(() => Number(authStore.user?.id) === Number(route.params.id))

const currentPhoto = computed(() => {
  return photoStore.allPhotos.find((p) => Number(p.id) === Number(route.params.photoId))
})

const next = () => {
  const id = photoStore.getNextPhotoId(route.params.photoId as string)
  if (id) router.push({ params: { ...route.params, photoId: id } })
}

const prev = () => {
  const id = photoStore.getPrevPhotoId(route.params.photoId as string)
  if (id) router.push({ params: { ...route.params, photoId: id } })
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'Escape') router.back()
}

const deletePhoto = async () => {
  isConfirmOpen.value = false

  const photoIdToDelete = Number(route.params.photoId)
  const userId = route.params.id

  const nextId = photoStore.getNextPhotoId(photoIdToDelete)
  const prevId = photoStore.getPrevPhotoId(photoIdToDelete)

  try {
    isDeleting.value = true
    await api.delete(`/user/${userId}/photo/${photoIdToDelete}`)

    photoStore.removePhotoFromStore(photoIdToDelete)

    if (nextId) {
      router.replace({ params: { ...route.params, photoId: nextId } })
    } else if (prevId) {
      router.replace({ params: { ...route.params, photoId: prevId } })
    } else {
      router.push({ name: 'photos', params: { id: userId } })
    }
    isDeleting.value = false
    notify.show('Фотография удалена', 'success')
  } catch (error: any) {
    console.error(error.formattedMessage)
    isDeleting.value = false
    notify.show('Не удалось удалить фотографию', 'error')
  }
}

onMounted(async () => {
  if (photoStore.allPhotos.length === 0) {
    await photoStore.fetchPhotos(route.params.id as string)
  }
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.photo {
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
  display: flex;
  text-align: center;
  justify-content: center;
}

.left {
  position: absolute;
  right: 100%;
  top: 50%;
}

.right {
  position: absolute;
  top: 50%;
  left: 100%;
}

.arrow-wrapper {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: inset 0 0 3px 3px rgba(190, 127, 25, 0.3);
  cursor: pointer;
}

.arrow {
  text-align: center;
  line-height: 1;
  font-size: 22px;
  font-weight: bold;
  color: #6e2c11;
  width: 100%;
}

.arrow-wrapper:active {
  scale: 0.9;
}

.item-wrapper {
  margin: 20px;
  width: 600px;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
}

.item {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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

  .arrow-wrapper {
    position: absolute;
    z-index: 10;
    background: rgba(255, 255, 255, 0.7);
  }

  .left {
    left: 10px;
    right: auto;
  }

  .right {
    right: 10px;
    left: auto;
  }

  .item-wrapper {
    width: 90vw;
    height: 90vw;
    margin: 10px auto;
  }
}
</style>
