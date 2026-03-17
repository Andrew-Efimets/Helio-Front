<template>
  <form class="form" @submit.prevent="handleSubmit" novalidate>
    <div class="wrapper">
      <p class="notify">Придумайте новый пароль</p>

      <FormInput
        v-model.trim="resetForm.password"
        type="password"
        placeholder="Новый пароль"
        :error="errors.password"
        required
      />

      <FormInput
        v-model.trim="resetForm.password_confirmation"
        type="password"
        placeholder="Повторите пароль"
        :error="errors.password_confirmation"
        required
      />

      <p v-if="serverError" class="message-error">{{ serverError }}</p>

      <button type="submit" class="button" :disabled="!isValidate || isLoading">
        {{ isLoading ? 'сохраняем...' : 'изменить пароль' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, reactive, ref } from 'vue'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications.ts'
import FormInput from '@/components/auth/FormInput.vue'

const resetForm = reactive({
  password: '',
  password_confirmation: '',
})

const errors = reactive({
  password: '',
  password_confirmation: '',
})

const isValidate = computed(() => {
  const isPasswordValid = resetForm.password.length >= 6
  const isConfirmed = resetForm.password === resetForm.password_confirmation
  return isPasswordValid && isConfirmed
})

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)
const serverError = ref('')
const notify = useNotificationStore()

const handleSubmit = async () => {
  serverError.value = ''
  Object.assign(errors, { password: '', password_confirmation: '' })

  if (isValidate.value) {
    try {
      isLoading.value = true

      await api.post('/reset-password', {
        phone: authStore.tempPhone,
        password: resetForm.password,
        code: localStorage.getItem('reset_code'),
      })

      localStorage.removeItem('reset_code')
      localStorage.removeItem('temp_phone')
      authStore.reset()
      notify.show('Пароль успешно изменён', 'success')
      router.push({ name: 'login' })
    } catch (err: any) {
      serverError.value = err.formattedMessage
    } finally {
      isLoading.value = false
    }
  } else {
    if (resetForm.password.length < 6) errors.password = 'Минимум 6 символов'
    if (resetForm.password !== resetForm.password_confirmation) {
      errors.password_confirmation = 'Пароли не совпадают'
    }
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
  margin: 20px auto;
}

.notify {
  text-align: center;
  text-decoration: none;
  color: #6e2c11;
  font-size: 18px;
  font-weight: 700;
}

.message-error {
  color: darkred;
}
</style>
