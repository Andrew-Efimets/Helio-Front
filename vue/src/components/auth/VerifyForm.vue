<template>
  <form class="form" @submit.prevent="handleSubmit" novalidate>
    <div class="form__wrapper">
      <p class="form__notify">Введите код подтверждения из СМС</p>

      <FormInput
        v-model.trim="validateForm.code"
        type="text"
        placeholder="Код"
        :error="errors.code"
        required
      />
      <p v-if="serverError" class="form__message-error">{{ serverError }}</p>

      <button type="submit" class="form__button" :disabled="!isValidate || isLoading">
        продолжить
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormInput from '@/components/auth/FormInput.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api.ts'

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)
const serverError = ref('')

const validateForm = reactive({
  code: '',
})

const errors = reactive({
  code: '',
})

const isValidate = computed(() => {
  return validateForm.code.length === 4
})

const handleSubmit = async () => {
  serverError.value = ''
  errors.code = ''

  if (!isValidate.value) {
    errors.code = 'Неверный код'
    return
  }

  if (isValidate.value) {
    console.log('Отправка:', JSON.stringify(validateForm))

    try {
      isLoading.value = true

      const response = await api.post('/verify', {
        phone: authStore.tempPhone,
        code: validateForm.code,
      })

      console.log('Успех:', response.data.data)

      authStore.setUser(response.data.data)

      authStore.setAuth(true)

      localStorage.removeItem('temp_phone')

      router.push('/account')
    } catch (err: any) {
      if (err.response?.status === 422) {
        const vErrors = err.response.data.errors
        if (vErrors?.code) {
          errors.code = vErrors.code[0]
        } else {
          serverError.value = err.response.data.message
        }
      } else if (err.response?.status === 429) {
        serverError.value = 'Слишком много запросов. Попробуйте через минуту'
      } else if (err.response?.status === 403) {
        serverError.value = 'Доступ запрещён'
      } else {
        serverError.value = 'Ошибка сервера'
      }
    } finally {
      isLoading.value = false
    }
  } else {
    if (validateForm.code.length < 4) errors.code = 'Неверный код'
  }
}
</script>

<style scoped>
@import '@/assets/css/auth-form.css';
</style>
