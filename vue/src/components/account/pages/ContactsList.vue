<template>
  <div class="contacts">
    <div class="tabs">
      <span :class="{ active: isContact }" @click="toggleTab(true)" class="title"> Контакты </span>
      <span v-if="isMe" :class="{ active: !isContact }" @click="toggleTab(false)" class="title">
        Заявки
      </span>
    </div>

    <AppTransition name="dropdown" mode="out-in">
      <div v-if="isLoading" class="app-loader__wrapper">
        <div class="app-loader"></div>
      </div>
      <template v-else>
        <div v-if="isContact" class="users-list">
          <span class="title">Всего контактов ({{ userStore.users.length }})</span>
          <div v-for="user in userStore.users" :key="user.id" class="user-item">
            <UsersListItem :user="user" />
          </div>
          <div v-if="!userStore.users.length">Список пуст</div>
        </div>

        <template v-else>
          <div v-if="incoming.length" class="users-list">
            <span class="title">Вас хотят добавить ({{ incoming.length }})</span>
            <div v-for="user in incoming" :key="user.id" class="user-item">
              <UsersListItem :user="user" />
            </div>
          </div>
          <div v-if="outgoing.length" class="users-list">
            <span class="title">Вы отправили запрос ({{ outgoing.length }})</span>
            <div v-for="user in outgoing" :key="user.id" class="user-item">
              <UsersListItem :user="user" />
            </div>
            <div v-if="!userStore.users.length">Список пуст</div>
          </div>
        </template>
      </template>
    </AppTransition>
  </div>
</template>

<script setup lang="ts">
import UsersListItem from '@/components/details/users/UsersListItem.vue'
import AppTransition from '@/components/details/AppTransition.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useContacts } from '@/composables/useContacts.ts'
import { useUserStore } from '@/stores/user.ts'
import { useAuthStore } from '@/stores/auth.ts'

const route = useRoute()
const contacts = useContacts()
const userStore = useUserStore()
const isContact = ref(true)
const isLoading = ref(false)

const currentStatus = computed(() => (isContact.value ? 'accepted' : 'pending'))
const authStore = useAuthStore()
const isMe = computed(() => {
  return Number(authStore.user?.id) === Number(route.params.id)
})

const incoming = computed(() =>
  userStore.users.filter((u) => u.contact_status?.type === 'pending' && u.contact_status.is_sender),
)

const outgoing = computed(() =>
  userStore.users.filter(
    (u) => u.contact_status?.type === 'pending' && !u.contact_status.is_sender,
  ),
)

const handleFetchContacts = async () => {
  try {
    isLoading.value = true
    userStore.setUsers([])
    await contacts.fetchContacts(route.params.id as string, currentStatus.value)
  } catch (e) {
    console.error('Ошибка при загрузке контактов:', e)
  } finally {
    isLoading.value = false
  }
}

const toggleTab = (value: boolean) => {
  isContact.value = value
  handleFetchContacts()
}

onMounted(() => {
  handleFetchContacts()
})

watch(
  () => route.query,
  () => {
    handleFetchContacts()
  },
  { deep: true },
)

watch(
  () => userStore.refreshTicket,
  () => {
    handleFetchContacts()
  },
)
</script>

<style scoped>
.contacts {
  background-color: #f5ddc5;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.tabs {
  margin: 10px 0;
  cursor: pointer;
}

.title {
  color: #6e2c11;
  padding: 10px 20px;
}

.users-list {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  background-color: #f0ccaa;
}

.app-loader__wrapper,
.active {
  background-color: #f0ccaa;
}
</style>
