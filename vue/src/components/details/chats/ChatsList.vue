<template>
  <div class="chats-list">
    <div class="header">
      <p :class="{ active: !isGroupe }" @click="toggleTab(false)" class="header__link">Чаты</p>
      <p :class="{ active: isGroupe }" @click="toggleTab(true)" class="header__link">Группы</p>
    </div>
    <div v-for="chat in chatStore?.allChats" :key="chat.id" class="list__wrapper">
      <div class="list__item">
        <div class="main">
          <div class="image__wrapper">
            <img :src="getChatData(chat).avatar" alt="" class="image" />
          </div>
          <RouterLink :to="{ name: 'chat', params: { chatId: chat.id } }" class="link">
            <p class="title">
              {{ getChatData(chat).title }}
            </p>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/chats.ts'
import { useAuthStore } from '@/stores/auth.ts'

const isGroupe = ref(false)
const chatStore = useChatStore()
const chatAvatar = ref<any>()
const chatTitle = ref<any>()
const authStore = useAuthStore()

const chatType = computed(() => (isGroupe.value ? 'groupe' : 'private'))

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
    avatar: chat.avatar_url,
  }
}

const toggleTab = (value: boolean) => {
  isGroupe.value = value
  handleFetchChats()
}

const handleFetchChats = async () => {
  try {
    const response = await chatStore.fetchAllChats(chatType.value)
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
.chats-list {
  max-width: 400px;
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
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}
</style>
