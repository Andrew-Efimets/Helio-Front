import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useLikeStore = defineStore('likes', () => {
  const likesMap = ref<Record<string, any[]>>({})
  const isLoading = ref(false)

  const getLikes = (type: string, id: string | number) => {
    return likesMap.value[`${type}_${id}`] || null
  }

  const fetchMediaLikes = async (userId: string | number, type: string, id: string | number) => {
    const key = `${type}_${id}`
    try {
      isLoading.value = true
      const response = await api.get(`/user/${userId}/${type}/${id}/likes`)
      likesMap.value[key] = response.data.data
    } finally {
      isLoading.value = false
    }
  }

  const updateLikesFromSocket = (type: string, id: string | number, likes: any[]) => {
    likesMap.value[`${type}_${id}`] = likes
  }

  const toggleLike = async (userId: string | number, type: string, id: string | number) => {
    const key = `${type}_${id}`
    try {
      isLoading.value = true
      const response = await api.post(`/user/${userId}/${type}/${id}/likes`)
      likesMap.value[key] = response.data.likes
      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      throw error
    }
  }

  return {
    likesMap,
    isLoading,
    getLikes,
    fetchMediaLikes,
    updateLikesFromSocket,
    toggleLike,
  }
})
