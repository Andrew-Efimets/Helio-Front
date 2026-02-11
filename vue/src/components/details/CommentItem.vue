<template>
  <div class="comment-wrapper">
    <div class="comment">
      <img :src="comment.user.active_avatar?.avatar_url" class="avatar" />
      <div class="content">
        <div class="header">
          <span class="author">{{ comment.user.name }}</span>
          <span class="date">{{ formatDate(comment.created_at) }}</span>
        </div>

        <p class="text">{{ comment.content }}</p>
        <p class="quote" @click.prevent="commentStore.setReply(comment)">Ответить</p>
      </div>
    </div>

    <div v-if="comment.replies && comment.replies.length > 0" class="replies">
      <CommentItem v-for="reply in comment.replies" :key="reply.id" :comment="reply" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommentStore } from '@/stores/comments'

const commentStore = useCommentStore()
defineProps<{ comment: any }>()

const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>

<style scoped>
.comment-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
}

.comment {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  width: 100%;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
}

.content {
  flex: 1;
  min-width: 0;
}

.header {
  display: flex;
  align-items: baseline;
}

.author {
  font-weight: bold;
  font-size: 11px;
  color: #d87c56;
}

.date {
  font-size: 11px;
  color: #999;
  margin-left: 8px;
}

.text {
  font-size: 14px;
  color: #6e2c11;
  margin-top: 5px;
  word-wrap: break-word;
  line-height: 1.4;
}

.quote {
  display: inline-block;
  font-size: 11px;
  color: #999;
  margin-top: 5px;
  cursor: pointer;
  transition: color 0.2s;
}

.quote:hover {
  text-decoration: underline;
  color: #d87c56;
}

.replies {
  margin-left: 10px;
  border-left: 1px dashed #d87c56;
  padding-left: 10px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
}

.replies .replies .replies {
  border-left: 1px solid #d87c56;
}

.replies .replies .replies .replies {
  margin-left: 0;
  padding-left: 0;
  border: none;
}

.replies .avatar {
  width: 24px;
  height: 24px;
}

.replies .text {
  font-size: 13px;
}

@media (max-width: 350px) {
  .replies {
    margin-left: 10px;
    padding-left: 5px;
  }
}
</style>
