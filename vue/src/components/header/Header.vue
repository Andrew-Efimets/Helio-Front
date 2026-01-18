<template>
  <div class="header">
    <div class="header-wrapper">
      <HeaderTitle />
      <HeaderSearch />
      <HeaderAccount />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderTitle from '@/components/header/HeaderTitle.vue'
import HeaderSearch from '@/components/header/HeaderSearch.vue'
import HeaderAccount from '@/components/header/HeaderAccount.vue'

export default defineComponent({
  name: 'Header',
  components: {
    HeaderTitle,
    HeaderSearch,
    HeaderAccount,
  },
  data() {
    return {
      info: 'Heliophone',
    }
  },
})
</script>

<style scoped>
.header {
  background-color: #c99d7f;
}

.header-wrapper {
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  column-gap: 40px;
  align-items: center;
  margin: 0 auto;
  padding: 10px;
}

@media screen and (max-width: 1024px) {
  .header {
    flex-direction: column;
    row-gap: 20px;
  }
}
</style>
