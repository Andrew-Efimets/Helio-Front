import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PrivacySettings {
  show_phone: 'public' | 'contacts_only' | 'private'
  show_account: 'public' | 'contacts_only' | 'private'
  show_photo: 'public' | 'contacts_only' | 'private'
  show_video: 'public' | 'contacts_only' | 'private'
  show_contacts: 'public' | 'contacts_only' | 'private'
}
export interface Profile {
  country?: string | null
  city?: string | null
  birthday?: string | null
  privacy: PrivacySettings
}

export interface AuthUser {
  id: number
  name: string
  phone: string
  avatar: string | null
  photos_count?: number
  videos_count?: number
  contacts_count?: number
  pending_contacts_count?: number
  unread_messages_count?: number
  profile?: Profile
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(
    (() => {
      const data = localStorage.getItem('user_data')
      if (!data) return null
      try {
        return JSON.parse(data)
      } catch {
        localStorage.removeItem('user_data')
        return null
      }
    })(),
  )

  const isVerified = ref<boolean>(!!localStorage.getItem('is_auth'))
  const tempPhone = ref<string>(localStorage.getItem('temp_phone') || '')

  function setUser(data: Partial<AuthUser>) {
    const updatedUser = user.value ? { ...user.value, ...data } : (data as AuthUser)
    user.value = updatedUser
    localStorage.setItem('user_data', JSON.stringify(updatedUser))
  }

  function setPhone(phone: string) {
    tempPhone.value = phone
    localStorage.setItem('temp_phone', phone)
  }

  function setAuth(status: boolean) {
    isVerified.value = status
    status ? localStorage.setItem('is_auth', 'true') : localStorage.removeItem('is_auth')
  }

  function reset() {
    user.value = null
    tempPhone.value = ''
    isVerified.value = false
    localStorage.removeItem('is_auth')
    localStorage.removeItem('temp_phone')
    localStorage.removeItem('user_data')
  }

  const canSee = (targetUser: any, key: keyof PrivacySettings) => {
    if (!targetUser) return false

    if (user.value?.id === targetUser.id) return true

    const privacyStatus = targetUser.profile?.privacy?.[key]

    if (privacyStatus === 'public') return true

    if (privacyStatus === 'contacts_only') {
      return targetUser.contact_status?.type === 'accepted'
    }

    return false
  }

  return {
    user,
    tempPhone,
    isVerified,
    setPhone,
    reset,
    setAuth,
    setUser,
    canSee,
  }
})
