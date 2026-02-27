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
      <div class="messages__wrapper" ref="messagesWrapper" @scroll="handleScroll">
        <div v-if="chatStore.isLoading" class="app-loader"></div>
        <div class="messages" v-for="message in chatStore.chat?.messages?.data" :key="message.id">
          <ChatsMessageItem :message="message" />
        </div>
      </div>
      <MessageInput v-model="messageText" placeholder="Напишите сообщение" @send="saveMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chats.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { computed, ref, onUnmounted, nextTick } from 'vue'
import ChatsMessageItem from '@/components/details/chats/ChatsMessageItem.vue'
import MessageInput from '@/components/details/MessageInput.vue'
import { useNotificationStore } from '@/stores/notifications.ts'

const chatStore = useChatStore()
const route = useRoute()
const authStore = useAuthStore()
const messageText = ref('')
const notify = useNotificationStore()
const messagesWrapper = ref<HTMLElement | null>(null)

const avatarSource = computed(() => chatStore.chat?.avatar || chatStore.chat?.companion_avatar)

const saveMessage = async (text: string) => {
  if (!text.trim()) return
  try {
    await chatStore.addMessage(authStore.user?.id as any, text, chatStore.chat?.id)
    messageText.value = ''
  } catch (error) {
    notify.show('Не удалось отправить сообщение', 'error')
  }
}

const handleScroll = async () => {
  const el = messagesWrapper.value
  if (!el) return
  if (el.scrollTop < 50 && !chatStore.isLoading) {
    const oldHeight = el.scrollHeight

    await chatStore.loadPreviousMessages(route.params.chatId as string)

    nextTick(() => {
      el.scrollTop = el.scrollHeight - oldHeight
    })
  }
}

watch(
  [() => authStore.user?.id, () => route.params.chatId],
  ([newUserId, newChatId]) => {
    if (newUserId && newChatId) {
      chatStore.fetchChat(newChatId as string).then(() => {
        nextTick(() => {
          if (messagesWrapper.value) {
            messagesWrapper.value.scrollTop = messagesWrapper.value.scrollHeight
          }
        })

        window.Echo.private(`chats.${newChatId}`).listen('.message.created', (e: any) => {
          chatStore.addEchoMessage(e.message)
        })
      })
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (route.params.chatId) {
    window.Echo.leave(`chats.${route.params.chatId}`)
  }
})
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
  background: linear-gradient(45deg, rgba(255, 236, 211, 0.78), #f9f2e7);
}

.title {
  color: #6e2c11;
  font-size: 16px;
  font-weight: bold;
}

.plate {
  width: 100%;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  padding: 10px;
  background: var(--main-plate-gradient);
  min-height: 100px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(110, 44, 17, 0.3);
}

.messages__wrapper {
  margin: 10px 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(153, 61, 26, 0.5) transparent;
}

.messages__wrapper::-webkit-scrollbar {
  width: 6px;
}

.messages__wrapper::-webkit-scrollbar-thumb {
  background-color: #6e2c11;
  border-radius: 10px;
}
</style>
