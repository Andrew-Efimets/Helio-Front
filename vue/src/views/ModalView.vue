<template>
  <dialog ref="dialogRef" class="modal" @click.self="close">
    <div class="modal__content">
      <button class="modal__close-btn" @click="close">×</button>
      <RouterView name="modal" />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const dialogRef = ref<HTMLDialogElement | null>(null)

// const close = () => {
//   if (route.meta.backTo) {
//     router.push({
//       name: route.meta.backTo as string,
//       params: route.params,
//     })
//   } else {
//     router.back()
//   }
// }

const close = () => {
  if (route.meta.backTo) {
    const targetName = route.meta.backTo as string

    const targetRoute = router.resolve({ name: targetName })

    const validKeys = targetRoute.matched.flatMap((m) =>
      m.path
        .split('/')
        .filter((p) => p.startsWith(':'))
        .map((p) => p.replace(/[:?+*]/g, '')),
    )

    const cleanParams = Object.keys(route.params)
      .filter((key) => validKeys.includes(key))
      .reduce(
        (obj, key) => {
          obj[key] = route.params[key]
          return obj
        },
        {} as Record<string, any>,
      )

    router.push({
      name: targetName,
      params: cleanParams,
    })
  } else {
    router.back()
  }
}

const updateModalState = () => {
  if (!dialogRef.value) return

  const isModalRoute = route.matched.some((record) => record.meta.isModal)

  if (isModalRoute) {
    if (!dialogRef.value.open) {
      dialogRef.value.showModal()
    }
  } else {
    if (dialogRef.value.open) {
      dialogRef.value.close()
    }
  }
}

watch(
  () => route.meta.isModal,
  (isModal) => {
    if (isModal) {
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  },
)

onMounted(updateModalState)
</script>

<style scoped>
@import '@/assets/css/modal.css';
</style>
