<template>
  <div class="info">
    <div v-if="isLoading" class="info__wrapper">
      <span class="info__loader"></span>
    </div>
    <div v-else class="info__wrapper">
      <div class="info__name-wrapper">
        <h3 class="info__name">
          {{ user?.name }}
        </h3>
      </div>
      <p class="info__phone">
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
