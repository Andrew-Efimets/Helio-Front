import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useCommentStore = defineStore('comments', () => {
  const commentsMap = ref<Record<string, any[]>>({})
  const isLoading = ref(false)
  const replyTo = ref<any>(null)

  const getComments = (type: string, id: string | number) => {
    return commentsMap.value[`${type}_${id}`] || []
  }

  const fetchMediaComments = async (userId: string | number, type: string, id: string | number) => {
    const key = `${type}_${id}`
    try {
      isLoading.value = true
      const response = await api.get(`/user/${userId}/${type}/${id}/comments`)
      commentsMap.value[key] = response.data.data
    } finally {
      isLoading.value = false
    }
  }

  const addComment = async (
    targetUserId: string | number,
    text: string,
    type: string,
    id: string | number,
  ) => {
    const key = `${type}_${id}`
    const payload = {
      content: text,
      parent_id: replyTo.value ? replyTo.value.id : null,
    }

    try {
      const { data: axiosData } = await api.post(
        `/user/${targetUserId}/${type}/${id}/comments`,
        payload,
      )

      if (!commentsMap.value[key]) commentsMap.value[key] = []
      commentsMap.value[key].unshift(axiosData.data)

      clearReply()
      return axiosData.data
    } catch (error) {
      throw error
    }
  }

  const addEchoComment = (comment: any, type: string, id: string | number) => {
    const key = `${type}_${id}`
    if (!commentsMap.value[key]) commentsMap.value[key] = []

    const isDuplicate = commentsMap.value[key].some((c) => c.id === comment.id)
    if (!isDuplicate) {
      commentsMap.value[key].unshift(comment)
    }
  }

  const getCommentTree = (type: string, id: string | number) => {
    const comments = getComments(type, id)
    const map = new Map()
    const tree: any[] = []

    comments.forEach((comment) => {
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
  }

  const setReply = (comment: any) => (replyTo.value = comment)
  const clearReply = () => (replyTo.value = null)

  return {
    commentsMap,
    isLoading,
    replyTo,
    getComments,
    getCommentTree,
    addComment,
    addEchoComment,
    setReply,
    clearReply,
    fetchMediaComments,
  }
})
