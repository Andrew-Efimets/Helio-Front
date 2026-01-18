<template>
  <div class="header-navbar">
    <RouterLink :to="{ name: 'register' }" class="header-navbar-link"> Регистрация</RouterLink>
    <RouterLink :to="{ name: 'login' }" class="header-navbar-link"> Вход</RouterLink>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeaderAccount',
  data() {
    return {
      info: 'Heliophone',
    }
  },
})
</script>

<style scoped>
.header-navbar {
  display: flex;
  column-gap: 10px;
  margin-right: 80px;
}

.header-navbar-link {
  text-decoration: none;
  color: #6e2c11;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}
</style>
