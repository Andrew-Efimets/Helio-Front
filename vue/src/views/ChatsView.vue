<template>
  <div class="chats-container">
    <button class="menu-toggle" @click="toggleSidebar">
      <span v-if="!isSidebarOpen">☰ Список чатов</span>
      <span v-else>✕ Закрыть</span>
    </button>

    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <div class="sidebar" :class="{ 'sidebar--open': isSidebarOpen }">
      <ChatsList @select-chat="isSidebarOpen = false" />
    </div>

    <div class="chat-main">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatsList from '@/components/details/chats/ChatsList.vue'
import ModalView from '@/views/ModalView.vue'
import { RouterView } from 'vue-router'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<style scoped>
.chats-container {
  display: flex;
  position: relative;
  height: calc(100vh - 80px);
  overflow: hidden;
  padding-top: 40px;
}

.sidebar {
  width: fit-content;
  flex-shrink: 0;
  transition: transform 0.5s ease;
  z-index: 100;
}

.chat-main {
  flex-grow: 1;
}

.menu-toggle {
  display: none;
}

@media screen and (max-width: 1024px) {
  .menu-toggle {
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 101;
    padding: 8px 15px;
    background: var(--items-gradient);
    color: #6e2c11;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
  }

  .sidebar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: var(--items-gradient);
    transform: translateX(-100%);
  }

  .sidebar--open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
  }
}
</style>
