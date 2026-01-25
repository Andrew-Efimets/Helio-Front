<template>
  <div class="privacy-options">
    <label class="privacy-option">
      <input type="radio" :name="name" v-model="model" value="all" class="privacy-option__radio" />
      <span class="privacy-option__text">Все</span>
    </label>
    <label class="privacy-option">
      <input
        type="radio"
        :name="name"
        v-model="model"
        value="contacts"
        class="privacy-option__radio"
      />
      <span class="privacy-option__text">Контакты</span>
    </label>
    <label class="privacy-option">
      <input type="radio" :name="name" v-model="model" value="none" class="privacy-option__radio" />
      <span class="privacy-option__text">Никто</span>
    </label>
  </div>
</template>

<script setup lang="ts">
const model = defineModel()

defineProps<{
  name: string
}>()
</script>

<style scoped>
@import '@/assets/css/settings/privacy-choice.css';
</style>
