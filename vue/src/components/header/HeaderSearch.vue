<template>
  <div class="search">
    <input
      type="text"
      class="input"
      placeholder="Поиск"
      v-model="searchQuery"
      @keyup.enter="handleSearch"
    />
    <div class="icon-wrapper">
      <p class="separator">|</p>
      <div class="link-item" @click="handleSearch">
        <img src="@/assets/search.png" alt="поиск" class="icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { useChatStore } from '@/stores/chats.ts'
import { useUserStore } from '@/stores/user.ts'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const chatStore = useChatStore()
const userStore = useUserStore()

const props = defineProps<{
  isGlobal?: boolean
}>()

const handleSearch = () => {
  if (props.isGlobal) {
    router.push({ name: 'users', query: { search: searchQuery.value } })
    return
  }

  const query = searchQuery.value

  chatStore.searchQuery = query

  if (route.name === 'contacts') {
    userStore.searchQuery = query
  }
}

watch(searchQuery, (newVal) => {
  if (props.isGlobal) return

  chatStore.searchQuery = newVal
  if (route.name === 'contacts') {
    userStore.searchQuery = newVal
  }
})

watch(
  () => [chatStore.searchQuery, userStore.searchQuery],
  ([newChatQuery, newUserQuery]) => {
    if (!props.isGlobal) {
      if (route.name === 'chats' || route.name === 'chat' || route.name === 'chat-manager') {
        searchQuery.value = (newChatQuery as string) ?? ''
      } else if (route.name === 'contacts') {
        searchQuery.value = (newUserQuery as string) ?? ''
      }
    }
  },
)
</script>

<style scoped>
.search {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: end;
  width: 40%;
  position: relative;
}

.input {
  width: 100%;
  font-size: 16px;
  padding: 5px 50px 5px 10px;
  border: #6e2c11 2px solid;
  border-radius: 18px;
  background-color: #f5ddc5;
}

.input:focus {
  outline: none;
  border: 2px solid #be7f19;
  box-shadow: var(--input-focus-shadow);
}

.icon-wrapper {
  display: flex;
  justify-content: end;
  align-items: center;
  column-gap: 5px;
  position: absolute;
  margin-right: 10px;
}

.separator {
  font-size: 22px;
  font-weight: 700;
  color: gray;
}

.link-item {
  width: 35%;
  cursor: pointer;
}

.icon {
  display: block;
  width: 100%;
}

@media screen and (max-width: 1024px) {
  .search {
    width: 50%;
  }
}
</style>
