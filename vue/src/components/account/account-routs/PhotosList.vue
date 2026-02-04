<template>
  <div class="photos">
    <div v-if="privacyError" class="photos__container">
      <p class="photos__error-message">{{ privacyError }}</p>
    </div>
    <div v-else class="photos__container">
      <div v-if="photoStore.isLoading">
        <span class="photos__loader"></span>
      </div>
      <div
        v-else-if="Number(authStore.user?.id) === Number(route.params.id)"
        class="photos__add-wrapper"
      >
        <p class="photos__add-label">
          {{ isUpload ? 'Загрузка фото...' : 'Загрузить фотографии' }}
        </p>
        <div class="photos__button-wrapper" @click="fileInput?.click()">
          <p :disabled="isUpload" class="photos__button">&plus;</p>
        </div>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          accept="image/*"
          @change="onFileSelected"
        />
      </div>
      <div v-if="!photoStore.isLoading" class="photos__notify-wrapper">
        <p class="photos__notify">
          {{ !photoStore.allPhotos?.length ? 'Фотографий пока нет' : 'Фотографии' }}
        </p>
      </div>
      <div class="photos__wrapper" v-if="photoStore.allPhotos?.length > 0">
        <div class="photos__item" v-for="photo in photoStore.allPhotos" :key="photo.id">
          <div v-if="!photo.photo_url" class="photos__placeholder">
            <div class="photos__skeleton-pulse"></div>
            <span class="photos__status-tag">Обработка...</span>
          </div>
          <RouterLink
            v-else
            :to="{
              name: 'photo',
              params: { id: route.params.id, photoId: photo.id },
            }"
          >
            <img :src="photo.photo_url || ''" alt="photo" class="photos__img" />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api'
import { useAuthStore } from '@/stores/auth.ts'
import { usePhotoStore } from '@/stores/photos.ts'
import { useRoute, RouterLink } from 'vue-router'
import { watch, ref, onMounted } from 'vue'

const authStore = useAuthStore()
const photoStore = usePhotoStore()
const route = useRoute()
const privacyError = ref()
const isUpload = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const getPhotos = async (userId?: string | string[]) => {
  const id = userId || route.params.id
  privacyError.value = null
  photoStore.allPhotos = []

  if (!id) return
  try {
    await photoStore.fetchPhotos(id as string)
    privacyError.value = null
  } catch (error: any) {
    privacyError.value = error.formattedMessage
  }
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    sendPhoto(target.files[0])
  }
}

const sendPhoto = async (file: File) => {
  try {
    isUpload.value = true
    const formData = new FormData()
    formData.append('photo', file)
    const response = await api.post(`/user/${route.params.id}/photo`, formData)
    photoStore.allPhotos.unshift(response.data.data.photo)
  } catch (error: any) {
    console.log(error.formattedMessage, error)
  } finally {
    if (fileInput.value) fileInput.value.value = ''
    isUpload.value = false
  }
}

watch(
  () => [route.params.id, route.name],
  ([newId, newName]) => {
    if (newId && newName === 'photos') {
      getPhotos(newId as string)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
@import '@/assets/css/pages/photos-list.css';
</style>
