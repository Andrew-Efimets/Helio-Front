<template>
  <div class="user-item">
    <div class="content">
      <img v-if="user.avatar" :src="user.avatar" alt="" class="user-avatar" />
      <RouterLink :to="{ name: 'wall', params: { id: String(user.id) } }" class="link">
        <p class="user-name">{{ user.name }}</p>
      </RouterLink>
    </div>
    <div class="bottom-bar__wrapper">
      <template v-if="user && user.id !== authStore.user?.id">
        <span
          v-if="!user.contact_status"
          class="contact-button"
          @click="handleToggle"
          :disabled="isAddition"
        >
          Добавить в контакты
        </span>

        <template v-else>
          <div v-if="user.contact_status.type === 'accepted'" class="bottom-bar">
            <p class="bottom-bar__notify">Ваш контакт</p>
            <span class="contact-button" @click="toChat" :disabled="isLoading"> Написать </span>
            <span
              class="contact-button cancel-button"
              @click="isConfirmOpen = true"
              :disabled="isAddition"
            >
              Удалить из контактов
            </span>
          </div>

          <div v-else-if="user.contact_status.type === 'pending'" class="bottom-bar">
            <p class="bottom-bar__notify">В заявках</p>
            <div v-if="user.contact_status.is_sender" class="button-wrapper">
              <span class="contact-button" @click="handleAccept" :disabled="isAddition">
                Принять заявку
              </span>
              <span
                class="contact-button cancel-button"
                @click="handleToggle"
                :disabled="isAddition"
              >
                Отклонить заявку
              </span>
            </div>

            <span
              v-else
              class="contact-button cancel-button"
              @click="handleToggle"
              :disabled="isAddition"
            >
              Отменить запрос
            </span>
          </div>
        </template>
      </template>
      <ConfirmModal :is-open="isConfirmOpen" @close="isConfirmOpen = false" @confirm="handleToggle">
        <p>Вы действительно хотите удалить контакт?</p>
        <template #button__text>Да, удалить</template>
      </ConfirmModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { ref } from 'vue'
import { useContacts } from '@/composables/useContacts.ts'
import ConfirmModal from '@/components/details/ConfirmModal.vue'
import { useUserStore } from '@/stores/user.ts'

const props = defineProps<{
  user: any
}>()

const emit = defineEmits(['update-user'])
const isConfirmOpen = ref(false)
const isLoading = ref(false)
const authStore = useAuthStore()
const userStore = useUserStore()

const { isAddition, toggleContact, acceptContact } = useContacts()
const handleToggle = async () => {
  isConfirmOpen.value = false
  const data = await toggleContact(props.user.id)
  if (data) {
    syncProfileButtons(data)

    userStore.updateStatus(data.contact_status, data.contacts_count)

    emit('update-user', {
      ...props.user,
      contact_status: data.contact_status,
      contacts_count: data.contacts_count,
    })

    userStore.triggerRefresh()
  }
}

const handleAccept = async () => {
  const data = await acceptContact(props.user.id)
  if (data) {
    console.log('Ответ от сервера при принятии:', data)
    syncProfileButtons(data)

    userStore.updateStatus(data.contact_status, data.contacts_count)

    emit('update-user', {
      ...props.user,
      contact_status: data.contact_status,
      contacts_count: data.contacts_count,
    })

    userStore.triggerRefresh()
  }
}

const syncProfileButtons = (data: any) => {
  if (userStore.profile && Number(userStore.profile.id) === Number(props.user.id)) {
    userStore.updateStatus(data.contact_status, data.contacts_count)
  }
}

const toChat = async () => {
  try {
    isLoading.value = true
    const response = await fetchChat(`/user/${authStore.user?.id}/chat/${chatStore.user?.id}`)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.user-item {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  margin: 10px;
  height: fit-content;
  background-color: #f9f2e7;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.content {
  display: flex;
  column-gap: 20px;
  align-items: center;
}

.button-wrapper {
  display: flex;
  column-gap: 10px;
}

.contact-button {
  color: #d87c56;
  font-size: 12px;
  cursor: pointer;
}

.cancel-button {
  color: darkred;
  font-size: 12px;
  cursor: pointer;
}

.bottom-bar__wrapper {
  margin-left: 60px;
}

.bottom-bar {
  display: flex;
  align-items: center;
  column-gap: 20px;
}

.bottom-bar__notify {
  font-size: 12px;
  color: #6e2c11;
  font-weight: bold;
  background-color: #f0ccaa;
  padding: 5px 10px;
  border-radius: 5px;
}

.contact-button:hover,
.cancel-button:hover {
  text-decoration: underline;
}

.link {
  text-decoration: none;
  color: #6e2c11;
  font-weight: bold;
}

.link:hover {
  text-decoration: underline;
}
</style>
