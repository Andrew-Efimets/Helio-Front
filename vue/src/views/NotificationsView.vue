<template>
  <Teleport to="body">
    <Transition name="slide-down">
      <div v-if="notification.message" :class="['global-notification', notification.type]">
        {{ notification.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'
const notification = useNotificationStore()
</script>

<style scoped>
@import '@/assets/css/pages/notifications-view.css';
</style>
