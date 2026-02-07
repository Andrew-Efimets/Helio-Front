<template>
  <form class="form" @submit.prevent="handleSubmit" novalidate>
    <div class="wrapper">
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
        {{ isLoading ? 'отправляем код...' : 'продолжить' }}
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
    try {
      isLoading.value = true

      const cleanPhone = registerForm.phone.replace(/\D/g, '')

      const response = await api.post('/register', {
        name: registerForm.name,
        phone: cleanPhone,
        password: registerForm.password,
      })

      authStore.setPhone(cleanPhone)

      router.push('/verify')
    } catch (err: any) {
      serverError.value = err.formattedMessage
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
