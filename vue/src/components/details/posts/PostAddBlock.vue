<template>
  <div class="post-add">
    <h3 class="post-add__title" @click="openForm">
      {{ !isOpened ? 'Создать запись' : 'Закрыть форму' }}
    </h3>
    <div v-if="postStore.isLoading" class="app-loader"></div>
    <form class="post-form" v-if="isOpened" @submit.prevent>
      <MessageInput v-model="postText" placeholder="Что у вас нового?" @send="handlePostSend" />

      <div v-if="previewUrl" class="preview-container">
        <img :src="previewUrl" class="preview-image" />
        <button class="remove-btn" @click="removeFile">×</button>
      </div>

      <div class="add-img">
        <label class="add-img__label">Прикрепить картинку</label>
        <div class="button-wrapper" @click="fileInput?.click()">
          <p class="add-button">&plus;</p>
        </div>
      </div>

      <input type="file" ref="fileInput" style="display: none" @change="addFile" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePostStore } from '@/stores/posts.ts'
import MessageInput from '@/components/details/MessageInput.vue'

const isOpened = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const postText = ref('')
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const postStore = usePostStore()

const openForm = () => {
  isOpened.value = !isOpened.value
}

const handlePostSend = async (text: string) => {
  if (!text.trim() && !selectedFile.value) return

  try {
    await postStore.createPost({
      content: text,
      image: selectedFile.value,
    })

    postText.value = ''
    removeFile()
    isOpened.value = false
  } catch (error) {
    console.error('Ошибка при создании поста:', error)
  }
}
const addFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const removeFile = () => {
  selectedFile.value = null
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.post-add {
  margin: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  box-shadow: 0 0 10px 5px rgba(240, 163, 55, 0.3);
}

.post-add__title {
  color: #6e2c11;
  cursor: pointer;
  user-select: none;
}

.post-add__title:hover {
  text-decoration: underline;
}

.button-wrapper {
  text-align: center;
  width: 30px;
  height: 30px;
  border: #6e2c11 1px solid;
  box-shadow: 0 0 5px 5px rgba(240, 163, 55, 0.2);
  cursor: pointer;
}

.add-button {
  margin: auto;
  font-size: 22px;
}

.button-wrapper:active {
  scale: 0.9;
  box-shadow: inset 0 0 5px 5px rgba(240, 163, 55, 0.2);
}

.add-button:disabled {
  background-color: #957f6f;
}

.add-img__label {
  color: #6e2c11;
  font-size: 16px;
  font-weight: bold;
}

.add-img {
  margin: 20px;
  display: flex;
  column-gap: 20px;
}

.preview-container {
  position: relative;
  width: fit-content;
  margin: 10px 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #d87c56;
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #6e2c11;
  color: #f5ddc5;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #a34809;
}
</style>
