<template>
  <div class="users">
    <UsersFilter />
    <AppTransition name="dropdown" mode="out-in">
      <div v-if="userStore.isLoading && userStore.currentPage === 1" class="app-loader"></div>
      <div v-else class="wrapper">
        <UsersListItem v-for="user in userStore.users" :key="user.id" :user="user" />
      </div>
    </AppTransition>
    <div ref="loadMoreTrigger" class="load-more-trigger">
      <div v-if="userStore.isLoading && userStore.currentPage > 1" class="app-loader"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user.ts'
import UsersFilter from '@/components/details/users/UsersFilter.vue'
import UsersListItem from '@/components/details/users/UsersListItem.vue'
import AppTransition from '@/components/details/AppTransition.vue'

const route = useRoute()
const userStore = useUserStore()
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(async () => {
  userStore.resetPagination()
  await userStore.fetchUsers(route.query)
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && userStore.hasMore && !userStore.isLoading) {
        userStore.loadMore(route.query)
      }
    },
    { threshold: 0.1 },
  )
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
})

watch(
  () => route.query,
  async () => {
    userStore.resetPagination()
    await userStore.fetchUsers(route.query)
  },
  { deep: true },
)

watch(
  () => userStore.refreshTicket,
  async () => {
    userStore.resetPagination()
    await userStore.fetchUsers(route.query)
  },
)
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f5ddc5;
}

.load-more-trigger {
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
