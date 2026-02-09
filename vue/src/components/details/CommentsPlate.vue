<template>
  <div class="comments-list">
    <div v-if="commentStore.isLoading" class="app-loader"></div>
    <template v-else>
      <CommentItem v-for="item in commentStore.allComments" :key="item.id" :comment="item" />
      <div v-if="commentStore.allComments.length === 0" class="empty">Комментариев пока нет</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCommentStore } from '@/stores/comments'
import CommentItem from './CommentItem.vue'

const commentStore = useCommentStore()
</script>

<style scoped>
.comments-list {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: rgba(153, 61, 26, 0.5) transparent;
}

.comments-list::-webkit-scrollbar {
  width: 6px;
}
.comments-list::-webkit-scrollbar-thumb {
  background-color: #6e2c11;
  border-radius: 10px;
}

.empty {
  color: #6e2c11;
}
</style>
