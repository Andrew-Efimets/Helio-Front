<template>
  <form class="form" @submit.prevent="handleSubmit" novalidate>
    <div class="wrapper">
      <p class="notify">Введите код подтверждения из СМС</p>

      <FormInput
        v-model.trim="validateForm.code"
        type="text"
        placeholder="Код"
        :error="errors.code"
        required
      />
      <p v-if="serverError" class="message-error">{{ serverError }}</p>

      <button type="submit" class="button" :disabled="!isValidate || isLoading">продолжить</button>
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
    try {
      isLoading.value = true

      const response = await api.post('/verify', {
        phone: authStore.tempPhone,
        code: validateForm.code,
      })

      authStore.setUser(response.data.data)

      authStore.setAuth(true)

      localStorage.removeItem('temp_phone')

      router.push('/account')
    } catch (err: any) {
      if (err.response?.status === 422) {
        serverError.value = err.formattedMessage
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
.wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: auto;
}

.notify {
  text-align: center;
  text-decoration: none;
  color: #6e2c11;
  font-size: 22px;
  font-weight: 600;
}

.message-error {
  color: darkred;
}
</style>
