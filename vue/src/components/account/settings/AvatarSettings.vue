<template>
  <form class="avatar" @submit.prevent="saveSettings" novalidate>
    <div class="container">
      <div v-if="isLoading" class="preview">
        <span class="app-loader"></span>
      </div>
      <div v-else class="preview">
        <img v-if="previewUrl" :src="previewUrl" alt="Аватар" class="img" />
        <div v-else class="preview-empty"></div>
      </div>
      <div class="field">
        <label class="upload-label" for="avatar-input">Загрузите фотографию</label>
        <input
          type="file"
          id="avatar-input"
          class="input-file"
          accept="image/*"
          @change="handleFileChange"
        />
      </div>
    </div>
    <div v-if="allAvatars.length" class="gallery">
      <h4 class="gallery-title">Загруженные фотографии:</h4>
      <div class="list">
        <div
          v-for="avatar in allAvatars"
          :key="avatar.id"
          class="item"
          :class="{
            'item--active': avatar.id === currentAvatarId || avatar.id === selectedAvatarId,
          }"
          @click="selectExistingAvatar(avatar)"
        >
          <img v-if="avatar.url" :src="avatar.url" class="item-img" loading="lazy" />
          <button type="button" class="delete-btn" @click.stop="openDeleteConfirm(avatar.id)">
            &times;
          </button>
        </div>
      </div>
    </div>

    <p v-if="serverError" class="error">{{ serverError }}</p>
    <p v-if="isSuccess" class="success">Настройки аватара сохранены</p>

    <button
      type="submit"
      class="button"
      :disabled="isLoading || (!selectedFile && !selectedAvatarId)"
    >
      {{ isLoading ? 'Загрузка...' : 'Применить изменения' }}
    </button>
    <ConfirmModal
      :is-open="isConfirmOpen"
      @close="isConfirmOpen = false"
      @confirm="deleteAvatar(avatarToDelete)"
    >
      <p>Вы действительно хотите удалить фото?</p>
      <template #button__text>Да, удалить</template>
    </ConfirmModal>
  </form>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { ref, watch, onMounted, computed } from 'vue'
import api from '@/api.ts'
import ConfirmModal from '@/components/details/ConfirmModal.vue'

const authStore = useAuthStore()
const isLoading = ref(false)
const serverError = ref('')
const isSuccess = ref(false)
const selectedFile = ref<File | null>(null)
const selectedAvatarId = ref<number | null>(null)
const previewUrl = ref('')
const allAvatars = ref<any[]>([])
const isConfirmOpen = ref(false)
const avatarToDelete = ref<number | null>(null)

const currentAvatarId = computed(() => {
  return allAvatars.value.find((a) => a.is_active)?.id || null
})

const fetchAvatars = async () => {
  try {
    isLoading.value = true
    const { data } = await api.get(`/profile/${authStore.user?.id}/avatars`)
    allAvatars.value = data.data
    if (!selectedFile.value && !selectedAvatarId.value) {
      previewUrl.value = authStore.user?.avatar || ''
    }
  } catch {
    serverError.value = 'Ошибка загрузки галереи'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAvatars)

watch(
  () => authStore.user?.avatar,
  (newUrl) => {
    if (!selectedFile.value && !selectedAvatarId.value) {
      previewUrl.value = newUrl || ''
    }
  },
  { immediate: true },
)

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 4 * 1024 * 1024) return (serverError.value = 'Файл слишком большой')

  if (previewUrl.value.startsWith('blob:')) URL.revokeObjectURL(previewUrl.value)

  selectedAvatarId.value = null
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const selectExistingAvatar = (avatar: any) => {
  selectedFile.value = null
  selectedAvatarId.value = avatar.id
  previewUrl.value = avatar.url
}

const deleteAvatar = async (id: number | null) => {
  if (!id) return
  isConfirmOpen.value = false

  const targetAvatar = allAvatars.value.find((a) => a.id === id)
  const isDeletingActive = targetAvatar?.is_active

  allAvatars.value = allAvatars.value.filter((a) => a.id !== id)

  if (isDeletingActive) {
    previewUrl.value = ''
  }

  try {
    isLoading.value = true

    await api.delete(`/profile/${authStore.user?.id}/avatar/${id}`)

    const { data: userData } = await api.get(`/user/${authStore.user?.id}`)

    const { data: avatarsData } = await api.get(`/profile/${authStore.user?.id}/avatars`)
    allAvatars.value = avatarsData.data

    authStore.setUser(userData.data)
    previewUrl.value = userData.data.avatar || ''
  } catch {
    serverError.value = 'Не удалось удалить фотографию'
    await fetchAvatars()
  } finally {
    isLoading.value = false
    avatarToDelete.value = null
  }
}

const saveSettings = async () => {
  serverError.value = ''
  isSuccess.value = false
  isLoading.value = true
  try {
    let res
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('avatar', selectedFile.value)
      res = await api.post(`/profile/${authStore.user?.id}/avatar`, fd)
    } else {
      res = await api.patch(`/profile/${authStore.user?.id}/avatar/${selectedAvatarId.value}`)
    }

    authStore.setUser(res.data.data)
    selectedFile.value = null
    selectedAvatarId.value = null
    await fetchAvatars()
    isSuccess.value = true
    setTimeout(() => (isSuccess.value = false), 5000)
  } catch (err: any) {
    serverError.value = err.response?.data?.message || 'Ошибка сохранения'
  } finally {
    isLoading.value = false
  }
}

const openDeleteConfirm = (id: number) => {
  avatarToDelete.value = id
  isConfirmOpen.value = true
}
</script>

<style scoped>
.error {
  width: 100%;
  font-size: 16px;
  margin: 10px 0;
  padding: 20px;
  background-color: #e99a9a;
  color: darkred;
}

.success {
  width: 100%;
  margin: 10px 0;
  padding: 20px;
  font-size: 16px;
  background-color: #beeabe;
  color: darkgreen;
}

.avatar {
  padding: 20px;
}

.container {
  display: flex;
  flex-direction: column;
  color: #6e2c11;
  margin-bottom: 20px;
}

.preview {
  margin: 20px;
  width: 150px;
  height: 170px;
}

.preview-empty {
  width: 100%;
  height: 100%;
  background-color: #fedebd;
  margin-bottom: 20px;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.field {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.input-file {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.upload-label {
  font-family: Arial;
  display: inline-block;
  text-align: center;
  width: 200px;
  font-size: 12px;
  font-weight: 600;
  color: #6e2c11;
  padding: 10px;
  border: #6e2c11 2px solid;
  border-radius: 18px;
  text-transform: uppercase;
  box-shadow: var(--main-box-shadow);
  background-color: #fee6c4;
  cursor: pointer;
}

.upload-label:active {
  transform: scale(0.99);
  background-color: #fee6c4;
}

.gallery-title {
  color: #6e2c11;
  padding-bottom: 20px;
}

.list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.item {
  position: relative;
  width: 100px;
  height: 100px;
  cursor: pointer;
  border: 2px solid transparent;
}

.item--active {
  border-color: #e54b0d;
  border-radius: 4px;
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.delete-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #6e2c11;
  color: white;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: darkred;
}
</style>
