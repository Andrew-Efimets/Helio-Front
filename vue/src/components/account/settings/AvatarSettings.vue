<template>
  <form class="avatar" @submit.prevent="saveSettings" novalidate>
    <div class="avatar__container">
      <div class="avatar__preview">
        <img v-if="previewUrl" :src="previewUrl" alt="Аватар" class="avatar__img" />
        <div v-else class="avatar__preview-empty"></div>
      </div>
      <div class="avatar__field">
        <label class="avatar__upload-label" for="avatar-input">Загрузите фотографию</label>
        <input
          type="file"
          id="avatar-input"
          class="avatar__input-file"
          accept="image/*"
          @change="handleFileChange"
        />
      </div>
    </div>
    <div v-if="allAvatars.length" class="avatar__gallery">
      <h4 class="avatar__gallery-title">Загруженные фотографии:</h4>
      <div class="avatar__list">
        <div
          v-for="avatar in allAvatars"
          :key="avatar.id"
          class="avatar__item"
          :class="{
            'avatar__item--active':
              avatar.id === selectedAvatarId || avatar.url === authStore.user?.avatar,
          }"
          @click="selectExistingAvatar(avatar)"
        >
          <img :src="avatar.url" class="avatar__item-img" />
          <button type="button" class="avatar__delete-btn" @click.stop="deleteAvatar(avatar.id)">
            &times;
          </button>
        </div>
      </div>
    </div>

    <p v-if="serverError" class="settings__error">{{ serverError }}</p>
    <p v-if="isSuccess" class="settings__success">Настройки аватара сохранены</p>

    <button
      type="submit"
      class="settings__button"
      :disabled="isLoading || (!selectedFile && !selectedAvatarId)"
    >
      {{ isLoading ? 'Загрузка...' : 'Применить изменения' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { ref, watch, onMounted } from 'vue'
import api from '@/api.ts'

const authStore = useAuthStore()
const isLoading = ref(false)
const serverError = ref('')
const isSuccess = ref(false)

const selectedFile = ref<File | null>(null)
const selectedAvatarId = ref<number | null>(null)
const previewUrl = ref('')
const allAvatars = ref<any[]>([])
const currentAvatarId = ref<number | null>(null)

const fetchAvatars = async () => {
  try {
    const response = await api.get(`/profile/${authStore.user?.id}/avatars`)
    allAvatars.value = response.data.data
    console.log(response.data.message)
    console.log(response.data.data)
    if (authStore.user?.avatar) {
      const current = allAvatars.value.find((a) => a.url === authStore.user?.avatar)
      if (current) currentAvatarId.value = current.id
    }
  } catch (err) {
    serverError.value = 'Ошибка загрузки галереи'
  }
}

onMounted(fetchAvatars)

watch(
  [() => authStore.user, allAvatars],
  ([newUser, newAvatars]) => {
    if (newUser?.avatar && newAvatars.length) {
      const current = newAvatars.find((a) => a.url === newUser.avatar)
      if (current) currentAvatarId.value = current.id
      if (!selectedFile.value && !selectedAvatarId.value) {
        previewUrl.value = newUser.avatar
      }
    }
  },
  { immediate: true },
)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) {
    const file = target.files[0]
    if (file.size > 2 * 1024 * 1024) {
      serverError.value = 'Файл слишком большой'
      return
    }
    selectedAvatarId.value = null
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const selectExistingAvatar = (avatar: any) => {
  selectedFile.value = null
  selectedAvatarId.value = avatar.id
  previewUrl.value = avatar.url
}

const deleteAvatar = async (id: number) => {
  if (!confirm('Удалить эту фотографию?')) return
  try {
    await api.delete(`/profile/${authStore.user?.id}/avatar/${id}`)
    allAvatars.value = allAvatars.value.filter((a) => a.id !== id)
    if (selectedAvatarId.value === id) {
      selectedAvatarId.value = null
      previewUrl.value = authStore.user?.avatar || ''
    }
  } catch (err: any) {
    serverError.value = 'Не удалось удалить фотографию'
  }
}

const saveSettings = async () => {
  serverError.value = ''
  isSuccess.value = false
  isLoading.value = true

  try {
    let response

    if (selectedFile.value) {
      const formData = new FormData()
      formData.append('avatar', selectedFile.value)

      response = await api.post(`/profile/${authStore.user?.id}/avatar`, formData)
    } else if (selectedAvatarId.value) {
      response = await api.patch(`/profile/${authStore.user?.id}/avatar`, {
        avatar_id: selectedAvatarId.value,
      })
    }

    if (response?.data?.data) {
      authStore.setUser(response.data.data)
      selectedFile.value = null
      selectedAvatarId.value = null
      await fetchAvatars()
    }

    isSuccess.value = true
    setTimeout(() => (isSuccess.value = false), 3000)
  } catch (err: any) {
    serverError.value = err.response?.data?.message || 'Ошибка сохранения'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import '@/assets/css/settings/profile-settings.css';
</style>
