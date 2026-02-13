<template>
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
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePhotoStore } from '@/stores/photos.ts'

const route = useRoute()
const router = useRouter()
const photoStore = usePhotoStore()

const currentPhoto = computed(() => {
  return photoStore.allPhotos.find((p) => Number(p.id) === Number(route.params.photoId))
})

const next = () => {
  const id = photoStore.getNextPhotoId(route.params.photoId as string)
  if (id) goTo(id)
}

const prev = () => {
  const id = photoStore.getPrevPhotoId(route.params.photoId as string)
  if (id) goTo(id)
}

const goTo = (id: number | string) => {
  router.push({ params: { ...route.params, photoId: id } })
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
.wrapper {
  position: relative;
  margin: 25px;
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
  margin: 5px;
  max-width: 600px;
  max-height: 600px;
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

@media (max-width: 768px) {
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
