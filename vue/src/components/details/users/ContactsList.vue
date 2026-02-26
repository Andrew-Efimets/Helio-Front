<template>
  <div v-if="privacyError" class="error-message">{{ privacyError }}</div>
  <div v-else class="contacts">
    <div class="tabs">
      <span :class="{ active: isContact }" @click="toggleTab(true)" class="title"> Контакты </span>
      <div v-if="isMe" :class="{ active: !isContact }" @click="toggleTab(false)" class="incoming">
        <span class="title"> Заявки </span>
        <span v-if="isPendingContactCount" class="dot"></span>
      </div>
    </div>

    <AppTransition name="dropdown" mode="out-in">
      <div v-if="isLoading" class="app-loader__wrapper">
        <div class="app-loader"></div>
      </div>
      <template v-else>
        <div v-if="isContact" class="users-list">
          <div class="header-wrapper">
            <span class="title">Всего контактов ({{ userStore.users.length }})</span>
            <HeaderSearch :is-global="false" />
          </div>
          <template v-for="user in userStore.users" :key="user.id">
            <UsersListItem :user="user" />
          </template>
        </div>

        <template v-else>
          <div class="users-list__wrapper">
            <div v-if="incoming.length" class="users-list">
              <span class="title">Вас хотят добавить ({{ incoming.length }})</span>
              <template v-for="user in incoming" :key="user.id">
                <UsersListItem :user="user" />
              </template>
            </div>

            <div v-if="outgoing.length" class="users-list">
              <span class="title">Вы отправили запрос ({{ outgoing.length }})</span>
              <template v-for="user in outgoing" :key="user.id">
                <UsersListItem :user="user" />
              </template>
            </div>

            <div v-if="!incoming.length && !outgoing.length" class="title">Список заявок пуст</div>
          </div>
        </template>
      </template>
    </AppTransition>
  </div>
</template>

<script setup lang="ts">
import HeaderSearch from '@/components/header/HeaderSearch.vue'
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
const privacyError = ref<string | null>(null)

const currentStatus = computed(() => (isContact.value ? 'accepted' : 'pending'))
const authStore = useAuthStore()
const isMe = computed(() => {
  return Number(authStore.user?.id) === Number(route.params.id)
})

const isPendingContactCount = computed(() => !!authStore.user?.pending_contacts_count)

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
    await contacts.fetchContacts(route.params.id as string, currentStatus.value, route.query)
  } catch (e: any) {
    privacyError.value = e.formattedMessage || 'Доступ ограничен настройками приватности'
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
  () => route.params.id,
  (newId) => {
    if (newId && route.name === 'contacts') {
      handleFetchContacts()
    }
  },
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
  width: 100%;
  background-color: #f5ddc5;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  margin-top: 10px;
  cursor: pointer;
}

.title {
  color: #6e2c11;
  font-weight: bold;
  padding: 10px 20px;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 20px;
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

.incoming {
  display: flex;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e99a9a;
  z-index: 3;
  margin-right: 20px;
}
</style>
