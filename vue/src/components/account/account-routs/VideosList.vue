<template>
  <div class="videos">
    <div v-if="privacyError" class="videos__container">
      <p class="videos__error-message">{{ privacyError }}</p>
    </div>
    <div v-else class="videos__container">
      <div
        v-if="Number(authStore.user?.id) === Number(route.params.id)"
        class="videos__add-wrapper"
      >
        <p class="videos__add-label">Загрузить видео</p>
        <div class="videos__button-wrapper">
          <p class="videos__button">&plus;</p>
        </div>
      </div>
      <div class="videos__wrapper" v-if="allVideos.length > 0">
        <div class="videos__item" v-for="video in allVideos" :key="video.id">
          <RouterLink
            :to="{
              name: 'video',
              params: { id: route.params.id, videoId: video.id },
            }"
          >
            <img :src="video.avatar_url || ''" alt="video" class="videos__img" />
          </RouterLink>
        </div>
      </div>
      <div v-else-if="!isLoading" class="videos__notify-wrapper">
        <p class="videos__notify">Видео пока нет</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api'
import { useAuthStore } from '@/stores/auth.ts'
import { useRoute, RouterLink } from 'vue-router'
import { watch, ref } from 'vue'

const authStore = useAuthStore()
const route = useRoute()
const privacyError = ref()
const allVideos = ref<any[]>([])
const isLoading = ref()

const getVideos = async () => {
  if (!route.params.id) return

  try {
    isLoading.value = true // Добавь ref для лоадера
    const response = await api.get(`/user/${route.params.id}/videos`)
    allVideos.value = response.data.data || []
    privacyError.value = null
  } catch (error: any) {
    privacyError.value = error.formattedMessage
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      getVideos()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
@import '@/assets/css/pages/videos-list.css';
</style>
