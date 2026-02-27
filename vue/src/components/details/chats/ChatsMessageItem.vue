<template>
  <div class="chat-message">
    <div :class="myMessage ? 'send' : 'get'">
      <p class="text">
        {{ message?.content }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chats.ts'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'

const props = defineProps<{
  message: any
}>()
const chatStore = useChatStore()
const authStore = useAuthStore()

const myMessage = computed(() => {
  return Number(authStore.user?.id) === Number(props.message.user_id)
})
</script>

<style scoped>
.chat-message {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
}

.send {
  max-width: 70%;
  width: fit-content;
  padding: 10px;
  margin: 10px;
  border-radius: 20px 20px 0 20px;
  background-color: #f5ddc5;
  filter: drop-shadow(var(--message-shadow));
  align-self: end;
  position: relative;
}

.send::after {
  content: '';
  position: absolute;
  right: -20px;
  bottom: 0;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle at 100% 0%, transparent 20px, #f5ddc5 11px);
}

.get {
  max-width: 70%;
  width: fit-content;
  padding: 10px;
  margin: 10px;
  border-radius: 20px 20px 20px 0;
  background-color: #f9f2e7;
  filter: drop-shadow(var(--message-shadow));
  align-self: start;
  position: relative;
}

.get::after {
  content: '';
  position: absolute;
  left: -20px;
  bottom: 0;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle at 0% 0%, transparent 20px, #f9f2e7 11px);
}

.text {
  font-size: 14px;
  color: #6e2c11;
}
</style>
