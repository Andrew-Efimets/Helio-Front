<template>
  <div class="info">
    <div v-if="isLoading" class="wrapper">
      <span class="app-loader"></span>
    </div>
    <div v-else class="wrapper">
      <div class="name-wrapper">
        <RouterLink :to="{ name: 'wall', params: { id: user?.id } }" class="name">
          {{ user?.name }}
        </RouterLink>
      </div>

      <div v-for="item in displayInfo" :key="item.title" class="list">
        <p class="item-title">{{ item.title }}</p>
        <p class="item">{{ item.value || 'не указан' }}</p>
      </div>

      <div v-if="authStore.canSee(user, 'show_phone')" class="list">
        <p class="item-title">Телефон:</p>
        <p class="item">{{ user?.phone ? `+ ${user.phone}` : 'не указан' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const props = defineProps<{
  user: any
  isLoading: boolean
}>()

const authStore = useAuthStore()

const formatDate = (dateString: string | null) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU').format(date)
}

const displayInfo = computed(() => [
  { title: 'Страна:', value: props.user?.profile?.country },
  { title: 'Город:', value: props.user?.profile?.city },
  { title: 'День рождения:', value: formatDate(props.user?.profile?.birthday) },
])
</script>

<style scoped>
.info {
  padding: 40px 0 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  background-color: #f5ddc5;
  min-width: 600px;
  min-height: 200px;
}

.name-wrapper {
  margin: 0 10px;
  box-shadow: 0 10px 4px -2px rgba(196, 114, 51, 0.2);
  border-radius: 5px;
  padding: 10px;
}

.name {
  color: #6e2c11;
  font-size: 22px;
  font-weight: 700;
  text-decoration: none;
}

.item {
  padding: 20px 0 10px 20px;
  color: #6e2c11;
  width: 30%;
}

.list {
  display: flex;
}

.item-title {
  font-weight: 700;
  padding: 20px 0 10px 20px;
  color: #6e2c11;
  width: 30%;
}
</style>
