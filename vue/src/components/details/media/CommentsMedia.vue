<template>
  <div class="container">
    <h3 class="title">Комментариев: {{ commentStore.totalCount }}</h3>
    <div class="wrapper">
      <CommentsPlate />
      <div v-if="commentStore.replyTo" class="quote-preview">
        <div class="quote-content">
          <span class="quote-author">{{ commentStore.replyTo.user.name }}:</span>
          <span class="quote-text">{{ commentStore.replyTo.content }}</span>
        </div>
        <button class="quote-close" @click="commentStore.clearReply">×</button>
      </div>
      <MessageInput v-model="commentText" placeholder="Оставить комментарий" @send="saveComment" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import api from '@/api.ts'
import { useRoute } from 'vue-router'
import CommentsPlate from '@/components/details/media/CommentsPlate.vue'
import MessageInput from '@/components/details/MessageInput.vue'
import { useNotificationStore } from '@/stores/notifications.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useCommentStore } from '@/stores/comments.ts'
import router from '@/router'

const notify = useNotificationStore()
const commentText = ref('')
const route = useRoute()
const authStore = useAuthStore()
const commentStore = useCommentStore()

const currentMedia = computed(() => {
  const videoId = route.params.videoId
  const photoId = route.params.photoId
  const postId = route.params.postId

  if (videoId) return { type: 'video', id: videoId }
  if (photoId) return { type: 'photo', id: photoId }
  if (postId) return { type: 'post', id: postId }

  return { type: null, id: null }
})

const targetUserId = computed(() => String(route.params.id || ''))
const commentsCount = computed(() => commentStore.allComments.length)

const initComments = async (mediaType: string | null, mediaId: any, oldMediaId?: any) => {
  if (!mediaId || !mediaType || !targetUserId.value) return

  await commentStore.fetchMediaComments(targetUserId.value)

  if (window.Echo) {
    if (oldMediaId) {
      window.Echo.leave(`comments.${mediaType}.${oldMediaId}`)
    }

    window.Echo.channel(`comments.${mediaType}.${mediaId}`).listen('CommentCreated', (e: any) => {
      const isDuplicate = commentStore.allComments.some((c) => c.id === e.comment.id)
      if (!isDuplicate) {
        commentStore.allComments.unshift(e.comment)
      }
    })
  }
}

const saveComment = async (text: string) => {
  if (!text.trim()) return

  try {
    await commentStore.addComment(targetUserId.value, text)
    commentText.value = ''
  } catch (error) {
    notify.show('Не удалось отправить комментарий', 'error')
  }
}

watch(
  () => currentMedia.value.id,
  (newId, oldId) => {
    if (newId) {
      initComments(currentMedia.value.type, newId, oldId)
    }
  },
)

onMounted(() => {
  const { type, id } = currentMedia.value
  if (id) {
    initComments(type, id)
  }
})

onUnmounted(() => {
  const { type, id } = currentMedia.value
  if (type && id && window.Echo) {
    window.Echo.leave(`comments.${type}.${id}`)
  }
})
</script>

<style scoped>
.container {
  margin: 20px;
  max-width: 400px;
  min-height: 400px;
  max-height: 650px;
  background-color: #f9f2e7;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.title {
  border-radius: 10px 10px 0 0;
  background-color: #f0ccaa;
  width: 100%;
  padding: 5px 10px;
  font-size: 16px;
  font-weight: bold;
  color: #6e2c11;
}

.wrapper {
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  row-gap: 10px;
  border: #6e2c11 1px solid;
  border-radius: 8px;
  min-height: inherit;
  height: 100%;
  width: 380px;
  box-sizing: border-box;
  overflow: hidden;
}

.quote-preview {
  display: flex;
  align-items: center;
  background: #f0ccaa;
  padding: 5px 10px;
  margin: 0 10px;
  border-left: 4px solid #6e2c11;
  border-radius: 4px;
  font-size: 12px;
}

.quote-content {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #6e2c11;
}

.quote-author {
  font-weight: bold;
  margin-right: 5px;
}

.quote-close {
  background: none;
  border: none;
  color: #6e2c11;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
}
</style>
