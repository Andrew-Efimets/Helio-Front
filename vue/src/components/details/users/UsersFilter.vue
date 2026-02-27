<template>
  <div class="filter">
    <div class="header">
      <p class="title">Фильтр</p>
      <div class="burger__wrapper" @click="openFilter">
        <img src="@/assets/burger.png" alt="burger" class="burger" />
      </div>
    </div>
    <AppTransition name="dropdown">
      <div v-if="isOpen" class="wrapper">
        <UsersFilterInput
          v-model="filters.country"
          type="text"
          label="Страна"
          placeholder="Беларусь"
        />
        <UsersFilterInput v-model="filters.city" type="text" label="Город" placeholder="Минск" />
        <UsersFilterInput
          v-model.number="filters.age_from"
          type="number"
          label="Возраст от"
          placeholder="18"
        />
        <UsersFilterInput
          v-model.number="filters.age_to"
          type="number"
          label="до"
          placeholder="99"
        />
        <div class="sort-group">
          <label class="sort-label">Сортировка</label>
          <select v-model="filters.sort" class="select">
            <option value="asc">Имя (А-Я)</option>
            <option value="desc">Имя (Я-А)</option>
          </select>
        </div>
        <button class="small-button" @click="applyFilters">Применить</button>
        <button class="small-button" @click="resetFilters">Сбросить</button>
      </div>
    </AppTransition>
  </div>
</template>

<script setup lang="ts">
import AppTransition from '@/components/details/AppTransition.vue'
import UsersFilterInput from './UsersFilterInput.vue'
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const isOpen = ref(false)
const route = useRoute()
const router = useRouter()

const filters = reactive({
  country: String(route.query.country || ''),
  city: String(route.query.city || ''),

  age_from: route.query.age_from ? Number(route.query.age_from) : '',
  age_to: route.query.age_to ? Number(route.query.age_to) : '',

  search: String(route.query.search || ''),
  sort: route.query.sort || 'asc',
})

const applyFilters = () => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== '' && value !== null),
  )

  router.push({
    name: route.name,
    params: route.params,
    query: cleanFilters,
  })
  isOpen.value = false
}

const resetFilters = () => {
  filters.country = ''
  filters.city = ''
  filters.age_from = ''
  filters.age_to = ''
  filters.sort = 'asc'

  router.push({
    name: route.name,
    params: route.params,
    query: {},
  })

  isOpen.value = false
}

const openFilter = () => {
  isOpen.value = !isOpen.value
}

watch(
  () => route.query,
  (newQuery) => {
    filters.country = String(newQuery.country || '')
    filters.city = String(newQuery.city || '')
    filters.age_from = newQuery.age_from ? Number(newQuery.age_from) : ''
    filters.age_to = newQuery.age_to ? Number(newQuery.age_to) : ''
    filters.sort = String(newQuery.sort || 'asc')
    filters.search = String(newQuery.search || '')
  },
  { deep: true },
)
</script>

<style scoped>
.filter {
  display: flex;
  margin: 20px;
  padding: 0;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  height: fit-content;
  column-gap: 20px;
  margin-right: 10px;
}

.title {
  color: #6e2c11;
  font-size: 1rem;
  font-weight: bold;
}

.wrapper {
  width: fit-content;
  padding: 20px;
  border-radius: 10px;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  z-index: 2000;
  background-color: #f7e4d2;
  box-shadow: var(--main-box-shadow);
  position: absolute;
  left: 140px;
}

.sort-group {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.sort-label {
  color: #6e2c11;
  font-size: 14px;
  font-weight: bold;
  padding: 0 0 5px 10px;
}

.select {
  font-size: 14px;
  padding: 5px 0 5px 10px;
  border: #6e2c11 2px solid;
  border-radius: 18px;
  width: 150px;
}

.select:focus {
  outline: none;
  border: 2px solid #be7f19;
  box-shadow: var(--input-focus-shadow);
}

.burger__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: #f5ddc5;
  border-radius: 10px;
  z-index: 100;
  box-shadow: var(--main-box-shadow);
}

.burger {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>
