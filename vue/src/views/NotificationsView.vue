<template>
  <Teleport to="body">
    <Transition name="slide-down">
      <div
        ref="popoverRef"
        popover="manual"
        v-if="notification.message"
        :class="['global-notification', notification.type]"
      >
        {{ notification.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

const notification = useNotificationStore()
const popoverRef = ref<HTMLElement | null>(null)

watch(
  () => notification.message,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      popoverRef.value?.showPopover()
    } else {
      popoverRef.value?.hidePopover()
    }
  },
)
</script>

<style scoped>
.global-notification {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  margin: 0;
  border: none;
  padding: 40px;
  text-align: center;
  color: #6e2c11;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

:popover-open {
  display: block;
}

.success {
  background-color: #e1ffe1;
}

.error {
  background-color: #ffd7d7;
}

.info {
  background-color: #beeae8;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
