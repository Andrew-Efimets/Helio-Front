<template>
  <form class="privacy" @submit.prevent="saveSettings" novalidate>
    <div class="data">
      <div v-for="field in privacyFields" :key="field.id" class="field">
        <label class="label" :for="field.id">{{ field.label }}</label>
        <PrivacyChoice
          :name="field.name"
          :id="field.id"
          v-model="profilePrivacy[field.name as keyof typeof profilePrivacy]"
          :options="commonOptions"
        />
      </div>
    </div>
    <p v-if="serverError" class="error">{{ serverError }}</p>
    <p v-if="isSuccess" class="success">Данные успешно обновлены</p>
    <button type="submit" class="button" :disabled="isLoading || !isChanged">
      {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import PrivacyChoice from '@/components/account/settings/PrivacyChoice.vue'
import { useAuthStore } from '@/stores/auth.ts'
import { reactive, watch, ref, computed } from 'vue'
import api from '@/api.ts'

const authStore = useAuthStore()
const isLoading = ref(false)
const serverError = ref('')
const isSuccess = ref(false)

const profilePrivacy = reactive({
  show_phone: '',
  show_account: '',
  show_photo: '',
  show_video: '',
  show_contacts: '',
})

const privacyFields = [
  { id: 'show-phone', name: 'show_phone', label: 'Кто видит мой телефон' },
  { id: 'show-account', name: 'show_account', label: 'Кто может просматривать мой профиль' },
  { id: 'show-photo', name: 'show_photo', label: 'Кто может просматривать мои фотографии' },
  { id: 'show-video', name: 'show_video', label: 'Кто может просматривать мои видео' },
  { id: 'show-contacts', name: 'show_contacts', label: 'Кто может просматривать мои контакты' },
]

const commonOptions = [
  { label: 'Все', value: 'public' },
  { label: 'Контакты', value: 'contacts_only' },
  { label: 'Никто', value: 'private' },
]

watch(
  () => authStore.user?.profile?.privacy,
  (newPrivacy) => {
    if (newPrivacy) {
      Object.assign(profilePrivacy, newPrivacy)
    }
  },
  { immediate: true, deep: true },
)

const saveSettings = async () => {
  serverError.value = ''
  isSuccess.value = false

  try {
    isLoading.value = true
    const response = await api.patch(`/user/${authStore.user?.id}`, {
      name: authStore.user?.name,
      phone: authStore.user?.phone,
      privacy: { ...profilePrivacy },
    })

    if (response.data && response.data.data) {
      authStore.setUser(response.data.data)
    }

    isSuccess.value = true
    setTimeout(() => (isSuccess.value = false), 5000)
  } catch (err: any) {
    serverError.value = err.response?.data?.message || 'Ошибка сохранения'
  } finally {
    isLoading.value = false
  }
}

const isChanged = computed(() => {
  const original = authStore.user?.profile?.privacy
  if (!original) return true
  return Object.keys(profilePrivacy).some((key) => {
    const k = key as keyof typeof profilePrivacy
    return profilePrivacy[k] !== original[k]
  })
})
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

.privacy {
  padding: 20px;
}

.field {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  color: #6e2c11;
}

.label {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
