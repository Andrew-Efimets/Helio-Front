<template>
  <div class="post-list">
    <div v-if="postStore.isLoading" class="app-loader"></div>

    <template v-else>
      <PostItem v-for="post in postStore.allPosts" :key="post.id" :post="post" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { usePostStore } from '@/stores/posts.ts'
import { useRoute } from 'vue-router'
import PostItem from '@/components/details/media/PostItem.vue'

const postStore = usePostStore()
const route = useRoute()
const userId = String(route.params.id)

onMounted(async () => {
  await postStore.fetchPosts(userId)

  if (window.Echo) {
    window.Echo.channel(`posts.${userId}`).listen('PostCreated', (e: any) => {
      const index = postStore.allPosts.findIndex((p) => p.id === e.post.id)

      if (index !== -1) {
        postStore.allPosts[index] = e.post
      } else {
        postStore.allPosts.unshift(e.post)
      }
    })
  }
})

onUnmounted(() => {
  if (window.Echo) {
    window.Echo.leave(`posts.${userId}`)
  }
})
</script>

<style scoped>
.post-list {
  margin: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  box-shadow: 0 0 10px 5px rgba(240, 163, 55, 0.3);
}
</style>
