<template>
  <div class="form__input-wrapper">
    <input
      v-maska
      :data-maska="mask"
      class="form__input"
      v-bind="$attrs"
      :class="{ 'form__input-error': error }"
      :value="modelValue"
      @input="handleInput"
    />
    <span v-if="error" class="form__message-error">{{ error }}</span>
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
.form__input-error {
  border-color: red;
}

.form__input-wrapper {
  display: flex;
  flex-direction: column;
}
</style>
