<template>
  <section class="account">
    <div v-if="authStore.canSee(user, 'show_account')" class="account__wrapper">
      <ProfileAvatar :user="user" :is-loading="isLoading" @update-user="(val) => (user = val)" />
      <div class="account__content">
        <ProfileInfo :user="user" :is-loading="isLoading" />
        <RouterView />
      </div>
    </div>
    <div v-else class="account__wrapper">
      <div class="account__wrapper-closed">
        <ProfileClosed :user="user" :is-loading="isLoading" @update-user="(val) => (user = val)" />
        <div class="account__closed-error">
          <RouterView v-if="!isLoading" />
        </div>
      </div>
    </div>
    <ModalView />
  </section>
</template>

<script setup lang="ts">
import ProfileAvatar from '@/components/account/profile/ProfileAvatar.vue'
import ProfileInfo from '@/components/account/profile/ProfileInfo.vue'
import ProfileClosed from '@/components/account/profile/ProfileClosed.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import api from '@/api'
import ModalView from '@/views/ModalView.vue'

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
