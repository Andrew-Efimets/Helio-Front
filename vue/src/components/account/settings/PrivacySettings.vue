<template>
  <form class="privacy" @submit.prevent="saveSettings" novalidate>
    <div class="privacy__data">
      <div class="privacy__field">
        <label class="privacy__label" for="show-phone">Кто видит мой телефон</label>
        <PrivacyChoice v-model="profilePrivacy.showPhone" name="show-phone" id="show-phone" />
      </div>
      <div class="privacy__field">
        <label class="privacy__label" for="show-account">Кто может просматривать мой профиль</label>
        <PrivacyChoice v-model="profilePrivacy.showAccount" name="show-account" id="show-account" />
      </div>
      <div class="privacy__field">
        <label class="privacy__label" for="show-photo">
          Кто может просматривать мои фотографии
        </label>
        <PrivacyChoice v-model="profilePrivacy.showPhoto" name="show-photo" id="show-photo" />
      </div>
      <div class="privacy__field">
        <label class="privacy__label" for="show-video">Кто может просматривать мои видео</label>
        <PrivacyChoice v-model="profilePrivacy.showVideo" name="show-video" id="show-video" />
      </div>
      <div class="privacy__field">
        <label class="privacy__label" for="show-contacts">
          Кто может просматривать мои контакты
        </label>
        <PrivacyChoice
          v-model="profilePrivacy.showContacts"
          name="show-contacts"
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
  showPhone: '',
  showAccount: '',
  showPhoto: '',
  showVideo: '',
  showContacts: '',
})

watch(
  () => authStore.user,
  (newUser) => {
    const profile = newUser?.profile
    if (profile) {
      profilePrivacy.showPhone = profile.showPhone || 'all'
      profilePrivacy.showAccount = profile.showAccount || 'all'
      profilePrivacy.showPhoto = profile.showPhoto || 'all'
      profilePrivacy.showVideo = profile.showVideo || 'all'
      profilePrivacy.showContacts = profile.showContacts || 'all'
    }
  },
  { immediate: true, deep: true },
)

const saveSettings = async () => {
  serverError.value = ''
  isSuccess.value = false

  try {
    isLoading.value = true

    const response = await api.post('/profile/privacy', {
      showPhone: profilePrivacy.showPhone,
      showAccount: profilePrivacy.showAccount,
      showPhoto: profilePrivacy.showPhoto,
      showVideo: profilePrivacy.showVideo,
      showContacts: profilePrivacy.showContacts,
    })

    if (response.data && response.data.data) {
      authStore.setUser(response.data.data)
    }

    isSuccess.value = true

    setTimeout(() => {
      isSuccess.value = false
    }, 3000)
  } catch (err: any) {
    serverError.value = err.formattedMessage
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import '@/assets/css/settings/profile-settings.css';
</style>
