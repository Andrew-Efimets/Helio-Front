<template>
  <Transition :name="name" mode="out-in">
    <slot />
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  name: { type: String, default: 'fade' },
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
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

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-20px) scaleY(0.95);
  transform-origin: top;
}
</style>
