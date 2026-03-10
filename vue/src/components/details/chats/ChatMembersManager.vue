<template>
  <div class="manager">
    <p class="title">{{ isAddMode ? 'Добавить в группу' : 'Удалить из группы' }}</p>
    <HeaderSearch class="search" />
    <div v-if="isLoading" class="app-loader"></div>
    <div v-if="users.length > 0" class="list">
      <div v-for="user in users" :key="user.id" class="user-item">
        <div class="user-info">
          <img :src="user.avatar" class="mini-avatar" />
          <span class="text">{{ user.name }}</span>
        </div>
        <button
          @click="handleManage(user.id)"
          class="small-button"
          :class="{ 'button--danger': !isAddMode }"
          :disable="isLoading"
        >
          {{ isAddMode ? 'Добавить' : 'Удалить' }}
        </button>
      </div>
    </div>

    <p v-else-if="!isLoading" class="empty-msg">
      {{ isAddMode ? 'Все ваши друзья уже здесь' : 'В группе больше никого нет' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useContacts } from '@/composables/useContacts.ts'
import { useChatStore } from '@/stores/chats.ts'
import { useAuthStore } from '@/stores/auth.ts'
import HeaderSearch from '@/components/header/HeaderSearch.vue'

const props = defineProps<{
  chatId: string
  action: 'add-member' | 'delete-member'
}>()

const chatStore = useChatStore()
const contacts = useContacts()
const authStore = useAuthStore()
const isLoading = ref(false)

const myContacts = ref<any[]>([])
const isAddMode = computed(() => props.action === 'add-member')

onMounted(async () => {
  if (isAddMode.value && authStore.user?.id) {
    isLoading.value = true
    const response = await contacts.fetchContacts(authStore.user.id, 'accepted')
    myContacts.value = response || []
    isLoading.value = false
  }
})

const users = computed(() => {
  if (isAddMode.value) {
    const participantIds = chatStore.chat?.participants?.map((p: any) => p.id) || []
    return myContacts.value.filter((contact) => !participantIds.includes(contact.id))
  }
  return chatStore.chat?.participants?.filter((p: any) => p.id !== authStore.user?.id) || []
})

const handleManage = async (userId: number) => {
  isLoading.value = true
  if (isAddMode.value) {
    await chatStore.addMember(props.chatId, userId)
  } else {
    await chatStore.deleteMember(props.chatId, userId)
  }
  isLoading.value = false
}
</script>

<style scoped>
.manager {
  margin: 20px;
}

.mini-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 20px;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
}

.text {
  color: #6e2c11;
  font-size: 16px;
  font-weight: bold;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #6e2c11;
  margin-bottom: 20px;
}

.empty-msg {
  color: #6e2c11;
}

.search {
  width: 100%;
  margin-bottom: 10px;
}

@media screen and (max-width: 768px) {
  .small-button {
    scale: 0.7;
  }

  .text {
    font-size: 12px;
  }
}
</style>
