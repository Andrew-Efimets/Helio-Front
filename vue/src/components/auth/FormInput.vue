<template>
  <div class="input-wrapper">
    <input
      v-maska
      :data-maska="mask"
      class="input"
      v-bind="$attrs"
      :class="{ 'input-error': error }"
      :value="modelValue"
      @input="handleInput"
    />
    <span v-if="error" class="message-error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { vMaska } from 'maska/vue'
defineOptions({ inheritAttrs: false })

defineProps<{
  modelValue: string | number
  error?: string
  mask?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.input {
  font-size: 16px;
  padding: 5px 0 5px 10px;
  border: #6e2c11 2px solid;
  border-radius: 18px;
}

.input:focus {
  outline: none;
  border: 2px solid #be7f19;
  box-shadow: 0 0 5px rgba(190, 127, 25, 0.5);
}

.message-error {
  color: darkred;
}

.input-error {
  border-color: darkred;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
}
</style>
