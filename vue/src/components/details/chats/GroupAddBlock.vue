<template>
  <div class="add-group">
    <p class="header" @click="toggleAdd">Создать группу</p>
    <template v-if="isOpenAdd">
      <label for="title" class="label">Введите название группы</label>
      <input type="text" class="title" />
      <div class="file-input">
        <div class="small-button">Добавить аватар</div>
        <input type="file" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpenAdd = ref(false)

const toggleAdd = () => {
  isOpenAdd.value = !isOpenAdd.value
}
</script>

<style scoped>
.add-group {
  margin: 5px 0;
  padding: 5px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background: var(--items-gradient);
  box-shadow: var(--main-box-shadow);
}

.header,
.label {
  color: #6e2c11;
  font-weight: bold;
  padding: 10px 0;
}

.header {
  cursor: pointer;
}

.header:hover {
  text-decoration: underline;
}

.file-input input {
  display: none;
}
</style>
