<template>
  <AppTransition>
    <div class="post">
      <div class="post-header">
        <span class="date">{{ formatDate(post.created_at) }}</span>
        <div class="post-actions">
          <span class="post-update" @click="openEditor">Изменить</span>
          <span class="post-delete" @click="isConfirmOpen = true">Удалить</span>
        </div>
      </div>
      <AppTransition>
        <div v-if="post.image_url" class="post-img__wrapper">
          <img :src="post?.image_url" alt="post image" class="post-img" />
        </div>
      </AppTransition>
      <div class="post-text__wrapper">
        <p class="post-text">{{ post.content }}</p>
      </div>
      <AppTransition>
        <MessageInput v-if="isOpenedEditor" v-model="postText" @send="handleUpdatePost" />
      </AppTransition>
      <div class="post-activity">
        <LikesMedia :media-id="post.id" media-type="post" :owner-id="post.user_id" />
        <span class="post-comments__link" @click="openComments">Комментировать</span>
      </div>
      <CommentsMedia
        v-if="isOpenedComments"
        class="post-comments"
        :media-id="post.id"
        media-type="post"
        :owner-id="post.user_id"
      />
    </div>
  </AppTransition>
  <ConfirmModal
    v-if="isConfirmOpen"
    :is-open="isConfirmOpen"
    @close="isConfirmOpen = false"
    @confirm="handleDeletePost"
  >
    <p>Вы действительно хотите удалить запись?</p>
    <template #button__text>Да, удалить</template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LikesMedia from '@/components/details/media/LikesMedia.vue'
import CommentsMedia from '@/components/details/media/CommentsMedia.vue'
import AppTransition from '@/components/details/AppTransition.vue'
import MessageInput from '@/components/details/MessageInput.vue'
import { usePostStore } from '@/stores/posts.ts'
import ConfirmModal from '@/components/details/ConfirmModal.vue'

const props = defineProps<{
  post: any
}>()

const isOpenedComments = ref(false)
const isOpenedEditor = ref(false)
const isConfirmOpen = ref(false)
const postText = ref(props.post.content)
const postStore = usePostStore()

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (d.toDateString() === now.toDateString()) {
    return `Сегодня в ${time}`
  }
  return `${d.toLocaleDateString()} в ${time}`
}

const openComments = () => {
  isOpenedComments.value = !isOpenedComments.value
}

const openEditor = () => {
  isOpenedEditor.value = !isOpenedEditor.value
  if (isOpenedEditor.value) {
    postText.value = props.post.content
  }
}

const handleUpdatePost = async (postText: string) => {
  try {
    await postStore.updatePost(props.post.id, postText)
    isOpenedEditor.value = false
  } catch (error) {
    console.error(error)
  }
  return postStore.updatePost(props.post.id, postText as any)
}

const handleDeletePost = () => {
  return postStore.deletePost(props.post.id)
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
  max-width: 400px;
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
  user-select: none;
  font-size: 14px;
  padding: 0 20px;
}

.post-comments__link:hover {
  text-decoration: underline;
}

.post-comments {
  width: 100%;
  margin: auto;
}

.post-header {
  position: relative;
  z-index: 10;
  margin: 0 20px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post-actions {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.post-update {
  color: #d87c56;
  font-size: 12px;
  cursor: pointer;
}

.post-delete {
  color: darkred;
  font-size: 12px;
  cursor: pointer;
}

.post-update:hover,
.post-delete:hover {
  text-decoration: underline;
}

@media screen and (max-width: 1220px) {
  .post-activity {
    margin: 0;
    flex-direction: column;
    justify-content: start;
  }

  .post-comments__link {
    width: 100%;
    text-align: end;
  }
}

@media screen and (max-width: 768px) {
  .date {
    margin: 0;
  }
}
</style>
