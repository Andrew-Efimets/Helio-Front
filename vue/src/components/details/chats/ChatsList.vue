<template>
  <div class="chats-list">
    <div v-if="messageStore.forwardingMessage" class="forward-banner">
      <p>Выберите чат</p>
      <button @click.stop="messageStore.clearForward">Отмена</button>
    </div>
    <div class="header">
      <p :class="{ active: !isGroupe }" @click="toggleTab(false)" class="header__link">Чаты</p>
      <p :class="{ active: isGroupe }" @click="toggleTab(true)" class="header__link">Группы</p>
    </div>
    <div class="list__wrapper">
      <GroupAddBlock :initial-chat="chatStore.editingGroup" v-if="isGroupe" />
      <AppTransition name="dropdown" mode="out-in">
        <div v-if="chatStore.isListLoading" class="app-loader" key="loader"></div>
        <span v-else-if="!displayChats.length" class="empty-list" key="empty"> Список пуст </span>
        <div v-else class="list-container">
          <div
            v-for="chat in displayChats"
            :key="chat.id"
            class="list__item"
            @click="selectChat(chat.id)"
          >
            <div class="main">
              <div class="image__wrapper">
                <img
                  v-if="getChatData(chat).avatar"
                  :src="getChatData(chat).avatar"
                  alt="image"
                  class="image"
                />
              </div>
              <div class="link">
                <p class="title">{{ getChatData(chat).title }}</p>
              </div>
              <span v-if="chat.unread_count > 0" class="badge"> + {{ chat.unread_count }} </span>
            </div>
          </div>
        </div>
      </AppTransition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chats.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useMessageStore } from '@/stores/messages.ts'
import GroupAddBlock from '@/components/details/chats/GroupAddBlock.vue'
import AppTransition from '@/components/details/AppTransition.vue'

const isGroupe = ref(false)
const chatStore = useChatStore()
const authStore = useAuthStore()
const messageStore = useMessageStore()
const router = useRouter()

const chatType = computed(() => (isGroupe.value ? 'group' : 'private'))

const displayChats = computed(() => {
  if (!chatStore.allChats) return []
  return chatStore.allChats.filter((c) => c.type === chatType.value)
})

const emit = defineEmits(['select-chat'])

const selectChat = async (chatId: number) => {
  emit('select-chat')
  if (messageStore.forwardingMessage) {
    messageStore.setReply(messageStore.forwardingMessage)
    messageStore.clearForward()
    router.push({ name: 'chat', params: { chatId } })
  } else {
    messageStore.clearReply()
    messageStore.clearEdit()
    router.push({ name: 'chat', params: { chatId } })
  }
}

const getChatData = (chat: any) => {
  if (chat.type === 'private') {
    const companion = chat.users?.find((u: any) => Number(u.id) !== Number(authStore.user?.id))
    return {
      title: companion?.name || 'Пользователь',
      avatar: companion?.active_avatar?.avatar_url,
    }
  }
  return {
    title: chat.title || 'Групповой чат',
    avatar: chat.avatar,
  }
}

const toggleTab = (value: boolean) => {
  isGroupe.value = value
}

watch(
  () => chatStore.editingGroup,
  (newChat) => {
    if (newChat) isGroupe.value = true
  },
)
</script>

<style scoped>
.chats-list {
  max-width: 500px;
  min-width: 300px;
  width: fit-content;
  background-color: #f5ddc5;
  padding: 10px;
  margin: 0 10px;
}

.header {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header__link {
  color: #6e2c11;
  font-weight: bold;
  padding: 10px 20px;
}

.active {
  background-color: #f0ccaa;
}

.list__wrapper {
  background-color: #f0ccaa;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.main {
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding: 10px;
  background-color: #f9f2e7;
  box-shadow: var(--main-box-shadow);
  background: var(--items-gradient);
  border-radius: 10px;
  margin-top: 10px;
}

.image {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.link {
  text-decoration: none;
  color: #6e2c11;
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
}

.empty-list {
  color: #6e2c11;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
}

.link:hover {
  text-decoration: underline;
}

.list__item {
  cursor: pointer;
}

.forward-banner {
  background-color: #f0ccaa;
  color: #6e2c11;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}

.forward-banner button {
  background: var(--items-gradient);
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  color: #6e2c11;
  font-weight: bold;
}

@media screen and (max-width: 1024px) {
  .chats-list {
    padding-top: 40px;
  }

  .header {
    margin-top: 10px;
  }
}
</style>
