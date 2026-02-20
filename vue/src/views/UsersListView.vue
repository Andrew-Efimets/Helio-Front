<template>
  <div class="users">
    <UsersFilter />
    <div v-if="isLoading" class="app-loader"></div>
    <div v-else class="wrapper">
      <UsersListItem v-for="user in users" :key="user.id" :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api'
import { useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import UsersFilter from '@/components/details/users/UsersFilter.vue'
import UsersListItem from '@/components/details/users/UsersListItem.vue'

const route = useRoute()
const users = ref<any[]>([])
const isLoading = ref(false)

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

    users.value = response.data.data
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

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f5ddc5;
}
</style>
