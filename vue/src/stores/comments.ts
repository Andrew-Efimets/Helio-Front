import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { useRoute } from 'vue-router'

export const useCommentStore = defineStore('comments', () => {
  const allComments = ref<any[]>([])
  const isLoading = ref(false)
  const route = useRoute()
  const replyTo = ref<any>(null)

  const totalCount = computed(() => allComments.value.length)

  const getParams = () => {
    const id = route.params.videoId || route.params.photoId || route.params.postId
    const type = route.params.videoId ? 'video' : route.params.photoId ? 'photo' : 'post'
    return { id, type }
  }

  const fetchMediaComments = async (userId: string | number) => {
    allComments.value = []
    const { id, type } = getParams()
    if (!id || !type) return

    try {
      isLoading.value = true
      const response = await api.get(`/user/${userId}/${type}/${id}/comments`)
      allComments.value = response.data.data
    } finally {
      isLoading.value = false
    }
  }

  const setReply = (comment: any) => {
    replyTo.value = comment
  }
  const clearReply = () => {
    replyTo.value = null
  }

  const addComment = async (targetUserId: string | number, text: string) => {
    const { id, type } = getParams()

    if (!id || !type) return

    const payload = {
      content: text,
      parent_id: replyTo.value ? replyTo.value.id : null,
    }

    try {
      const { data: axiosData } = await api.post(
        `/user/${targetUserId}/${type}/${id}/comments`,
        payload,
      )

      allComments.value.unshift(axiosData.data)
      clearReply()
      return axiosData.data
    } catch (error) {
      throw error
    }
  }

  const commentTree = computed(() => {
    const map = new Map()
    const tree: any[] = []

    allComments.value.forEach((comment) => {
      map.set(comment.id, { ...comment, replies: [] })
    })

    map.forEach((comment) => {
      if (comment.parent_id && map.has(comment.parent_id)) {
        map.get(comment.parent_id).replies.push(comment)
      } else {
        tree.push(comment)
      }
    })

    return tree
  })

  return {
    allComments,
    isLoading,
    totalCount,
    replyTo,
    commentTree,
    addComment,
    setReply,
    clearReply,
    fetchMediaComments,
  }
})
