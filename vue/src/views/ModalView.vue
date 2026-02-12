<template>
  <dialog ref="dialogRef" class="modal" @click.self="close">
    <div class="content">
      <button class="close-btn" @click="close">×</button>
      <RouterView name="modalMain" />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const router = useRouter()
const route = useRoute()
const dialogRef = ref<HTMLDialogElement | null>(null)
const authStore = useAuthStore()

const close = () => {
  if (!authStore.user) {
    router.push({ name: 'home' })
    return
  }

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
.modal {
  border: none;
  border-radius: 16px;
  padding: 0;
  background-color: #f2decd;
  box-shadow: inset 0 0 40px 10px rgba(190, 127, 25, 0.5);
  margin: auto;
}

.modal::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.content {
  padding: 30px;
  position: relative;
  min-width: 400px;
}

.close-btn {
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 26px;
  border: none;
  background: none;
  cursor: pointer;
  color: #6e2c11;
}

.close-btn:hover {
  transform: scale(1.1);
  transition: all 0.3s linear;
  box-shadow: inset 0 0 3px 3px rgba(190, 127, 25, 0.3);
}
</style>
