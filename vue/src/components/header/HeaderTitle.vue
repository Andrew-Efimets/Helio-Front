<template>
  <div class="title">
    <RouterLink :to="{ name: 'home' }" class="header-link">
      <img alt="Vue logo" class="logo" src="../../assets/heliologo.png" width="64" height="64" />
    </RouterLink>
    <RouterLink :to="{ name: 'home' }" class="header-link">
      <h3>{{ info }}</h3>
    </RouterLink>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeaderTitle',
  data() {
    return {
      info: 'Heliophone',
    }
  },
})
</script>

<style scoped>
.title {
  display: flex;
  align-items: center;
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
</style>
