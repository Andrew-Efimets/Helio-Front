<template>
  <div class="header-search">
    <input type="text" class="header-search-input" placeholder="Поиск" />
    <div class="search-icon-wrapper">
      <p class="separator">|</p>
      <RouterLink :to="{ name: 'account-search' }" class="search-link">
        <img src="../../assets/search.png" alt="поиск" class="search-icon" />
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeaderSearch',
  data() {
    return {
      info: 'Heliophone',
    }
  },
})
</script>

<style scoped>
.header-search {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: end;
  width: 30%;
  position: relative;
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

.search-icon-wrapper {
  display: flex;
  justify-content: end;
  align-items: center;
  column-gap: 5px;
  position: absolute;
  margin-right: 10px;
}

.separator {
  position: relative;
  top: -2px;
  font-size: 22px;
  font-weight: 700;
  color: gray;
}

.search-link {
  width: 35%;
}

.search-icon {
  display: block;
  width: 100%;
}
</style>
