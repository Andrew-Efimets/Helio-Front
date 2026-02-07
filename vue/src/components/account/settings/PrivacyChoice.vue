<template>
  <div class="options">
    <label v-for="option in options" :key="String(option.value)" class="option">
      <input
        type="radio"
        :name="name"
        v-model="model"
        :value="option.value"
        class="option__radio"
      />
      <span class="option__text">{{ option.label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
const model = defineModel()

interface Option {
  label: string
  value: string | number | boolean
}

defineProps<{
  name: string
  options: Option[]
}>()
</script>

<style scoped>
.options {
  display: flex;
  align-items: center;
}

.option {
  cursor: pointer;
  position: relative;
}

.option__radio {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.option__text {
  box-shadow: inset 0 0 3px 3px rgba(190, 127, 25, 0.5);
  padding: 5px 10px;
  color: #6e2c11;
  user-select: none;
}

.option:hover .option__text {
  background-color: #ead7c3;
}

.option__radio:checked + .option__text {
  background-color: #be7f197f;
}
</style>
