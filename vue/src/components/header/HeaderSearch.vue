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
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')

const props = defineProps<{
  isGlobal?: boolean
}>()
const handleSearch = () => {
  if (props.isGlobal) {
    router.push({
      name: 'users',
      query: { search: searchQuery.value },
    })
  } else {
    router.push({
      name: route.name as string,
      params: route.params,
      query: { search: searchQuery.value },
    })
  }
  searchQuery.value = ''
}
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
  background-color: #e6bda9;
}

.input:focus {
  outline: none;
  border: 2px solid #be7f19;
  box-shadow: 0 0 5px rgba(190, 127, 25, 0.5);
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
