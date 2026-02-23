<template>
  <div class="users">
    <UsersFilter />
    <div v-if="isLoading" class="app-loader"></div>
    <div v-else class="wrapper">
      <UsersListItem
        v-for="user in userStore.users"
        :key="user.id"
        :user="user"
        @update-user="handleUpdateUser"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api'
import { useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.ts'
import UsersFilter from '@/components/details/users/UsersFilter.vue'
import UsersListItem from '@/components/details/users/UsersListItem.vue'

const route = useRoute()
const isLoading = ref(false)
const userStore = useUserStore()

const fetchUsers = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/users', {
      params: {
        search: route.query.search,
        country: route.query.country,
        city: route.query.city,
        age_from: route.query.age_from,
        age_to: route.query.age_to,
        sort: route.query.sort,
      },
    })

    userStore.setUsers(response.data.data)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.query,
  () => {
    fetchUsers()
  },
  { deep: true },
)

const handleUpdateUser = (updatedUser: any) => {
  userStore.updateUserInList(updatedUser.id, updatedUser.contact_status, updatedUser.contacts_count)
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f5ddc5;
}
</style>
