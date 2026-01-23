<template>
  <div class="content">
    <div class="content__title-wrapper">
      <h1 class="content__title">Твой тихий уголок в шумном интернете</h1>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.content {
  background-image: url('@/assets/background.png');
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: center center;
  min-height: 100vh;
}

.content__title-wrapper {
  width: 100%;
  text-align: center;
}

.content__title {
  padding: 60px;
  color: #6e2c11;
}
</style>
