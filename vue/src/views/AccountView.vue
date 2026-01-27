<template>
  <section class="account">
    <ProfileAvatar :user="user" :is-loading="isLoading" @update-user="(val) => (user = val)" />
    <div class="account__content">
      <ProfileInfo :user="user" :is-loading="isLoading" />
      <RouterView />
    </div>
  </section>
</template>

<script setup lang="ts">
import ProfileAvatar from '@/components/account/profile/ProfileAvatar.vue'
import ProfileInfo from '@/components/account/profile/ProfileInfo.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import api from '@/api'

interface UserProfileData {
  id: number
  name: string
  phone: string
  avatar: string | null
  profile: {
    country: string | null
    city: string | null
    birthday: string | null
    privacy: any
  }
}

const user = ref<UserProfileData | null>(null)

const route = useRoute()
const isLoading = ref(false)
const authStore = useAuthStore()

const fetchAccount = async () => {
  try {
    isLoading.value = true
    const response = await api.get(`/user/${route.params.id}`)
    user.value = response.data.data
    if (user.value && Number(user.value.id) === Number(authStore.user?.id)) {
      authStore.setUser(user.value)
    }
  } catch (error) {
    console.error(error, 'Данные не найдены')
  }
  isLoading.value = false
}
onMounted(fetchAccount)
watch(() => route.params.id, fetchAccount)
</script>

<style scoped>
@import '@/assets/css/account.css';
</style>
