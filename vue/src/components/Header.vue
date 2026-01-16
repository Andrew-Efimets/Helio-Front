<template>
  <div class="header">
    <div class="title">
      <RouterLink :to="{ name: 'home' }" class="header-link">
        <img alt="Vue logo" class="logo" src="@/assets/heliologo.png" width="64" height="64" />
      </RouterLink>
      <RouterLink :to="{ name: 'home' }" class="header-link">
        <h3>{{ info }}</h3>
      </RouterLink>
    </div>
    <div class="header-search">
      <input type="text" class="header-search-input" placeholder="Поиск" />
    </div>
    <div class="header-navbar">
      <RouterLink :to="{ name: 'register' }" class="header-navbar-link"> Регистрация </RouterLink>
      <RouterLink :to="{ name: 'login' }" class="header-navbar-link"> Вход </RouterLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Header',
  data() {
    return {
      info: 'Heliophone',
    }
  },
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  column-gap: 40px;
  align-items: center;
  padding: 10px;
  background-color: #c99d7f;
}

.title {
  display: flex;
  align-items: center;
  margin-left: 60px;
}

.logo {
  margin: 0 10px;
}

h3 {
  color: #6e2c11;
  font-size: 26px;
  font-family: Georgia;
}

.header-link {
  text-decoration: none;
  cursor: pointer;
}

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

.header-search {
  text-align: center;
  width: 30%;
}

.header-search-input {
  width: 100%;
  font-size: 16px;
  padding: 5px 0 5px 10px;
  border: #6e2c11 2px solid;
  border-radius: 18px;
  background-color: #e6bda9;
}

.header-search-input:focus {
  outline: none;
  border: 2px solid #be7f19;
  box-shadow: 0 0 5px rgba(190, 127, 25, 0.5);
}
</style>
