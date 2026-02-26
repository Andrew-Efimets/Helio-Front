<template>
  <div class="chat">
    <div v-if="chatStore.chat" class="header">
      <div class="image__wrapper">
        <img :src="avatarSource" alt="" class="image" />
      </div>
      <p class="title">
        {{ chatStore.chat?.title ? chatStore.chat?.title : chatStore.chat?.companion_name }}
      </p>
    </div>
    <div class="plate">
      <MessageInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chats.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { computed } from 'vue'
import MessageInput from '@/components/details/MessageInput.vue'

const chatStore = useChatStore()
const route = useRoute()
const authStore = useAuthStore()

const avatarSource = computed(() => chatStore.chat?.avatar || chatStore.chat?.companion_avatar)

watch(
  () => authStore.user?.id,
  (newId) => {
    const chatId = route.params.chatId
    if (newId && chatId) {
      chatStore.fetchChat(chatId as string)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.chat {
  width: 100%;
  background-color: #f5ddc5;
  padding: 10px;
}

.image__wrapper {
  width: 40px;
  height: 40px;
}

.image {
  width: 100%;
  border-radius: 50%;
}

.header {
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f9f2e7;
  box-shadow: 0 0 10px rgba(110, 44, 17, 0.3);
}

.title {
  color: #6e2c11;
  font-size: 16px;
  font-weight: bold;
}

.plate {
  display: flex;
  flex-direction: column;
  justify-content: end;
  margin: 10px 0;
  padding: 10px;
  background: linear-gradient(45deg, #f9f2e7, rgba(213, 160, 98, 0.3), #f9f2e7);
  min-height: 200px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(110, 44, 17, 0.3);
}
</style>
