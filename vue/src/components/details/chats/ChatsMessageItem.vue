<template>
  <div class="chat-message" @click.right.prevent="openEditor">
    <div :class="{ active: isOpenEditor }" class="message">
      <div :class="myMessage ? 'send' : 'get'">
        <div v-if="message.parent_id" class="reply-quote">
          <div class="quote-header">
            <img :src="message.parent_user_avatar" class="quote-avatar" />
            <span class="quote-author">{{ message.parent_user_name }}</span>
          </div>
          <p class="quote-text">{{ message.parent_content }}</p>
        </div>
        <div class="content">
          <p class="text">
            {{ message?.content }}
          </p>
          <p class="time">
            {{ messageTime }}
          </p>
        </div>
      </div>
    </div>
    <AppTransition name="dropdown">
      <div v-if="isOpenEditor" class="editor">
        <p class="editor__link" @click.prevent="messageStore.setReply(message)">Цитировать</p>
        <p class="editor__link" @click.prevent="messageStore.setForward(message)">Переслать</p>
        <p v-if="myMessage" class="editor__link" @click="messageStore.setEdit(message)">
          Редактировать
        </p>
        <p v-if="myMessage" class="editor__link danger" @click="isConfirmOpen = true">Удалить</p>
      </div>
    </AppTransition>
  </div>
  <ConfirmModal
    :is-open="isConfirmOpen"
    @close="isConfirmOpen = false"
    @confirm="handleDeleteMessage"
  >
    <p>Вы действительно хотите удалить сообщение?</p>
    <template #button__text>Да, удалить</template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chats.ts'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useNotificationStore } from '@/stores/notifications.ts'
import ConfirmModal from '@/components/details/ConfirmModal.vue'
import AppTransition from '@/components/details/AppTransition.vue'
import { useMessageStore } from '@/stores/messages.ts'

const props = defineProps<{
  message: any
}>()

const isConfirmOpen = ref(false)
const chatStore = useChatStore()
const authStore = useAuthStore()
const messageStore = useMessageStore()
const notify = useNotificationStore()
const isOpenEditor = ref(false)
const menuPosition = ref({ x: 0, y: 0 })
const menuTop = computed(() => `${menuPosition.value.y}px`)
const menuLeft = computed(() => `${menuPosition.value.x}px`)

const myMessage = computed(() => {
  return Number(authStore.user?.id) === Number(props.message.user_id)
})

const messageTime = computed(() => {
  const date = new Date(props.message?.created_at)
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return time
})

const openEditor = (event: MouseEvent) => {
  event.stopPropagation()

  window.dispatchEvent(new CustomEvent('close-all-editors'))

  let x = event.clientX
  let y = event.clientY
  if (x + 140 > window.innerWidth) {
    x = x - 140
  }
  if (y + 50 > window.innerHeight) {
    y = y - 50
  }
  menuPosition.value = { x, y }

  isOpenEditor.value = true
}

const closeMenu = () => {
  isOpenEditor.value = false
}

const handleDeleteMessage = async () => {
  try {
    isConfirmOpen.value = false
    await messageStore.deleteMessage(props.message.id, chatStore.chat.id)
    isOpenEditor.value = false
  } catch (e) {
    notify.show('Не удалось удалить сообщение', 'error')
  }
}

onMounted(() => {
  window.addEventListener('click', closeMenu)
  window.addEventListener('scroll', closeMenu, true)
  window.addEventListener('contextmenu', closeMenu)
  window.addEventListener('close-all-editors', closeMenu)
})

onUnmounted(() => {
  window.removeEventListener('click', closeMenu)
  window.removeEventListener('scroll', closeMenu, true)
  window.removeEventListener('contextmenu', closeMenu)
  window.removeEventListener('close-all-editors', closeMenu)
})
</script>

<style scoped>
.chat-message {
  position: relative;
}

.message {
  display: flex;
  flex-direction: column;
  padding: 0 25px;
  width: 100%;
  box-sizing: border-box;
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

.active {
  background-color: rgba(206, 195, 186, 0.25);
}

.editor {
  position: fixed;
  z-index: 999;
  background-color: #f7e4d2;
  border-radius: 10px;
  width: fit-content;
  box-shadow: var(--main-box-shadow);
  top: v-bind(menuTop);
  left: v-bind(menuLeft);
}

.editor__link {
  color: #6e2c11;
  font-size: 14px;
  font-weight: bold;
  padding: 5px 10px;
  cursor: pointer;
}

.danger {
  color: #e99a9a;
}

.editor__link:hover {
  background-color: rgba(206, 195, 186, 0.25);
}

.reply-quote {
  background-color: rgba(206, 195, 186, 0.25);
  border-left: 3px solid #6e2c11;
  padding: 4px 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 12px;
  max-width: 100%;
}

.quote-header {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.quote-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.quote-author {
  color: #6e2c11;
  font-size: 12px;
  font-weight: bold;
}

.quote-text {
  color: #6e2c11;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-style: italic;
}

.content {
  display: flex;
  flex-direction: column;
}

.time {
  border-radius: 10px;
  font-size: 12px;
  width: fit-content;
  padding: 5px 0;
  align-self: end;
  color: #999;
}
</style>
