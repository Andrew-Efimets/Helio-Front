import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserProfile {
  showPhone: string
  showAccount: string
  showPhoto: string
  showVideo: string
  showContacts: string
}
interface User {
  id: number
  name: string
  phone?: string
  avatar?: string
  country?: string
  city?: string
  birthday?: string
  profile?: UserProfile
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(
    localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')!) : null,
  )

  const isVerified = ref<boolean>(!!localStorage.getItem('is_auth'))
  const tempPhone = ref<string>(!!localStorage.getItem('temp_phone') || '')

  function setUser(data: User) {
    const updatedUser = { ...user.value, ...data }
    user.value = updatedUser as User
    localStorage.setItem('user_data', JSON.stringify(data))
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
