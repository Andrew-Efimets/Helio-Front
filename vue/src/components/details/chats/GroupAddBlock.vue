<template>
  <div class="add-group">
    <div class="header__wrapper">
      <p class="header" @click="toggleAdd">
        {{ isEdit ? 'Редактировать группу' : 'Создать группу' }}
      </p>
      <p v-if="isEdit" class="cancel-edit" @click="chatStore.cancelEdit">×</p>
    </div>
    <template v-if="isOpenAdd">
      <label for="title" class="label">Введите название группы</label>
      <input v-model="groupTitle" type="text" class="title" placeholder="Название..." />
      <div class="file-input">
        <div v-if="previewUrl || initialChat?.avatar" class="preview-container">
          <img :src="previewUrl || initialChat?.avatar" class="preview-image" alt="Preview" />
          <button class="remove-preview" @click="removeAvatar">×</button>
        </div>

        <label class="small-button add-avatar">
          {{ previewUrl || initialChat?.avatar ? 'Изменить фото' : 'Добавить аватар' }}
          <input type="file" @change="handleFileChange" accept="image/*" />
        </label>
      </div>
      <button class="small-button add-avatar" :disabled="isUpload" @click="handleSetGroup">
        {{ isUpload ? 'Загрузка...' : 'Сохранить' }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onUnmounted, computed, watch } from 'vue'
import { useChatStore } from '@/stores/chats.ts'
import { useNotificationStore } from '@/stores/notifications.ts'

const props = defineProps<{
  initialChat?: any
}>()

const chatStore = useChatStore()
const isOpenAdd = ref(false)
const isUpload = ref(false)
const router = useRouter()
const notify = useNotificationStore()
const groupTitle = ref('')
const groupAvatar = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isEdit = computed(() => !!props.initialChat)

const toggleAdd = () => {
  isOpenAdd.value = !isOpenAdd.value
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    groupAvatar.value = file
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(file)
  }
}

const removeAvatar = () => {
  groupAvatar.value = null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
}

const handleSetGroup = async () => {
  if (!groupTitle.value) return

  try {
    isUpload.value = true
    if (isEdit.value) {
      await chatStore.updateGroup(props.initialChat.id, groupTitle.value, groupAvatar.value)
      notify.show('Группа обновлена', 'success')
    } else {
      const newChat = await chatStore.setGroup(groupTitle.value, groupAvatar.value)
      router.push({ name: 'chat', params: { chatId: newChat.id } })
      notify.show('Группа создана', 'success')
    }

    groupTitle.value = ''
    removeAvatar()
    chatStore.cancelEdit()
    isOpenAdd.value = false
  } catch (e) {
    console.error(e)
    notify.show('Ошибка при создании', 'error')
  } finally {
    isUpload.value = false
  }
}

watch(
  () => props.initialChat,
  (newChat) => {
    if (newChat) {
      groupTitle.value = newChat.title
      isOpenAdd.value = true
    }
  },
  { immediate: true },
)

watch(
  () => chatStore.editingGroup,
  (newChat) => {
    if (newChat) {
      groupTitle.value = newChat.title
      isOpenAdd.value = true
    } else {
      groupTitle.value = ''
      isOpenAdd.value = false
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<style scoped>
.add-group {
  margin: 5px 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background: var(--items-gradient);
  box-shadow: var(--main-box-shadow);
}

.header__wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header,
.label {
  color: #6e2c11;
  font-weight: bold;
  padding: 10px 0;
}

.header {
  cursor: pointer;
}

.header:hover {
  text-decoration: underline;
}

.cancel-edit {
  font-size: 18px;
  font-weight: bold;
  color: #6e2c11;
  cursor: pointer;
}

.title {
  padding: 5px 10px;
  color: #6e2c11;
  font-size: 16px;
  border: #6e2c11 2px solid;
  border-radius: 18px;
}

.title:focus {
  outline: none;
  border: 2px solid #be7f19;
  box-shadow: var(--input-focus-shadow);
}

.file-input {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
}

.file-input input {
  display: none;
}

.add-avatar {
  margin: 10px auto;
}

.preview-container {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 10px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #6e2c11;
}

.remove-preview {
  position: absolute;
  top: 0;
  right: 0;
  background: #6e2c11;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.remove-preview:hover {
  background-color: darkred;
}
</style>
