<template>
  <div class="header__wrapper">
    <div v-if="chatStore.chat" class="header">
      <div class="main">
        <div class="image__wrapper">
          <img v-if="avatarSource" :src="avatarSource" alt="" class="image" />
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
        <span class="menu-burger" @click="toggleMenu">☰</span>
        <AppTransition name="dropdown">
          <div v-if="isOpenMenu" class="chat-menu" :disabled="isLeavingProcess">
            <template v-if="chatStore.chat?.type === 'group'">
              <p class="menu-item" @click="openMemberManager('add-member')">Добавить участника</p>
              <template v-if="isAdmin">
                <p class="menu-item" @click="openMemberManager('delete-member')">
                  Удалить участника
                </p>
                <p class="menu-item" @click.stop="startEditing">Редактировать группу</p>
              </template>
              <p class="menu-item delete" @click="((isConfirmOpen = true), (isOpenMenu = false))">
                {{ isAdmin ? 'Удалить группу' : 'Покинуть группу' }}
              </p>
            </template>
            <div v-else>
              <p class="menu-item delete" @click="isConfirmOpen = true">Покинуть чат</p>
            </div>
          </div>
        </AppTransition>
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
    <template v-if="chatStore.chat?.type === 'group'">
      <p v-if="isAdmin">Вы действительно хотите удалить группу?</p>
      <p v-else>Вы действительно хотите покинуть группу?</p>
    </template>
    <p v-else>Вы действительно хотите удалиться из чата?</p>
    <template #button__text>Да</template>
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
import ModalView from '@/views/ModalView.vue'
import AddMemberForm from '@/components/details/chats/ChatMembersManager.vue'
import { useRoute, useRouter } from 'vue-router'

const chatStore = useChatStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()
const isOpenList = ref(false)
const isOpenMenu = ref(false)
const isConfirmOpen = ref(false)
const isLeavingProcess = ref(false)

const route = useRoute()

const myId = authStore.user?.id
const chatId = route.params.chatId

const isAdmin = computed(() => {
  if (chatStore.chat?.type !== 'group') return false

  const me = chatStore.chat?.participants?.find((p: any) => Number(p.id) === Number(myId))

  return me?.role === 'admin'
})

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

const startEditing = () => {
  chatStore.startEdit(chatStore.chat)
  isOpenMenu.value = false
}

const openParticipantsList = () => {
  isOpenList.value = !isOpenList.value
}

const toggleMenu = () => {
  isOpenMenu.value = !isOpenMenu.value
}

const handleConfirmLeave = async () => {
  isLeavingProcess.value = true
  isConfirmOpen.value = false
  await chatStore.leaveChat(route.params.chatId)
  isLeavingProcess.value = false
}

const openMemberManager = (action: 'add-member' | 'delete-member') => {
  isOpenMenu.value = false
  router.push({
    name: 'chat-manager',
    params: {
      chatId: route.params.chatId,
      action,
    },
  })
}
</script>

<style scoped>
.header__wrapper {
  position: relative;
}

.image {
  width: 40px;
  height: 40px;
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

.chat-menu {
  position: absolute;
  top: 100%;
  right: 20px;
  background-color: #f9f2e7;
  padding: 10px;
  border-radius: 10px;
  box-shadow: var(--main-box-shadow);
  white-space: nowrap;
  z-index: 200;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.menu-item {
  color: #6e2c11;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.chat-menu p:hover {
  text-decoration: underline;
}

.delete {
  color: #e99a9a;
}

.menu-burger {
  color: #6e2c11;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

@media screen and (max-width: 480px) {
  .header {
    flex-direction: column;
  }
}
</style>
