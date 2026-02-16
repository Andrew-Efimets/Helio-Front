import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { useRoute } from 'vue-router'
import { useNotificationStore } from '@/stores/notifications.ts'

export const usePostStore = defineStore('posts', () => {
  const allPosts = ref<any[]>([])
  const isLoading = ref(false)
  const route = useRoute()
  const notify = useNotificationStore()

  const totalCount = computed(() => allPosts.length)

  const fetchPosts = async (userId: string | number) => {
    try {
      isLoading.value = true
      const response = await api.get(`/user/${userId}/posts`)
      allPosts.value = response.data.data || []
    } catch (error) {
      console.error('Ошибка загрузки записи:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createPost = async (postData: { content: string; image: File | null }) => {
    try {
      isLoading.value = true

      const formData = new FormData()
      formData.append('content', postData.content)
      if (postData.image) {
        formData.append('image', postData.image)
      }

      const response = await api.post(`/user/${route.params.id}/post`, formData)

      if (response.data.data) {
        allPosts.value.unshift(response.data.data)
      }
    } catch (error: any) {
      console.error(error)
      notify.show('Не удалось добавить запись', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updatePost = async (postId: string | number, content: string) => {
    try {
      isLoading.value = true
      const response = await api.patch(`/user/${route.params.id}/post/${postId}`, {
        content: content,
      })

      const updatedPost = response.data

      const index = allPosts.value.findIndex((p) => p.id === postId)
      if (index !== -1) {
        allPosts.value[index] = updatedPost
      }
    } catch (error: any) {
      notify.show('Не удалось обновить запись', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deletePost = async (postId: string | number) => {
    try {
      isLoading.value = true
      await api.delete(`/user/${route.params.id}/post/${postId}`)

      allPosts.value = allPosts.value.filter((post) => post.id !== postId)

      notify.show('Запись удалена', 'success')
      return true
    } catch (error) {
      console.error('Ошибка удаления:', error)
      notify.show('Не удалось удалить запись', 'error')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    allPosts,
    isLoading,
    totalCount,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  }
})
