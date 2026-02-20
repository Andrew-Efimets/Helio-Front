<template>
  <div class="input-wrapper">
    <label class="label">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleFilter"
      class="input"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string | number
  type: string
  placeholder: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleFilter = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
}

.label {
  padding: 0 0 5px 10px;
  color: #6e2c11;
  font-size: 14px;
  font-weight: bold;
}

.input {
  font-size: 14px;
  padding: 5px 0 5px 10px;
  border: #6e2c11 2px solid;
  border-radius: 18px;
  width: 150px;
}

.input:focus {
  outline: none;
  border: 2px solid #be7f19;
  box-shadow: 0 0 5px rgba(190, 127, 25, 0.5);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
