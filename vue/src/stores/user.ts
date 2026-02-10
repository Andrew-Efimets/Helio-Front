import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const profile = ref<any>(null)

  function setProfile(data: any) {
    profile.value = data
  }

  function updateStatus(newStatus: any, newCount?: number) {
    if (profile.value) {
      profile.value.contact_status = newStatus
      if (newCount !== undefined) {
        profile.value.contacts_count = newCount
      }
    }
  }

  function clear() {
    profile.value = null
  }

  return { profile, setProfile, updateStatus, clear }
})
