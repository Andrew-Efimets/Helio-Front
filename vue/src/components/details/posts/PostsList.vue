<template>
  <div class="post-list">
    <div v-if="postStore.isLoading" class="app-loader"></div>

    <template v-else>
      <PostItem v-for="post in postStore.allPosts?.data" :key="post.id" :post="post" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { usePostStore } from '@/stores/posts.ts'
import PostItem from '@/components/details/media/PostItem.vue'

const postStore = usePostStore()
</script>

<style scoped></style>
