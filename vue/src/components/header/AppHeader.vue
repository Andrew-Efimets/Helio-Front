<template>
  <div class="header">
    <div class="wrapper">
      <HeaderTitle />
      <HeaderSearch />
      <HeaderNavbar />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderTitle from '@/components/header/HeaderTitle.vue'
import HeaderSearch from '@/components/header/HeaderSearch.vue'
import HeaderNavbar from '@/components/header/HeaderNavbar.vue'
</script>

<style scoped>
.header {
  background-color: #c99d7f;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.wrapper {
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  column-gap: 40px;
  align-items: center;
  margin: 0 auto;
  padding: 10px;
}

@media screen and (max-width: 1024px) {
  .wrapper {
    flex-direction: column;
    row-gap: 20px;
    text-align: center;
  }
}
</style>
