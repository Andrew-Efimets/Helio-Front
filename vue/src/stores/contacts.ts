import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import { useRoute } from 'vue-router'

export const useContactStore = defineStore('comments', () => {
  const allContacts = ref<any[]>([])
  const isLoading = ref(false)
  const route = useRoute()

  const totalCount = computed(() => allContacts.value.length)

  const fetchUserContacts = async (userId: string | number) => {
    // const response = await api.get(`/user/${userId}/contacts`)
  }

  return {
    allContacts,
    isLoading,
    totalCount,
    fetchUserContacts,
  }
})
