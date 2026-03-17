<template>
  <Teleport to="body">
    <dialog
      ref="confirmDialog"
      class="container"
      @click.self="$emit('close')"
      @cancel.prevent="$emit('close')"
    >
      <div class="content">
        <main class="main">
          <slot>Вы уверены?</slot>
        </main>
        <footer class="footer">
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
import { ref, watch, onMounted } from 'vue'

const props = defineProps({ isOpen: Boolean })
const confirmDialog = ref<HTMLDialogElement | null>(null)

onMounted(() => {
  if (props.isOpen) {
    confirmDialog.value?.showModal()
  }
})

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
.container {
  inset: 0;
  margin: auto;
  border: none;
  background: transparent;
  padding: 0;
  max-width: fit-content;
  max-height: fit-content;
  overflow: hidden;
}

.container[open] {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container::backdrop {
  background: rgba(0, 0, 0, 0.6);
}

.content {
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: modal-appear 0.2s ease-out;
  background-color: #f2decd;
  box-shadow: inset 0 0 40px 10px rgba(190, 127, 25, 0.5);
  overflow: hidden;
}

.main {
  font-size: 18px;
  color: #6e2c11;
  text-align: center;
  line-height: 1.5;
  padding: 20px;
}

.footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}

@keyframes modal-appear {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media screen and (max-width: 768px) {
  .main {
    font-size: 16px;
  }

  .footer {
    flex-direction: column;
    align-items: center;
  }
}
</style>
