<template>
  <div class="wrapper">
    <label class="input-label">{{ props.label }}</label>
    <input type="text" :value="modelValue" @input="handleFilter" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleFilter = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style></style>
