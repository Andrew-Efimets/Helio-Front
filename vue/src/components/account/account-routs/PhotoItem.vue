<template>
  <div class="photo">
    <div class="photo__container">
      <div class="photo__wrapper">
        <div class="photo__arrow-wrapper left">
          <span
            class="photo__arrow"
            @click="prev"
            v-if="photoStore.getPrevPhotoId(Number(route.params?.photoId))"
          >
            &#10094;
          </span>
        </div>
        <div class="photo__arrow-wrapper right">
          <span
            class="photo__arrow"
            @click="next"
            v-if="photoStore.getNextPhotoId(Number(route.params?.photoId))"
          >
            &#10095;
          </span>
        </div>
        <div class="photo__item-wrapper">
          <img class="photo__item" v-if="currentPhoto" :src="currentPhoto.photo_url" alt="photo" />
        </div>
        <p class="photo__loading" v-if="photoStore.isLoading">Загрузка...</p>
      </div>
      <CommentsMedia />
    </div>
    <div class="photo__bottom">
      <LikesMedia />
      <button
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
import LikesMedia from '@/components/details/LikesMedia.vue'
import CommentsMedia from '@/components/details/CommentsMedia.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePhotoStore } from '@/stores/photos'
import api from '@/api'

const route = useRoute()
const router = useRouter()
const photoStore = usePhotoStore()
const isDeleting = ref(false)
const isConfirmOpen = ref(false)

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
  } catch (error: any) {
    console.error(error.formattedMessage)
    isDeleting.value = false
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
@import '@/assets/css/pages/photo-item.css';
</style>
