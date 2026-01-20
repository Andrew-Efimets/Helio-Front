<template>
  <form class="form" @submit.prevent="handleSubmit" novalidate>
    <div class="form-wrapper">
      <p class="notify">На указанный номер будет выслан код подтверждения</p>

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

      <button type="submit" class="button" :disabled="!isValidate">продолжить</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import FormInput from '@/components/auth/FormInput.vue'

const loginForm = reactive({
  phone: '',
  password: '',
})

const errors = reactive({
  phone: '',
  password: '',
})

const handleSubmit = () => {
  Object.keys(errors).forEach((key) => (errors[key as keyof typeof errors] = ''))

  let isValid = true

  if (!loginForm.phone) {
    errors.phone = 'Введите номер телефона'
    isValid = false
  }

  if (loginForm.password.length < 6) {
    errors.password = 'Минимум 6 символов'
    isValid = false
  }

  if (isValid) {
    console.log('Отправка:', JSON.stringify(loginForm))
  }
}

const isValidate = computed(() => {
  const isPhoneValid = loginForm.phone.length === 18
  const isPasswordValid = loginForm.password.length >= 6
  return isPhoneValid && isPasswordValid
})
</script>

<style scoped>
@import '@/assets/css/auth-form.css';
</style>
