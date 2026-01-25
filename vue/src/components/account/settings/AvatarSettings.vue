<template>
  <form class="avatar" @submit.prevent="saveSettings" novalidate>
    <div class="avatar__container">
      <div class="avatar__preview">
        <img :src="previewUrl" alt="Аватар" class="avatar__img" />
      </div>
      <div class="avatar__field">
        <label class="avatar__upload-label" for="avatar-input">
          {{ previewUrl ? 'Изменить фото' : 'Выберите файл' }}
        </label>
        <input
          type="file"
          id="avatar-input"
          class="avatar__input-file"
          accept="image/*"
          @change="handleFileChange"
        />
        <span class="avatar__annotation">(JPG, PNG или WEBP, до 2МБ)</span>
      </div>
    </div>
    <p v-if="serverError" class="settings__error">{{ serverError }}</p>
    <p v-if="isSuccess" class="settings__success">Аватар успешно обновлен</p>
    <button type="submit" class="settings__button" :disabled="isLoading || !selectedFile">
      {{ isLoading ? 'Загрузка...' : 'Сохранить фото' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { ref, watch } from 'vue'
import api from '@/api.ts'

const authStore = useAuthStore()
const isLoading = ref(false)
const serverError = ref('')
const isSuccess = ref(false)

const selectedFile = ref<File | null>(null)
const previewUrl = ref('')

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser?.avatar) {
      previewUrl.value = newUser.avatar
    }
  },
  { immediate: true },
)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    if (file.size > 2 * 1024 * 1024) {
      serverError.value = 'Файл слишком большой'
      return
    }

    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const saveSettings = async () => {
  if (!selectedFile.value) return

  serverError.value = ''
  isSuccess.value = false
  isLoading.value = true

  const formData = new FormData()
  formData.append('avatar', selectedFile.value)

  try {
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data?.data) {
      authStore.setUser(response.data.data)
      selectedFile.value = null
    }

    isSuccess.value = true
    setTimeout(() => (isSuccess.value = false), 3000)
  } catch (err: any) {
    serverError.value = err.formattedMessage || 'Ошибка при загрузке файла'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import '@/assets/css/settings/profile-settings.css';
</style>
