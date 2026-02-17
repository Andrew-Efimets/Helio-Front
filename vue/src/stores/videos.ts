import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { useNotificationStore } from '@/stores/notifications.ts'
import { useRoute } from 'vue-router'

export const useVideoStore = defineStore('videos', () => {
  const allVideos = ref<any[]>([])
  const isUpload = ref(false)
  const isLoading = ref(false)
  const notify = useNotificationStore()
  const route = useRoute()
  const uploadProgress = ref(0)

  const totalCount = computed(() => allVideos.value.length)

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

  const sendVideo = async (file: File) => {
    if (!file) return
    if (file.size > 1024 * 1024 * 1024) {
      return notify.show('Файл слишком большой!', 'error')
    }

    try {
      isUpload.value = true
      const formData = new FormData()
      formData.append('video', file)

      const { data: axiosData } = await api.post(`/user/${route.params.id}/video`, formData, {
        onUploadProgress: (p) => {
          if (p.total) uploadProgress.value = Math.round((p.loaded * 100) / p.total)
        },
      })

      const newVideo = axiosData?.data?.video

      if (newVideo) {
        allVideos.value.unshift(newVideo)
        notify.show('Видео загружено и обрабатывается. Ожидайте уведомление!', 'success')
      }
    } catch (error: any) {
      notify.show('Ошибка загрузки', 'error')
    } finally {
      isUpload.value = false
      uploadProgress.value = 0
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

  const fetchVideoById = async (userId: string | number, videoId: string | number) => {
    const existingVideo = allVideos.value.find((v) => v.id === Number(videoId))
    if (existingVideo) return existingVideo

    try {
      isLoading.value = true
      const { data: axiosData } = await api.get(`/user/${userId}/video/${videoId}`)
      const video = axiosData.data.video

      allVideos.value.push(video)
      return video
    } finally {
      isLoading.value = false
    }
  }

  const deleteVideo = async (userId: string | number, videoId: string | number) => {
    try {
      isLoading.value = true
      await api.delete(`/user/${userId}/video/${videoId}`)

      notify.show('Видео успешно удалено', 'success')
      return true
    } catch (error) {
      notify.show('Не удалось удалить видео', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    allVideos,
    isLoading,
    isUpload,
    uploadProgress,
    totalCount,
    fetchVideos,
    fetchVideoById,
    deleteVideo,
    sendVideo,
    updateVideoInList,
    removeVideoFromStore,
  }
})
