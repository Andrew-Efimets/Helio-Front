<template>
  <nav v-if="authStore.user?.id" class="menu">
    <div class="menu__wrapper">
      <div class="burger__wrapper" @click="openMenu">
        <img src="@/assets/burger.png" alt="burger" class="burger" />
      </div>
      <ul
        class="links__wrapper"
        :class="{ 'links__wrapper--open': isOpen }"
        @click="isOpen = false"
      >
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
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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

const isOpen = ref(false)
const openMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.menu {
  white-space: nowrap;
  padding: 40px 0 0 40px;
}

.menu__wrapper {
  display: flex;
}

.burger__wrapper {
  display: none;
}

.burger {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.links__wrapper {
  width: 100%;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.links__wrapper .item:has(.router-link-exact-active) {
  background-color: #f0ccaa;
}

.links__wrapper .item:hover:not(:has(.router-link-exact-active)) {
  background-color: #ead7c3;
}

.links__wrapper .settings:has(.router-link-active) {
  background-color: #f0ccaa;
}

.links__wrapper .settings:hover:not(:has(.router-link-active)) {
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
  .menu {
    margin: 20px 20px 40px 40px;
    width: fit-content;
    padding: 0;
  }

  .burger__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 50px;
    height: 50px;
    background-color: #f5ddc5;
    border-radius: 10px;
    z-index: 100;
    box-shadow: 0 4px 15px rgba(110, 44, 17, 0.2);
  }

  .links__wrapper {
    display: none;
    flex-direction: column;
    width: fit-content;
    position: fixed;
    padding: 10px;
    border-radius: 10px;
    left: 100px;
    z-index: 80;
    background-color: #f5ddc5;
    box-shadow: 0 4px 15px rgba(110, 44, 17, 0.2);
  }

  .links__wrapper--open {
    display: flex;
  }

  .link {
    font-size: 18px;
  }

  .separator {
    display: block;
  }
}

@media screen and (max-width: 768px) {
  .menu {
    margin-left: 20px;
  }

  .links__wrapper {
    left: 80px;
  }
}
</style>
