<template>
  <div class="post-list">
    <div v-if="postStore.isLoading && postStore.currentPage === 1" class="app-loader"></div>

    <div class="posts-container">
      <PostItem v-for="post in postStore.allPosts?.data" :key="post.id" :post="post" />
    </div>

    <div ref="loadMoreTrigger" class="load-more-trigger">
      <div v-if="postStore.isSubmitting && postStore.currentPage > 1" class="app-loader"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePostStore } from '@/stores/posts.ts'
import { useRoute } from 'vue-router'
import PostItem from '@/components/details/media/PostItem.vue'

const postStore = usePostStore()
const route = useRoute()
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        postStore.loadMore(String(route.params.id))
      }
    },
    { threshold: 1.0 },
  )

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

watch(
  () => route.params.id,
  () => {
    postStore.resetPagination()
    postStore.fetchPosts(String(route.params.id))
  },
)
</script>

<style scoped>
.load-more-trigger {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
