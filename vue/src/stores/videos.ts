import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useVideoStore = defineStore('videos', () => {
  const allVideos = ref<any[]>([])
  const isLoading = ref(false)

  const fetchVideos = async (userId: string | number) => {
    try {
      isLoading.value = true
      const response = await api.get(`/user/${userId}/videos`)
      allVideos.value = response.data.data || []
    } catch (error) {
      console.error('Ошибка загрузки видео:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateVideoInList = (updatedVideo: any) => {
    const index = allVideos.value.findIndex((v) => v.id === updatedVideo.id)
    if (index !== -1) {
      allVideos.value[index] = updatedVideo
    }
  }

  const removeVideoFromStore = (videoId: string | number) => {
    allVideos.value = allVideos.value.filter((p) => Number(p.id) !== Number(videoId))
  }

  return {
    allVideos,
    isLoading,
    fetchVideos,
    updateVideoInList,
    removeVideoFromStore,
  }
})
