<template>
  <div class="header__wrapper">
    <div v-if="chatStore.chat" class="header">
      <div class="main">
        <div class="image__wrapper">
          <img :src="avatarSource" alt="" class="image" />
        </div>
        <p class="title">
          {{ chatTitle }}
        </p>
        <OnlineStatusPointer v-if="companion && userStore.isUserOnline(companion.id)" />
      </div>
      <div class="participants">
        <p @click="openParticipantsList" class="participants__title">Участники</p>
        <div class="avatars__wrapper">
          <div
            v-for="participant in (chatStore.chat?.participants || []).slice(-5)"
            :key="participant.id"
            class="avatar__wrapper"
          >
            <img :src="participant.avatar" alt="avatar" class="avatar" />
          </div>
        </div>
        <div class="leave-chat" @click="isConfirmOpen = true" :disabled="isLeavingProcess">
          <p>Покинуть чат</p>
        </div>
      </div>
    </div>
    <AppTransition name="dropdown">
      <div v-if="isOpenList" class="participants-list">
        <div
          v-for="participant in [...chatStore.chat?.participants].reverse()"
          :key="participant.id"
          class="participants-list__item"
        >
          <img :src="participant.avatar" class="avatar" />
          <RouterLink :to="{ name: 'wall', params: { id: String(participant.id) } }" class="link">
            <p class="participant-name">{{ participant.name }}</p>
          </RouterLink>
        </div>
      </div>
    </AppTransition>
  </div>
  <ConfirmModal
    :is-open="isConfirmOpen"
    @close="isConfirmOpen = false"
    @confirm="handleConfirmLeave"
  >
    <p>Вы действительно хотите удалиться из чата?</p>
    <template #button__text>Да, удалиться</template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chats.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useUserStore } from '@/stores/user.ts'
import { computed, ref } from 'vue'
import OnlineStatusPointer from '@/components/details/OnlineStatusPointer.vue'
import AppTransition from '@/components/details/AppTransition.vue'
import ConfirmModal from '@/components/details/ConfirmModal.vue'
import { useRoute } from 'vue-router'

const chatStore = useChatStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const isOpenList = ref(false)
const isConfirmOpen = ref(false)
const isLeavingProcess = ref(false)

const route = useRoute()

const myId = authStore.user?.id
const chatId = route.params.chatId

const companion = computed(() => {
  if (chatStore.chat?.type === 'private') {
    return chatStore.chat?.participants?.find((p: any) => Number(p.id) !== Number(myId))
  }
  return null
})

const avatarSource = computed(() => {
  return companion.value?.avatar || chatStore.chat?.avatar || ''
})

const chatTitle = computed(() => {
  return companion.value?.name || chatStore.chat?.title || ''
})

const openParticipantsList = () => {
  isOpenList.value = !isOpenList.value
}

const handleConfirmLeave = async () => {
  isLeavingProcess.value = true
  isConfirmOpen.value = false
  await chatStore.leaveChat(chatId)
  isLeavingProcess.value = false
}
</script>

<style scoped>
.header__wrapper {
  position: relative;
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
  justify-content: space-between;
  padding: 10px;
  border-radius: 10px;
  background-color: #f9f2e7;
  box-shadow: var(--main-box-shadow);
  background: var(--items-gradient);
}

.main,
.participants {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.title {
  color: #6e2c11;
  font-size: 16px;
  font-weight: bold;
}

.participants__title {
  color: #6e2c11;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.participants__title:hover {
  text-decoration: underline;
}

.avatars__wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin: 0 10px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.avatar__wrapper {
  margin-left: -10px;
}

.participants-list {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  position: absolute;
  top: 100%;
  margin-top: 5px;
  right: 0;
  background-color: #f9f2e7;
  padding: 10px;
  border-radius: 10px;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(153, 61, 26, 0.5) transparent;
  z-index: 100;
  box-shadow: var(--main-box-shadow);
}

.participants-list::-webkit-scrollbar {
  width: 6px;
}

.participants-list__item {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.link {
  text-decoration: none;
  color: #6e2c11;
}

.link:hover {
  text-decoration: underline;
}

.leave-chat {
  color: #e99a9a;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.leave-chat:hover {
  text-decoration: underline;
}

@media screen and (max-width: 480px) {
  .header {
    flex-direction: column;
  }
}
</style>
