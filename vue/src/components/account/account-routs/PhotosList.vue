<template>
  <div class="photos">
    <div v-if="privacyError" class="container">
      <p class="error-message">{{ privacyError }}</p>
    </div>
    <div v-else class="container">
      <div v-if="photoStore.isLoading">
        <span class="app-loader"></span>
      </div>

      <MediaAddBlock
        v-else-if="Number(authStore.user?.id) === Number(route.params.id)"
        media-type="photo"
        label="Загрузить фотографию"
        upload-label="Загрузка фотографии..."
        :is-upload="isUpload"
        @file-selected="sendPhoto"
      />

      <div v-if="!photoStore.isLoading" class="notify-wrapper">
        <p class="notify">
          {{ !photoStore.allPhotos?.length ? 'Фотографий пока нет' : 'Фотографии' }}
        </p>
      </div>
      <div class="wrapper" v-if="photoStore.allPhotos?.length > 0">
        <div class="item" v-for="photo in photoStore.allPhotos" :key="photo.id">
          <MediaLoadingPlaceholder v-if="!photo.photo_url" />
          <RouterLink
            v-else
            :to="{
              name: 'photo',
              params: { id: route.params.id, photoId: photo.id },
            }"
          >
            <img :src="photo.photo_url || ''" alt="photo" class="img" />
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
import MediaAddBlock from '@/components/details/MediaAddBlock.vue'
import MediaLoadingPlaceholder from '@/components/details/MediaLoadingPlaceholder.vue'

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
.photos {
  padding: 10px 0 10px;
}

.container {
  background-color: #f5ddc5;
  min-width: 600px;
  min-height: 600px;
  text-align: center;
  padding-top: 10px;
}

.notify {
  color: #6e2c11;
  font-size: 18px;
  font-weight: 700;
}

.wrapper {
  margin: auto;
  width: fit-content;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.notify-wrapper {
  padding: 20px;
}

.item {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin: auto;
}

.img {
  width: 100%;
}

.error-message {
  width: 100%;
  font-size: 16px;
  padding: 20px;
  background-color: #e99a9a;
  color: darkred;
}
</style>
