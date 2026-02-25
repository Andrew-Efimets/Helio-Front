import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api.ts'

export const useUserStore = defineStore('user', () => {
  const profile = ref<any>(null)
  const users = ref<any[]>([])
  const refreshTicket = ref(0)
  const currentPage = ref(1)
  const hasMore = ref(true)
  const isLoading = ref(false)
  const lastPage = ref(1)
  const triggerRefresh = () => {
    resetPagination()
    refreshTicket.value++
  }

  function resetPagination() {
    users.value = []
    currentPage.value = 1
    hasMore.value = true
  }

  async function fetchUsers(query: any = {}) {
    if (isLoading.value || !hasMore.value) return

    try {
      isLoading.value = true
      const response = await api.get('/users', {
        params: {
          ...query,
          page: currentPage.value,
        },
      })

      const newUsers = response.data.data
      lastPage.value = response.data.meta.last_page

      hasMore.value = currentPage.value < lastPage.value

      if (currentPage.value === 1) {
        users.value = newUsers
      } else {
        users.value = [...users.value, ...newUsers]
      }
    } catch (e) {
      console.error('Ошибка загрузки пользователей:', e)
    } finally {
      isLoading.value = false
    }
  }

  function loadMore(query: any = {}) {
    if (!isLoading.value && hasMore.value) {
      currentPage.value++
      fetchUsers(query)
    }
  }

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
    currentPage,
    hasMore,
    isLoading,
    refreshTicket,
    setProfile,
    updateStatus,
    setUsers,
    updateUserInList,
    triggerRefresh,
    fetchUsers,
    loadMore,
    resetPagination,
    clear,
  }
})
