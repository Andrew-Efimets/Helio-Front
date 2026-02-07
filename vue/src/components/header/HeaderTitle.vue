<template>
  <div class="title">
    <RouterLink :to="{ name: 'home' }" class="link">
      <img alt="Vue logo" class="logo" src="../../assets/heliologo.png" width="64" height="64" />
    </RouterLink>
    <RouterLink :to="{ name: 'home' }" class="link">
      <h3>{{ info }}</h3>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const info = ref('Heliophone')
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

.link {
  text-decoration: none;
  cursor: pointer;
}
</style>
