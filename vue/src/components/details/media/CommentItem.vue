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

    <template v-if="comment.replies && comment.replies.length > 0">
      <div v-if="showReplies || isChild" class="replies">
        <CommentItem
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          :is-child="true"
        />
      </div>
      <div v-if="!isChild" class="replies-toggle" @click="toggleReplies">
        <div class="deco"></div>
        <p class="button-text">{{ !showReplies ? 'Показать ответы' : 'Скрыть ответы' }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCommentStore } from '@/stores/comments.ts'
import { ref } from 'vue'

const commentStore = useCommentStore()
defineProps<{
  comment: any
  isChild?: boolean
}>()

const showReplies = ref(false)

const toggleReplies = () => {
  showReplies.value = !showReplies.value
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>

<style scoped>
.comment-wrapper {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 0;
}

.comment {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
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
  margin: 5px 0 8px 10px;
  border-left: 1px dashed #d87c56;
  padding-left: 10px;
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

.replies-toggle {
  display: flex;
}

.deco {
  margin-left: 10px;
  width: 20px;
  border-bottom: 1px #d87c56 dashed;
  border-radius: 0 0 0 100%;
  transform: translateY(-50%);
}

.button-text {
  color: #d87c56;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.button-text:hover {
  background-color: #ead7c3;
}

@media screen and (max-width: 768px) {
  .replies {
    margin-left: 10px;
    padding-left: 5px;
  }

  .avatar {
    width: 24px;
    height: 24px;
  }

  .replies .avatar {
    width: 18px;
    height: 18px;
  }

  .header {
    flex-direction: column;
  }

  .author {
    font-size: 9px;
  }

  .date {
    font-size: 9px;
  }

  .text {
    font-size: 12px;
  }

  .quote {
    font-size: 9px;
  }

  .replies .text {
    font-size: 11px;
  }

  .button-text {
    font-size: 10px;
  }
}
</style>
