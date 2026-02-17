<template>
  <div class="post">
    <span class="date">{{ formatDate(post.created_at) }}</span>
    <div class="post-img__wrapper">
      <img :src="post?.image_url" alt="post image" class="post-img" />
    </div>
    <div class="post-text__wrapper">
      <p class="post-text">{{ post.content }}</p>
    </div>
    <div class="post-activity">
      <LikesMedia :media-id="post.id" media-type="post" :owner-id="post.user_id" />
      <span class="post-comments__link" @click="openComments"> Комментировать </span>
    </div>
    <CommentsMedia
      v-if="isOpened"
      class="post-comments"
      :media-id="post.id"
      media-type="post"
      :owner-id="post.user_id"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import LikesMedia from '@/components/details/media/LikesMedia.vue'
import CommentsMedia from '@/components/details/media/CommentsMedia.vue'

defineProps<{
  post: any
}>()
const route = useRoute()
const isOpened = ref(false)

const ownerId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : String(id || '')
})

const formatDate = (date: string) => new Date(date).toLocaleDateString()

const openComments = () => {
  isOpened.value = !isOpened.value
}
</script>

<style scoped>
.post {
  width: 100%;
  margin-top: 20px;
  padding: 20px 5px;
  display: flex;
  flex-direction: column;
  background-color: #f9f2e7;
  box-shadow: 0 0 10px 5px rgba(240, 163, 55, 0.3);
}

.post-text__wrapper {
  margin: 10px 20px;
  box-shadow: 0 10px 10px -5px rgba(240, 163, 55, 0.3);
}

.post-text {
  color: #6e2c11;
  font-size: 16px;
  word-wrap: break-word;
}

.post-img__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 300px;
  margin: 10px auto;
}

.post-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.date {
  margin-left: 20px;
  color: #6e2c11;
  font-weight: bold;
}

.post-activity {
  margin: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post-comments__link {
  color: #6e2c11;
  cursor: pointer;
}

.post-comments__link:hover {
  text-decoration: underline;
}

.post-comments {
  width: 100%;
  margin: auto;
}
</style>
