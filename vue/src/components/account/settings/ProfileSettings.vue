<template>
  <form class="personal" @submit.prevent="saveSettings" novalidate>
    <div class="personal__data">
      <div class="personal__field">
        <label class="personal__label" for="name">Имя и фамилия</label>
        <span class="personal__annotation">(чтобы вас могли найти другие участники)</span>
        <input v-model.trim="personalData.name" type="text" class="personal__input" id="name" />
      </div>
      <div class="personal__field">
        <label class="personal__label" for="phone">Номер телефона</label>
        <span class="personal__annotation">(будет использован для входа)</span>
        <input
          v-model="personalData.phone"
          v-maska
          data-maska="+7 (###) ###-##-##"
          data-maska-eager
          type="tel"
          id="phone"
          class="personal__input"
          :class="{ 'settings__input-error': errors.phone }"
          required
        />
      </div>
      <div class="personal__field">
        <label class="personal__label" for="country">Страна проживания</label>
        <input v-model="personalData.country" type="text" class="personal__input" id="country" />
      </div>
      <div class="personal__field">
        <label class="personal__label" for="city">Город проживания</label>
        <input v-model="personalData.city" type="text" class="personal__input" id="city" />
      </div>
      <div class="personal__field">
        <label class="personal__label" for="birthday">Дата рождения</label>
        <input
          v-model="personalData.birthday"
          type="date"
          class="personal__input"
          id="birthday"
          placeholder="ДД.ММ.ГГГГ"
          :class="{ 'settings__input-error': errors.birthday }"
        />
      </div>
    </div>
    <p v-if="serverError" class="settings__error">{{ serverError }}</p>
    <p v-if="isSuccess" class="settings__success">Данные успешно обновлены</p>
    <button type="submit" class="settings__button" :disabled="!isValidate || isLoading">
      {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { vMaska } from 'maska/vue'
import { useAuthStore } from '@/stores/auth.ts'
import { reactive, watch, computed, ref } from 'vue'
import api from '@/api.ts'

const authStore = useAuthStore()
const isLoading = ref(false)
const serverError = ref('')
const isSuccess = ref(false)

const personalData = reactive({
  name: '',
  phone: '',
  country: '',
  city: '',
  birthday: '',
})

const errors = reactive({
  phone: '',
  birthday: '',
})

const isValidate = computed(() => {
  const isNameValid = personalData.name.length > 2
  const isPhoneValid = personalData.phone.length === 18
  const isBirthdayValid = personalData.birthday && personalData.birthday.length === 10
  return isNameValid && isPhoneValid && isBirthdayValid
})

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      personalData.name = newUser.name || ''
      personalData.phone = newUser.phone || ''
      personalData.country = newUser.country || ''
      personalData.city = newUser.city || ''
      personalData.birthday = newUser.birthday || ''
    }
  },
  { immediate: true },
)

const validateData = () => {
  if (!personalData.phone) {
    errors.phone = 'Введите корректный номер телефона'
  } else {
    errors.phone = ''
  }
  if (personalData.birthday && personalData.birthday.length < 10) {
    errors.birthday = 'Введите корректную дату'
  } else {
    errors.birthday = ''
  }
}

watch(
  () => [personalData.phone, personalData.birthday],
  () => validateData(),
)

const saveSettings = async () => {
  serverError.value = ''
  errors.phone = ''
  isSuccess.value = false

  if (isValidate.value) {
    try {
      isLoading.value = true

      const cleanPhone = personalData.phone.replace(/\D/g, '')

      const response = await api.post('/profile', {
        name: personalData.name,
        phone: cleanPhone,
        country: personalData.country,
        city: personalData.city,
        birthday: personalData.birthday,
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
  } else {
    if (personalData.phone.length !== 18) errors.phone = 'Неверный формат номера'
    if (!personalData.birthday || personalData.birthday.length !== 10)
      errors.birthday = 'Неверный формат даты'
  }
}
</script>

<style scoped>
@import '@/assets/css/settings/profile-settings.css';
</style>
