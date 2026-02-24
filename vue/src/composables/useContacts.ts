import { ref } from 'vue'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import { useUserStore } from '@/stores/user.ts'

export function useContacts() {
  const isAddition = ref(false)
  const authStore = useAuthStore()
  const notify = useNotificationStore()
  const userStore = useUserStore()

  const fetchContacts = async (userId: number | string, contactStatus: string) => {
    try {
      const response = await api.get(`/user/${userId}/contacts`, {
        params: {
          contact_status: contactStatus,
        },
      })
      userStore.setUsers(response.data.data)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const toggleContact = async (userId: number | string) => {
    try {
      isAddition.value = true
      const response = await api.post(`/user/${userId}/contact`)

      if (response.data.pending_contacts_count !== undefined) {
        authStore.setUser({ pending_contacts_count: response.data.pending_contacts_count })
      }
      if (response.data.message) notify.show(response.data.message, 'info')

      return response.data
    } finally {
      isAddition.value = false
    }
  }

  const acceptContact = async (userId: number | string) => {
    try {
      isAddition.value = true
      const response = await api.post(`/user/${userId}/contact/accept`)

      if (response.data.pending_contacts_count !== undefined) {
        authStore.setUser({ pending_contacts_count: response.data.pending_contacts_count })
      }
      return response.data
    } finally {
      isAddition.value = false
    }
  }

  return { isAddition, toggleContact, acceptContact, fetchContacts }
}
