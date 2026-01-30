import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const usePhotoStore = defineStore('photos', () => {
  const allPhotos = ref<any[]>([])
  const isLoading = ref(false)

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
    } finally {
      isLoading.value = false
    }
  }

  const updatePhotoInList = (updatedPhoto: any) => {
    const index = allPhotos.value.findIndex((p) => p.id === updatedPhoto.id)
    if (index !== -1) {
      allPhotos.value[index] = updatedPhoto
    }
  }

  return {
    allPhotos,
    isLoading,
    fetchPhotos,
    getNextPhotoId,
    getPrevPhotoId,
    updatePhotoInList,
  }
})
