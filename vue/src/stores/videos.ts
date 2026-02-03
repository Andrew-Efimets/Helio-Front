import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useVideoStore = defineStore('videos', () => {
  const allVideos = ref<any[]>([])
  const isLoading = ref(false)

  const getVideoIndexById = (videoId: string | number) => {
    return allVideos.value.findIndex((p) => Number(p.id) === Number(videoId))
  }

  const getNextVideoId = (videoId: string | number) => {
    const index = getVideoIndexById(videoId)
    if (index !== -1 && index < allVideos.value.length - 1) {
      return allVideos.value[index + 1].id
    }
    return null
  }

  const getPrevVideoId = (videoId: string | number) => {
    const index = getVideoIndexById(videoId)
    if (index > 0) {
      return allVideos.value[index - 1].id
    }
    return null
  }

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

  return {
    allVideos,
    isLoading,
    fetchVideos,
    getNextVideoId,
    getPrevVideoId,
    updateVideoInList,
  }
})
