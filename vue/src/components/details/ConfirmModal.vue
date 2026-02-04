<template>
  <Teleport to="body">
    <dialog ref="confirmDialog" class="confirm__container" @click.self="$emit('close')">
      <div class="confirm__content">
        <main class="confirm__body">
          <slot>Вы уверены?</slot>
        </main>
        <footer class="confirm__footer">
          <button class="button" @click="$emit('close')">Отмена</button>
          <button class="button button--danger" @click="$emit('confirm')">
            <slot name="button__text">Удалить</slot>
          </button>
        </footer>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({ isOpen: Boolean })
const confirmDialog = ref<HTMLDialogElement | null>(null)

watch(
  () => props.isOpen,
  (val) => {
    if (val) confirmDialog.value?.showModal()
    else confirmDialog.value?.close()
  },
)

defineEmits(['close', 'confirm'])
</script>

<style scoped>
@import '@/assets/css/details/confirm-modal.css';
</style>
