<template>
  <section class="account">
    <ProfileAvatar :user="user" />
    <div class="account__content">
      <ProfileInfo :user="user" :isLoading />
      <RouterView />
    </div>
  </section>
</template>

<script setup lang="ts">
import ProfileAvatar from '@/components/account/profile/ProfileAvatar.vue'
import ProfileInfo from '@/components/account/profile/ProfileInfo.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import api from '@/api'

const route = useRoute()
const user = ref(null)
const isLoading = ref(false)

const fetchAccount = async () => {
  try {
    isLoading.value = true
    const response = await api.get(`/user/${route.params.id}`)
    user.value = response.data.data
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
