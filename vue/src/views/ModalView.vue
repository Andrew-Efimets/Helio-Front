<template>
  <dialog ref="dialogRef" class="modal" @click.self="close">
    <div class="modal__content">
      <button class="modal__close-btn" @click="close">×</button>
      <RouterView />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const dialogRef = ref<HTMLDialogElement | null>(null)

const close = () => {
  const parentPath = route.matched[route.matched.length - 2]?.path || '/'
  router.push(parentPath)
}

const updateModalState = () => {
  if (!dialogRef.value) return

  if (route.matched.length > 1) {
    if (!dialogRef.value.open) {
      dialogRef.value.showModal()
    }
  } else {
    dialogRef.value.close()
  }
}

watch(() => route.path, updateModalState)

onMounted(updateModalState)
</script>

<style scoped>
@import '@/assets/css/modal.css';
</style>
