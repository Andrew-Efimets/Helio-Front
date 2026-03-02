<template>
  <div class="chat">
    <ChatHeader />
    <div class="plate">
      <div class="messages__wrapper" ref="messagesWrapper" @scroll="handleScroll">
        <div v-if="chatStore.isLoading" class="app-loader"></div>
        <div class="messages" v-for="message in chatStore.chat?.messages?.data" :key="message.id">
          <ChatsMessageItem :message="message" />
        </div>
      </div>
      <div v-if="chatStore.replyTo" class="quote-preview">
        <div class="quote-content">
          <span class="quote-author">{{ chatStore.replyTo.user.name }}:</span>
          <span class="quote-text">{{ chatStore.replyTo.content }}</span>
        </div>
        <button class="quote-close" @click="chatStore.clearReply">×</button>
      </div>
      <MessageInput v-model="messageText" :is-editing="!!editingMessage" @send="saveMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chats.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { ref, onUnmounted, nextTick } from 'vue'
import ChatHeader from '@/components/details/chats/ChatHeader.vue'
import ChatsMessageItem from '@/components/details/chats/ChatsMessageItem.vue'
import MessageInput from '@/components/details/MessageInput.vue'
import { useNotificationStore } from '@/stores/notifications.ts'

const chatStore = useChatStore()
const route = useRoute()
const authStore = useAuthStore()
const messageText = ref('')
const notify = useNotificationStore()
const messagesWrapper = ref<HTMLElement | null>(null)
const editingMessage = ref<any>(null)

const saveMessage = async (text: string) => {
  if (!text.trim()) return

  try {
    if (editingMessage.value) {
      await chatStore.updateMessage(editingMessage.value.id, text, chatStore.chat.id)
      editingMessage.value = null
    } else {
      await chatStore.addMessage(text, chatStore.chat.id)
      scrollToBottom()
    }
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

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesWrapper.value) {
      messagesWrapper.value.scrollTop = messagesWrapper.value.scrollHeight
    }
  })
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

        window.Echo.private(`chats.${newChatId}`)
          .listen('.message.created', (e: any) => {
            chatStore.addEchoMessage(e.message)
            scrollToBottom()
          })

          .listen('.message.updated', (e) => {
            const index = chatStore.chat.messages.data.findIndex((m) => m.id === e.message.id)
            if (index !== -1) chatStore.chat.messages.data[index] = e.message
          })

          .listen('.message.deleted', (e) => {
            if (chatStore.chat?.messages?.data) {
              chatStore.chat.messages.data = chatStore.chat.messages.data.filter(
                (m: any) => m.id !== e.messageId,
              )
            }
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

.quote-preview {
  display: flex;
  align-items: center;
  background: #f0ccaa;
  padding: 5px 10px;
  margin: 0 10px;
  border-left: 4px solid #6e2c11;
  border-radius: 4px;
  font-size: 12px;
}

.quote-content {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #6e2c11;
}

.quote-author {
  font-weight: bold;
  margin-right: 5px;
}

.quote-close {
  background: none;
  border: none;
  color: #6e2c11;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
}

.loader__wrapper {
  text-align: end;
}
</style>
