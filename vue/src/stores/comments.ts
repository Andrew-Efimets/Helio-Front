import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { useRoute } from 'vue-router'

export const useCommentStore = defineStore('comments', () => {
  const allComments = ref<any[]>([])
  const isLoading = ref(false)
  const route = useRoute()

  const totalCount = computed(() => allComments.value.length)

  const fetchMediaComments = async (userId: string | number) => {
    const id = route.params.videoId || route.params.photoId || route.params.postId

    const type = route.params.videoId
      ? 'video'
      : route.params.photoId
        ? 'photo'
        : route.params.postId
          ? 'post'
          : ''

    if (!id || !type) return

    try {
      isLoading.value = true
      const response = await api.get(`/user/${userId}/${type}/${id}/comments`)
      allComments.value = response.data.data
    } finally {
      isLoading.value = false
    }
  }

  return {
    allComments,
    isLoading,
    totalCount,
    fetchMediaComments,
  }
})
