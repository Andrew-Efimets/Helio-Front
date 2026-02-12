import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { useRoute } from 'vue-router'

export const useLikeStore = defineStore('likes', () => {
  const route = useRoute()
  const isLoading = ref(false)
  const allLikes = ref<any[]>([])

  const totalCount = computed(() => allLikes.value.length)

  const getParams = () => {
    const id = route.params.videoId || route.params.photoId || route.params.postId
    const type = route.params.videoId ? 'video' : route.params.photoId ? 'photo' : 'post'
    return { id, type }
  }

  const fetchMediaLikes = async (userId: string | number) => {
    allLikes.value = []
    const { id, type } = getParams()

    if (!id || !type) return

    try {
      isLoading.value = true
      const response = await api.get(`/user/${userId}/${type}/${id}/likes`)
      allLikes.value = response.data.data
    } finally {
      isLoading.value = false
    }
  }

  const toggleLike = async (userId: string | number) => {
    const { id, type } = getParams()
    if (!id || !type) return

    try {
      const response = await api.post(`/user/${userId}/${type}/${id}/likes`)
      allLikes.value = response.data.data
    } catch (error) {
      throw error
    }
  }

  return {
    allLikes,
    isLoading,
    totalCount,
    getParams,
    toggleLike,
    fetchMediaLikes,
  }
})
