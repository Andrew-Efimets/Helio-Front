<template>
  <section class="account">
    <div v-if="isLoading || (user && authStore.canSee(user, 'show_account'))" class="wrapper">
      <ProfileAvatar
        :user="user"
        :is-loading="isLoading"
        @update-user="(val) => userStore.setProfile(val)"
      />
      <div class="content">
        <ProfileInfo :user="user" :is-loading="isLoading" />
        <RouterView v-if="!isLoading" @refresh-account="fetchAccount" />
      </div>
    </div>
    <div v-else class="wrapper">
      <div class="wrapper-closed">
        <ProfileClosed
          :user="user"
          :is-loading="isLoading"
          @update-user="(val) => userStore.setProfile(val)"
          @refresh-account="fetchAccount"
        />
      </div>
    </div>
    <ModalView />
  </section>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, ref } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { useAuthStore, type PrivacySettings } from '@/stores/auth.ts'
import { useUserStore } from '@/stores/user'
import api from '@/api'

import ProfileAvatar from '@/components/account/profile/ProfileAvatar.vue'
import ProfileInfo from '@/components/account/profile/ProfileInfo.vue'
import ProfileClosed from '@/components/account/profile/ProfileClosed.vue'
import ModalView from '@/views/ModalView.vue'

interface UserProfileData {
  id: number
  name: string
  phone: string | null
  contact_status: { type: 'pending' | 'accepted' | null; is_sender: boolean } | null
  avatar: string | null
  photos_count: number | null
  videos_count: number | null
  contacts_count: number | null
  profile: {
    country: string | null
    city: string | null
    birthday: string | null
    privacy: PrivacySettings
  }
}

const route = useRoute()
const isLoading = ref(false)
const authStore = useAuthStore()
const userStore = useUserStore()

const user = computed<UserProfileData | null>(() => userStore.profile)

const fetchAccount = async () => {
  try {
    isLoading.value = true
    const response = await api.get(`/user/${route.params.id}`)
    userStore.setProfile(response.data.data)

    if (user.value && Number(user.value.id) === Number(authStore.user?.id)) {
      authStore.setUser(user.value as any)
    }
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAccount)

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      userStore.clear()
      fetchAccount()
    }
  },
)

watch(
  () => userStore.profile?.contact_status?.type,
  (newStatus, oldStatus) => {
    if (newStatus === 'accepted' && oldStatus !== 'accepted') {
      fetchAccount()
    }

    if (!newStatus && oldStatus === 'accepted' && user.value?.id !== authStore.user?.id) {
      fetchAccount()
    }
  },
)
</script>

<style scoped>
.account {
  display: flex;
  width: 100%;
}

.wrapper {
  display: flex;
  width: 100%;
}

.content {
  flex-grow: 1;
  max-width: 700px;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .wrapper {
    flex-direction: column;
    align-items: center;
  }
}
</style>
