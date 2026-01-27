import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  name: string
  phone?: string
  avatar?: string
  country?: string
  city?: string
  birthday?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(
    (() => {
      const data = localStorage.getItem('user_data')
      if (!data) return null
      try {
        return JSON.parse(data)
      } catch (e) {
        localStorage.removeItem('user_data')
        return null
      }
    })(),
  )

  const isVerified = ref<boolean>(!!localStorage.getItem('is_auth'))
  const tempPhone = ref<string>(localStorage.getItem('temp_phone') || '')

  function setUser(data: Partial<User>) {
    const updatedUser = { ...user.value, ...data } as User
    user.value = updatedUser
    localStorage.setItem('user_data', JSON.stringify(updatedUser))
  }

  function setPhone(phone: string) {
    tempPhone.value = phone
    localStorage.setItem('temp_phone', phone)
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
    user.value = null
    tempPhone.value = ''
    isVerified.value = false
    localStorage.removeItem('is_auth')
    localStorage.removeItem('temp_phone')
    localStorage.removeItem('user_data')
  }

  return {
    user,
    tempPhone,
    isVerified,
    setPhone,
    reset,
    setAuth,
    setUser,
  }
})
