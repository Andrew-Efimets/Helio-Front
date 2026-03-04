<template>
  <div class="status-pointer">
    <p class="online-dot"></p>
    <p class="online-text">Online</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.status-pointer {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.online-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #689868;
  z-index: 3;
  margin: 5px;
}

.online-text {
  font-size: 12px;
  font-weight: bold;
  color: #689868;
}
</style>
