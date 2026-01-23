<template>
  <div class="container">
    <div class="title-wrapper">
      <h1 class="title">Твой тихий уголок в шумном интернете</h1>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
  background-image: url('@/assets/background.png');
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: center center;
  min-height: 100vh;
}

.title-wrapper {
  width: 100%;
  text-align: center;
}

.title {
  padding: 60px;
  color: #6e2c11;
}
</style>
