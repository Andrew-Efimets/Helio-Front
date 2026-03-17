<template>
  <AppTransition name="fade">
    <button v-if="isVisible" class="scroll-top" @click="scrollToTop" title="Наверх">
      <img src="@/assets/totop.png" alt="up" class="arrow" />
    </button>
  </AppTransition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppTransition from '@/components/details/AppTransition.vue'

const isVisible = ref(false)

const checkScroll = () => {
  isVisible.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => window.addEventListener('scroll', checkScroll))
onUnmounted(() => window.removeEventListener('scroll', checkScroll))
</script>

<style scoped>
.scroll-top {
  outline: none;
  border: none;
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 50px;
  height: 50px;
  background-color: #f5ddc5;
  border-radius: 10px;
  cursor: pointer;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 15px rgba(110, 44, 17, 0.5);
  transition: transform 0.2s;
}

.scroll-top:hover {
  transform: scale(1.1);
}

.arrow {
  width: 40px;
  height: 40px;
}
</style>
