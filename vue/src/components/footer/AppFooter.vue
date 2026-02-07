<template>
  <div class="footer">
    <div class="wrapper">
      <div class="label">
        <img src="@/assets/heliologo.png" alt="logo" class="logo" />
        <h3>Heliophone</h3>
      </div>
      <p class="notify">&copy; 2026 Heliophone.com</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.footer {
  background-color: #c99d7f;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
  flex-shrink: 0;
  margin-top: 20px;
}

.wrapper {
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 20px;
}

h3 {
  color: #6e2c11;
  font-size: 26px;
  font-family: Georgia;
}

.label {
  display: flex;
  column-gap: 10px;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.notify {
  color: #6e2c11;
}
</style>
