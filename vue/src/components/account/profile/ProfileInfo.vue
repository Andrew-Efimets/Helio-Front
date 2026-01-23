<template>
  <div class="info-container">
    <div v-if="isLoading" class="info-wrapper">
      <span class="dots"></span>
    </div>
    <div v-else class="info-wrapper">
      <div class="user-name-wrapper">
        <h3 class="user-name">
          {{ user?.name }}
        </h3>
      </div>
      <p class="user-phone">
        {{ user?.phone }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  user: any
  isLoading: boolean
}>()
</script>

<style scoped>
@import '@/assets/css/profile/profile-info.css';
</style>
