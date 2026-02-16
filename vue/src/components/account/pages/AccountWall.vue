<template>
  <div class="wall">
    <div class="container">
      <PostAddBlock v-if="isOwner" />
      <div class="content">
        <h3 class="title">
          {{ !postStore.totalCount ? 'Записей пока нет' : 'Записей: ' + postStore.totalCount }}
        </h3>
        <PostsList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'
import { usePostStore } from '@/stores/posts.ts'
import { useRoute } from 'vue-router'
import PostAddBlock from '@/components/details/posts/PostAddBlock.vue'
import PostsList from '@/components/details/posts/PostsList.vue'

const postStore = usePostStore()
const authStore = useAuthStore()
const route = useRoute()
const isOwner = computed(() => Number(authStore.user?.id) === Number(route.params.id))
</script>

<style scoped>
.container {
  padding: 10px 0 10px;
  width: 100%;
  background-color: #f5ddc5;
}

.content {
  max-width: 700px;
  min-height: 600px;
  margin: 20px;
}

.title {
  color: #6e2c11;
}
</style>
