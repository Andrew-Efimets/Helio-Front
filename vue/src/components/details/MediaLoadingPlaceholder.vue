<template>
  <div class="placeholder">
    <div class="skeleton-pulse"></div>
    <span class="status-tag">Обработка...</span>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.placeholder {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton-pulse {
  flex: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  background: linear-gradient(90deg, #f7e4d2 25%, #d0b29e 50%, #f7e4d2 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  z-index: 1;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.status-tag {
  width: 100%;
  z-index: 4;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #6e2c11;
  backdrop-filter: blur(4px);
}
</style>
