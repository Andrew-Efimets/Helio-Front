<template>
  <section class="account-container">
    <ProfileMenu />
    <ProfileAvatar :user="user" />
    <div class="main-content">
      <ProfileInfo :user="user" />
      <RouterView />
    </div>
  </section>
</template>

<script setup lang="ts">
import ProfileMenu from '@/components/account/main/ProfileMenu.vue'
import ProfileAvatar from '@/components/account/main/ProfileAvatar.vue'
import ProfileInfo from '@/components/account/main/ProfileInfo.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import api from '@/api'

const route = useRoute()
const user = ref(null)

const fetchAccount = async () => {
  try {
    const response = await api.get(`/user/${route.params.id}`)
    user.value = response.data.data
  } catch (error) {
    console.error(error, 'Данные не найдены')
  }
}
onMounted(fetchAccount)
watch(() => route.params.id, fetchAccount)
</script>

<style scoped>
@import '@/assets/css/account.css';
</style>
