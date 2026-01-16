<template>
  <div>
    <input
      type="tel"
      placeholder="+7 (900) 000-00-00"
      pattern="^(\+7|8)[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$"
      required
    />
    <input type="password" name="" id="" placeholder="Пароль" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginView',
})
</script>

<style scoped></style>
