<template>
  <div class="container">
    <h3 class="title">Комментарии</h3>
    <div class="wrapper">
      <CommentsPlate />
      <MessageInput v-model="commentText" placeholder="Оставить комментарий" @send="saveComment" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'
import CommentsPlate from '@/components/details/CommentsPlate.vue'
import MessageInput from '@/components/details/MessageInput.vue'
import { useNotificationStore } from '@/stores/notifications'

const notify = useNotificationStore()
const commentText = ref('')

const saveComment = async (text: string) => {
  try {
    // await api.post(`/video/${videoId}/comments`, { content: text })
    console.log('Отправка комментария:', text)

    // await api.post('/comments', { message: text })

    commentText.value = ''
  } catch (error) {
    console.error(error)
    notify.show('Не удалось отправить комментарий. Попробуйте ещё раз', 'error')
  }
}
</script>

<style scoped>
.container {
  margin: 20px;
  width: 400px;
  height: inherit;
  background-color: #f9f2e7;
  border-radius: 10px;
}

.title {
  border-radius: 10px 10px 0 0;
  background-color: #f0ccaa;
  width: 100%;
  padding: 5px 10px;
  font-size: 16px;
  font-weight: bold;
  color: #6e2c11;
}

.wrapper {
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  row-gap: 10px;
  border: #6e2c11 1px solid;
  border-radius: 8px;
  height: 590px;
}
</style>
