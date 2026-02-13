<template>
  <nav v-if="authStore.user?.id" class="menu">
    <ul class="wrapper">
      <li v-for="item in menuItems" :key="item.name" class="item">
        <RouterLink class="link" :to="{ name: item.name, params: { id: myId } }">
          <div class="link-content">
            {{ item.label }}

            <span v-if="item.countKey && (authStore.user as any)?.[item.countKey]" class="badge">
              {{ item.countKey === 'pending_contacts_count' ? '+' : '' }}
              {{ (authStore.user as any)[item.countKey] }}
            </span>
          </div>
        </RouterLink>
      </li>

      <li class="separator"></li>

      <li class="settings">
        <RouterLink class="link" :to="{ name: 'settings', params: { id: myId } }">
          Настройки профиля
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const authStore = useAuthStore()

const myId = computed(() => authStore.user?.id)

const menuItems = [
  { name: 'wall', label: 'Мой аккаунт' },
  { name: 'chats', label: 'Чаты', countKey: 'unread_messages_count' },
  { name: 'contacts', label: 'Контакты', countKey: 'pending_contacts_count' },
  { name: 'photos', label: 'Мои фотографии' },
  { name: 'videos', label: 'Мои видеозаписи' },
]
</script>

<style scoped>
.menu {
  white-space: nowrap;
  padding: 40px 0 0 40px;
}

.wrapper {
  width: 100%;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.wrapper .item:has(.router-link-exact-active) {
  background-color: #f0ccaa;
}

.wrapper .item:hover:not(:has(.router-link-exact-active)) {
  background-color: #ead7c3;
}

.wrapper .settings:has(.router-link-active) {
  background-color: #f0ccaa;
}

.wrapper .settings:hover:not(:has(.router-link-active)) {
  background-color: #ead7c3;
}

.item {
  width: 100%;
}

.link {
  padding: 10px 20px;
  display: block;
  color: #6e2c11;
  text-decoration: none;
  width: 100%;
  font-size: 18px;
  font-weight: 600;
}

.router-link-exact-active {
  color: #a34809;
  font-weight: bold;
  background-color: #f0ccaa;
}

.separator {
  margin: 20px 0;
  border-bottom: 1px solid #6e2c11;
  box-shadow: 0 0 10px 3px rgba(196, 114, 51, 0.5);
  border-radius: 5px;
}

.badge {
  font-size: 14px;
  color: #6e2c11;
  padding: 3px;
  border-radius: 5px;
  background-color: #e99a9a;
}

@media screen and (max-width: 1024px) {
  .item {
    white-space: nowrap;
    width: fit-content;
  }

  .wrapper {
    flex-direction: row;
    background-color: #f5ddc5;
  }

  .link {
    font-size: 16px;
    padding: 5px 5px;
  }

  .menu {
    padding: 40px 0;
    margin: auto;
  }

  .separator {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .item {
  }

  .wrapper {
    flex-direction: column;
  }

  .link {
    font-size: 18px;
  }

  .separator {
    display: block;
  }
}
</style>
