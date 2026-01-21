<template>
  <form class="form" @submit.prevent="handleSubmit" novalidate>
    <div class="form-wrapper">
      <p class="notify">На указанный номер будет выслан код подтверждения</p>

      <FormInput
        v-model.trim="registerForm.name"
        type="text"
        placeholder="Имя и фамилия"
        :error="errors.name"
        required
      />

      <FormInput
        v-model="registerForm.phone"
        type="tel"
        placeholder="+7 (900) 000-00-00"
        mask="+7 (###) ###-##-##"
        :error="errors.phone"
        required
      />
      <p v-if="serverError" class="message-error">{{ serverError }}</p>

      <FormInput
        v-model.trim="registerForm.password"
        type="password"
        placeholder="Пароль"
        :error="errors.password"
        required
      />

      <button type="submit" class="button" :disabled="!isValidate || isLoading">
        {{ isLoading ? 'загрузка...' : 'продолжить' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormInput from '@/components/auth/FormInput.vue'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

const registerForm = reactive({
  name: '',
  phone: '',
  password: '',
})

const errors = reactive({
  name: '',
  phone: '',
  password: '',
})

const isValidate = computed(() => {
  const isNameValid = registerForm.name.length > 2
  const isPhoneValid = registerForm.phone.length === 18
  const isPasswordValid = registerForm.password.length >= 2
  return isNameValid && isPhoneValid && isPasswordValid
})

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)
const serverError = ref('')

const handleSubmit = async () => {
  serverError.value = ''
  Object.assign(errors, { name: '', phone: '', password: '' })

  if (isValidate.value) {
    console.log('Отправка:', JSON.stringify(registerForm))

    try {
      isLoading.value = true

      const cleanPhone = registerForm.phone.replace(/\D/g, '')

      const response = await api.post('/register', {
        name: registerForm.name,
        phone: cleanPhone,
        password: registerForm.password,
      })

      authStore.setPhone(cleanPhone)

      console.log('Успех:', response.data)
      router.push('/auth/verify')
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 422) {
          serverError.value = 'Этот номер уже зарегистрирован'
        } else if (err.response.status === 419) {
          serverError.value = 'Сессия истекла, обновите страницу'
        } else {
          serverError.value = err.response.data.message || 'Произошла ошибка на сервере'
        }
      } else {
        serverError.value = 'Нет соединения с сервером'
      }
    } finally {
      isLoading.value = false
    }
  } else {
    if (registerForm.name.length <= 2) errors.name = 'Имя слишком короткое'
    if (registerForm.phone.length < 18) errors.phone = 'Неверный формат номера'
    if (registerForm.password.length < 2) errors.password = 'Минимум 6 символов'
  }
}
</script>

<style scoped>
@import '@/assets/css/auth-form.css';
.message-error {
  color: red;
}
</style>
