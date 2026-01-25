<template>
  <form class="form" @submit.prevent="handleSubmit" novalidate>
    <div class="form__wrapper">
      <p class="form__notify">На указанный номер будет выслан код подтверждения</p>

      <FormInput
        v-model="loginForm.phone"
        type="tel"
        placeholder="+7 (900) 000-00-00"
        mask="+7 (###) ###-##-##"
        :error="errors.phone"
        required
      />

      <FormInput
        v-model.trim="loginForm.password"
        type="password"
        placeholder="Пароль"
        :error="errors.password"
        required
      />
      <p v-if="serverError" class="form__message-error">{{ serverError }}</p>

      <RouterLink :to="{ name: 'register' }" class="form__link">Регистрация</RouterLink>

      <button type="submit" class="form__button" :disabled="!isValidate || isLoading">
        {{ isLoading ? 'загрузка...' : 'продолжить' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import FormInput from '@/components/auth/FormInput.vue'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

const loginForm = reactive({
  phone: '',
  password: '',
})

const errors = reactive({
  phone: '',
  password: '',
})

const isValidate = computed(() => {
  const isPhoneValid = loginForm.phone.length === 18
  const isPasswordValid = loginForm.password.length >= 2
  return isPhoneValid && isPasswordValid
})

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)
const serverError = ref('')

const handleSubmit = async () => {
  serverError.value = ''
  Object.assign(errors, { phone: '', password: '' })

  if (isValidate.value) {
    try {
      isLoading.value = true

      const cleanPhone = loginForm.phone.replace(/\D/g, '')

      const response = await api.post('/login', {
        phone: cleanPhone,
        password: loginForm.password,
      })

      authStore.setPhone(cleanPhone)

      router.push('/auth/verify')
    } catch (err: any) {
      serverError.value = err.formattedMessage
    } finally {
      isLoading.value = false
    }
  } else {
    if (loginForm.phone.length < 18) errors.phone = 'Неверный формат номера'
    if (loginForm.password.length < 2) errors.password = 'Минимум 6 символов'
  }
}
</script>

<style scoped>
@import '@/assets/css/auth-form.css';
</style>
