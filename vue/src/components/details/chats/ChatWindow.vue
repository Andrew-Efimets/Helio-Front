<template>
  <div class="chat">
    <ChatHeader />
    <div class="plate">
      <div class="messages__wrapper" ref="messagesWrapper" @scroll="handleScroll">
        <div v-if="messageStore.isLoading" class="app-loader"></div>
        <div v-for="group in groupedMessages" :key="group.date" class="group-container">
          <div class="date-separator">
            <span class="date">{{ group.date }}</span>
          </div>
          <div v-for="message in group.messages" :key="message.id">
            <ChatsMessageItem :message="message" />
          </div>
        </div>
      </div>
      <div v-if="messageStore.replyTo" class="quote-preview">
        <div class="quote-content">
          <span class="quote-author">{{ messageStore.replyTo.user?.name }}:</span>
          <span class="quote-text">{{ messageStore.replyTo.content }}</span>
        </div>
        <button class="quote-close" @click="messageStore.clearReply">×</button>
      </div>
      <div v-if="messageStore.editingMessage" class="quote-preview edit-mode">
        <div class="quote-content">
          <span class="quote-author">Редактирование:</span>
          <span class="quote-text">{{ messageStore.editingMessage.content }}</span>
        </div>
        <button class="quote-close" @click="cancelEdit">×</button>
      </div>
      <MessageInput
        v-model="messageText"
        :is-editing="!!messageStore.editingMessage"
        @send="saveMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chats.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { ref, onUnmounted, nextTick, computed } from 'vue'
import ChatHeader from '@/components/details/chats/ChatHeader.vue'
import ChatsMessageItem from '@/components/details/chats/ChatsMessageItem.vue'
import MessageInput from '@/components/details/MessageInput.vue'
import { useNotificationStore } from '@/stores/notifications.ts'
import { useMessageStore } from '@/stores/messages.ts'

const chatStore = useChatStore()
const route = useRoute()
const authStore = useAuthStore()
const messageText = ref('')
const notify = useNotificationStore()
const messagesWrapper = ref<HTMLElement | null>(null)
const messageStore = useMessageStore()

const groupedMessages = computed(() => {
  const groups: { date: string; messages: any[] }[] = []

  messageStore.messages.forEach((message) => {
    const date = new Date(message.created_at)
    const today = new Date().setHours(0, 0, 0, 0)
    const messageDate = new Date(date).setHours(0, 0, 0, 0)

    let dateText = ''

    if (messageDate === today) {
      dateText = 'Сегодня'
    } else {
      dateText = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
      }).format(date)
    }

    let group = groups.find((g) => g.date === dateText)
    if (!group) {
      group = { date: dateText, messages: [] }
      groups.push(group)
    }
    group.messages.push(message)
  })

  return groups
})

const saveMessage = async (text: string) => {
  if (!text.trim()) return

  try {
    if (messageStore.editingMessage) {
      await messageStore.updateMessage(messageStore.editingMessage.id, text, chatStore.chat.id)
      messageStore.clearEdit()
    } else {
      await messageStore.addMessage(text, chatStore.chat.id)
      scrollToBottom()
    }
    messageText.value = ''
  } catch (error) {
    notify.show('Не удалось отправить сообщение', 'error')
  }
}

const cancelEdit = () => {
  messageStore.clearEdit()
  messageText.value = ''
}

const handleScroll = async () => {
  const el = messagesWrapper.value
  if (!el) return
  if (el.scrollTop < 1 && !chatStore.isLoading) {
    const oldHeight = el.scrollHeight

    await messageStore.loadPreviousMessages(route.params.chatId as string)

    nextTick(() => {
      el.scrollTop = el.scrollHeight - oldHeight
    })
  }
}

const scrollToBottom = () => {
  if (!messagesWrapper.value) return

  const el = messagesWrapper.value
  requestAnimationFrame(() => {
    el.scrollTo({
      top: el.scrollHeight + 100,
      behavior: 'auto',
    })
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
            messageStore.addEchoMessage(e.message)
            scrollToBottom()
          })

          .listen('.message.updated', (e) => {
            messageStore.updateEchoMessage(e.message)
          })

          .listen('.message.deleted', (e) => {
            messageStore.deleteEchoMessage(e.messageId)
          })
      })
    }
  },
  { immediate: true },
)

watch(
  () => messageStore.editingMessage,
  (newMessage) => {
    if (newMessage) {
      messageText.value = newMessage.content
      messageStore.clearReply()
    }
  },
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
  overflow: hidden;
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
  flex: 1;
  height: 100%;
  overflow-y: auto;
  display: block;
  padding: 20px 0;
  margin: 0;
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

.date-separator {
  position: sticky;
  top: 5px;
  z-index: 10;
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.date {
  background-color: rgba(206, 195, 186, 0.25);
  color: #6e2c11;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
}
</style>
