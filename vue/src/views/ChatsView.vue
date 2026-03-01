<template>
  <div class="chats">
    <ChatsList />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import ChatsList from '@/components/details/chats/ChatsList.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
.chats {
  display: flex;
  margin-top: 20px;
}
</style>
