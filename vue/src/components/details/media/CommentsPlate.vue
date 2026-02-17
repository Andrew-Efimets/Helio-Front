<template>
  <div class="comments-list">
    <div v-if="commentStore.isLoading" class="app-loader"></div>
    <template v-else>
      <CommentItem v-for="item in tree" :key="item.id" :comment="item" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCommentStore } from '@/stores/comments.ts'
import CommentItem from '@/components/details/media/CommentItem.vue'

defineProps<{
  tree: any[]
}>()

const commentStore = useCommentStore()
</script>

<style scoped>
.comments-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
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
