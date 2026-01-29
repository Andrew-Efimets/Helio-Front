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
    <LikesMedia />
  </div>
</template>

<script setup lang="ts">
import LikesMedia from '@/components/details/LikesMedia.vue'
import CommentsMedia from '@/components/details/CommentsMedia.vue'
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePhotoStore } from '@/stores/photos'

const route = useRoute()
const router = useRouter()
const photoStore = usePhotoStore()

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
