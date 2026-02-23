<template>
  <div class="avatar">
    <div class="container">
      <div v-if="isLoading || !user?.avatar" class="wrapper">
        <div class="empty"></div>
      </div>
      <div v-else class="wrapper">
        <RouterLink :to="{ name: 'wall' }">
          <img :src="user.avatar" alt="аватар" class="img" />
        </RouterLink>
      </div>
      <template v-if="user && user.id !== authStore.user?.id">
        <button
          v-if="!user.contact_status"
          class="button"
          @click="handleToggle"
          :disabled="isAddition"
        >
          Добавить в контакты
        </button>

        <template v-else>
          <button
            v-if="user.contact_status.type === 'accepted'"
            class="button button--danger"
            @click="isConfirmOpen = true"
            :disabled="isAddition"
          >
            Удалить из контактов
          </button>

          <template v-else-if="user.contact_status.type === 'pending'">
            <template v-if="user.contact_status.is_sender">
              <button class="button" @click="handleAccept" :disabled="isAddition">
                Принять заявку
              </button>
              <button class="button button--danger" @click="handleToggle" :disabled="isAddition">
                Отклонить заявку
              </button>
            </template>

            <button
              v-else
              class="button button--danger"
              @click="handleToggle"
              :disabled="isAddition"
            >
              Отменить запрос
            </button>
          </template>
        </template>
      </template>
    </div>
    <div v-if="user && user.id !== authStore.user?.id" class="menu">
      <div v-for="link in menuLinks" :key="link.name" class="list">
        <RouterLink :to="{ name: link.name }" class="item">
          {{ link.label }}
          <template v-if="Number(props.user[link.count]) > 0">
            ({{ props.user[link.count] }})
          </template>
        </RouterLink>
      </div>
    </div>
    <ConfirmModal :is-open="isConfirmOpen" @close="isConfirmOpen = false" @confirm="handleToggle">
      <p>Вы действительно хотите удалить контакт?</p>
      <template #button__text>Да, удалить</template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { useContacts } from '@/composables/useContacts'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import ConfirmModal from '@/components/details/ConfirmModal.vue'

const menuLinks = [
  { name: 'photos', label: 'Фотографии', count: 'photos_count' },
  { name: 'videos', label: 'Видеозаписи', count: 'videos_count' },
  { name: 'contacts', label: 'Контакты', count: 'contacts_count' },
]

const props = defineProps<{
  user: any
  isLoading: boolean
}>()

const isConfirmOpen = ref(false)
const emit = defineEmits(['update-user', 'refresh-account'])
const authStore = useAuthStore()
const userStore = useUserStore()

const { isAddition, toggleContact, acceptContact } = useContacts()
const handleToggle = async () => {
  isConfirmOpen.value = false
  const data = await toggleContact(props.user.id)
  if (data) {
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
    emit('update-user', {
      ...props.user,
      contact_status: data.contact_status,
      contacts_count: data.contacts_count,
    })
    userStore.triggerRefresh()
  }
}
</script>

<style scoped>
.avatar {
  flex-shrink: 0;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px;
  padding: 20px;
  background-color: #f5ddc5;
}

.wrapper {
  width: 200px;
  height: 250px;
}

.empty {
  background-color: #957f6f;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: #6e2c11 2px solid;
  box-shadow: 0 0 15px 5px rgba(190, 127, 25, 0.5);
}

.menu {
  display: flex;
  flex-direction: column;
  margin: 40px;
  padding: 20px;
  background-color: #f5ddc5;
}

.list {
  padding: 10px 0;
}

.item {
  font-size: 18px;
  font-weight: 500;
  color: #6e2c11;
  text-decoration: none;
  box-shadow: 0 2px 0 0 rgba(190, 127, 25, 0.2);
}
</style>
