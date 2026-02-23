import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const profile = ref<any>(null)
  const users = ref<any[]>([])
  const refreshTicket = ref(0)
  const triggerRefresh = () => refreshTicket.value++

  function setProfile(data: any) {
    profile.value = data
  }

  function setUsers(data: any[]) {
    users.value = data
  }

  function updateUserInList(userId: number, contactStatus: any, count?: number) {
    const user = users.value.find((u) => Number(u.id) === Number(userId))
    if (user) {
      user.contact_status = contactStatus
      if (count !== undefined) user.contacts_count = count
    }
  }

  function updateStatus(newStatus: any, newCount?: number) {
    if (profile.value) {
      profile.value = {
        ...profile.value,
        contact_status: newStatus,
        contacts_count: newCount !== undefined ? newCount : profile.value.contacts_count,
      }
    }
  }

  function clear() {
    profile.value = null
  }

  return {
    profile,
    users,
    refreshTicket,
    setProfile,
    updateStatus,
    clear,
    setUsers,
    updateUserInList,
    triggerRefresh,
  }
})
