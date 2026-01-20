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
    <span v-if="error" class="error-message">{{ error }}</span>
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
@import '@/assets/css/auth-form.css';
.input-error {
  border-color: red;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  color: red;
}
</style>
