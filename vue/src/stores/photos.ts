import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { useRoute } from 'vue-router'
import { useNotificationStore } from '@/stores/notifications.ts'

export const usePhotoStore = defineStore('photos', () => {
  const allPhotos = ref<any[]>([])
  const isLoading = ref(false)
  const isUpload = ref(false)
  const route = useRoute()
  const notify = useNotificationStore()

  const totalCount = computed(() => allPhotos.length)

  const getPhotoIndexById = (photoId: string | number) => {
    return allPhotos.value.findIndex((p) => Number(p.id) === Number(photoId))
  }

  const getNextPhotoId = (photoId: string | number) => {
    const index = getPhotoIndexById(photoId)
    if (index !== -1 && index < allPhotos.value.length - 1) {
      return allPhotos.value[index + 1].id
    }
    return null
  }

  const getPrevPhotoId = (photoId: string | number) => {
    const index = getPhotoIndexById(photoId)
    if (index > 0) {
      return allPhotos.value[index - 1].id
    }
    return null
  }

  const fetchPhotos = async (userId: string | number) => {
    try {
      isLoading.value = true
      const response = await api.get(`/user/${userId}/photos`)
      allPhotos.value = response.data.data || []
    } catch (error) {
      console.error('Ошибка загрузки фото:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const sendPhoto = async (file: File) => {
    try {
      isUpload.value = true
      const formData = new FormData()
      formData.append('photo', file)
      const { data: axiosData } = await api.post(`/user/${route.params.id}/photo`, formData)
      const newPhoto = axiosData?.data?.photo

      if (newPhoto) {
        allPhotos.value.unshift(newPhoto)
        notify.show('Фотография успешно загружена', 'success')
      }
    } catch (error: any) {
      console.log(error.formattedMessage, error)
      notify.show('Не удалось загрузить фотографию', 'error')
    } finally {
      isUpload.value = false
    }
  }

  const updatePhotoInList = (updatedPhoto: any) => {
    const index = allPhotos.value.findIndex((p) => p.id === updatedPhoto.id)
    if (index !== -1) {
      allPhotos.value[index] = updatedPhoto
    }
  }

  const removePhotoFromStore = (photoId: string | number) => {
    allPhotos.value = allPhotos.value.filter((p) => Number(p.id) !== Number(photoId))
  }

  return {
    allPhotos,
    isLoading,
    isUpload,
    totalCount,
    fetchPhotos,
    sendPhoto,
    getNextPhotoId,
    getPrevPhotoId,
    updatePhotoInList,
    removePhotoFromStore,
  }
})
