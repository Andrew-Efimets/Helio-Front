<template>
  <form class="privacy" @submit.prevent="saveSettings" novalidate>
    <div class="privacy__data">
      <div class="privacy__field">
        <label class="privacy__label" for="show-phone">Кто видит мой телефон</label>
        <PrivacyChoice v-model="profilePrivacy.show_phone" name="show_phone" id="show-phone" />
      </div>
      <div class="privacy__field">
        <label class="privacy__label" for="show-account">Кто может просматривать мой профиль</label>
        <PrivacyChoice
          v-model="profilePrivacy.show_account"
          name="show_account"
          id="show-account"
        />
      </div>
      <div class="privacy__field">
        <label class="privacy__label" for="show-photo">
          Кто может просматривать мои фотографии
        </label>
        <PrivacyChoice v-model="profilePrivacy.show_photo" name="show_photo" id="show-photo" />
      </div>
      <div class="privacy__field">
        <label class="privacy__label" for="show-video">Кто может просматривать мои видео</label>
        <PrivacyChoice v-model="profilePrivacy.show_video" name="show_video" id="show-video" />
      </div>
      <div class="privacy__field">
        <label class="privacy__label" for="show-contacts">
          Кто может просматривать мои контакты
        </label>
        <PrivacyChoice
          v-model="profilePrivacy.show_contacts"
          name="show_contacts"
          id="show-contacts"
        />
      </div>
    </div>
    <p v-if="serverError" class="settings__error">{{ serverError }}</p>
    <p v-if="isSuccess" class="settings__success">Данные успешно обновлены</p>
    <button type="submit" class="settings__button" :disabled="isLoading">
      {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import PrivacyChoice from '@/components/account/settings/PrivacyChoice.vue'
import { useAuthStore } from '@/stores/auth.ts'
import { reactive, watch, ref } from 'vue'
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
</script>

<style scoped>
@import '@/assets/css/settings/profile-settings.css';
</style>
