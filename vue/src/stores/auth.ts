import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const tempPhone = ref<string>('')
  const isVerified = ref<boolean>(!!localStorage.getItem('is_auth'))

  function setPhone(phone: string) {
    tempPhone.value = phone
  }

  function setAuth(status: boolean) {
    isVerified.value = status
    if (status) {
      localStorage.setItem('is_auth', 'true')
    } else {
      localStorage.removeItem('is_auth')
    }
  }

  function reset() {
    tempPhone.value = ''
    isVerified.value = false
    localStorage.removeItem('is_auth')
  }

  return { tempPhone, isVerified, setPhone, reset, setAuth }
})
