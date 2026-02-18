import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { useRoute } from 'vue-router'
import { useNotificationStore } from '@/stores/notifications.ts'

export const usePostStore = defineStore('posts', () => {
  const allPosts = ref({
    data: [] as any[],
    total: 0,
  })
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const route = useRoute()
  const notify = useNotificationStore()
  const currentPage = ref(1)
  const lastPage = ref(1)

  const totalCount = computed(() => {
    return allPosts.value.total ?? allPosts.value.data.length
  })

  const fetchPosts = async (userId: string | number, append = false) => {
    if (isSubmitting.value) return
    try {
      if (!append) currentPage.value = 1
      isSubmitting.value = true
      const response = await api.get(`/user/${userId}/posts?page=${currentPage.value}`)
      const result = response.data.data

      if (append) {
        const newPosts = result.data.filter(
          (newPost: any) => !allPosts.value.data.some((existing) => existing.id === newPost.id),
        )
        allPosts.value.data = [...allPosts.value.data, ...newPosts]
      } else {
        allPosts.value.data = result.data
      }

      allPosts.value.total = result.total
      lastPage.value = result.last_page
    } catch (error) {
      console.error('Ошибка загрузки записи:', error)
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const loadMore = async (userId: string | number) => {
    if (currentPage.value < lastPage.value && !isLoading.value) {
      currentPage.value++
      await fetchPosts(userId, true)
    }
  }

  const resetPagination = () => {
    currentPage.value = 1
    allPosts.value = { data: [], total: 0 }
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
        allPosts.value.data.unshift(response.data.data)
      }

      if (typeof allPosts.value.total === 'number') {
        allPosts.value.total++
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

      const updatedPost = response.data.data
      const index = allPosts.value.data.findIndex((p) => p.id === postId)

      if (index !== -1) {
        allPosts.value.data.splice(index, 1, updatedPost)
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

      allPosts.value.data = allPosts.value.data.filter((post) => post.id !== postId)
      if (typeof allPosts.value.total === 'number') {
        allPosts.value.total--
      }

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

  const handleSocketEvent = (e: any, type: 'upsert' | 'delete') => {
    const postData = e.post || e
    const posts = allPosts.value.data
    const index = posts.findIndex((p) => Number(p.id) === Number(postData.id))

    if (type === 'delete') {
      if (index !== -1) {
        posts.splice(index, 1)
        allPosts.value.total--
      }
      return
    }

    if (index !== -1) {
      Object.assign(posts[index], postData)
    } else {
      posts.unshift(postData)
      allPosts.value.total++
    }
  }

  const listenForUpdates = (userId: string | number) => {
    if (!window.Echo) return
    ;(window as any).Echo.channel(`posts.${userId}`)
      .listen('.PostCreated', (e: any) => handleSocketEvent(e, 'upsert'))
      .listen('.PostUpdated', (e: any) => handleSocketEvent(e, 'upsert'))
      .listen('.PostDeleted', (e: any) => handleSocketEvent(e, 'delete'))
  }

  const stopListening = (userId: string | number) => {
    ;(window as any).Echo?.leave(`posts.${userId}`)
  }

  return {
    allPosts,
    isLoading,
    isSubmitting,
    totalCount,
    currentPage,
    listenForUpdates,
    stopListening,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    loadMore,
    resetPagination,
  }
})
