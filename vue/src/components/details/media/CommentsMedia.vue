<template>
  <div class="container">
    <h3 class="title">Комментариев: {{ totalCount }}</h3>
    <div class="content">
      <div class="wrapper">
        <CommentsPlate :tree="currentCommentsTree" />
        <div v-if="commentStore.replyTo" class="quote-preview">
          <div class="quote-content">
            <span class="quote-author">{{ commentStore.replyTo.user.name }}:</span>
            <span class="quote-text">{{ commentStore.replyTo.content }}</span>
          </div>
          <button class="quote-close" @click="commentStore.clearReply">×</button>
        </div>
        <MessageInput
          v-model="commentText"
          placeholder="Оставить комментарий"
          @send="saveComment"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CommentsPlate from '@/components/details/media/CommentsPlate.vue'
import MessageInput from '@/components/details/MessageInput.vue'
import { useNotificationStore } from '@/stores/notifications.ts'
import { useCommentStore } from '@/stores/comments.ts'

const props = defineProps<{
  mediaId: number | string
  mediaType: 'post' | 'photo' | 'video'
  ownerId: number | string
}>()

const notify = useNotificationStore()
const commentText = ref('')
const commentStore = useCommentStore()

const currentCommentsTree = computed(() =>
  commentStore.getCommentTree(props.mediaType, props.mediaId),
)
const totalCount = computed(() => commentStore.getComments(props.mediaType, props.mediaId).length)

const initComments = async () => {
  await commentStore.fetchMediaComments(props.ownerId, props.mediaType, props.mediaId)

  if (window.Echo) {
    window.Echo.channel(`comments.${props.mediaType}.${props.mediaId}`).listen(
      'CommentCreated',
      (e: any) => {
        commentStore.addEchoComment(e.comment, props.mediaType, props.mediaId)
      },
    )
  }
}

const saveComment = async (text: string) => {
  if (!text.trim()) return
  try {
    await commentStore.addComment(props.ownerId, text, props.mediaType, props.mediaId)
    commentText.value = ''
  } catch (error) {
    notify.show('Не удалось отправить комментарий', 'error')
  }
}

onMounted(() => {
  initComments()
})

onUnmounted(() => {
  if (window.Echo) {
    window.Echo.leave(`comments.${props.mediaType}.${props.mediaId}`)
  }
})
</script>

<style scoped>
.container {
  margin: 10px;
  width: 360px;
  min-height: 400px;
  max-height: 620px;
  background-color: #f9f2e7;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  box-shadow: var(--main-box-shadow);
}

.title {
  border-radius: 10px 10px 0 0;
  width: 100%;
  padding: 5px 10px;
  font-size: 16px;
  font-weight: bold;
  color: #6e2c11;
}

.wrapper {
  flex: 1;
  min-height: 0;
  margin: 10px;
  padding: 10px;
  border: #6e2c11 1px solid;
  background: var(--main-plate-gradient);
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  row-gap: 10px;
}

.content {
  flex: 1;
  min-height: 0;
  height: 100%;
  min-width: 300px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

@media screen and (max-width: 1024px) {
  .container {
    min-height: 200px;
    max-height: 300px;
    width: 70%;
  }

  .title {
    font-size: 14px;
  }
}

@media screen and (max-width: 768px) {
  .container {
    width: 90%;
  }

  .content {
    min-width: 100px;
  }
}
</style>
