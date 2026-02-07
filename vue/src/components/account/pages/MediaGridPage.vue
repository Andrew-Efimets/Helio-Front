<template>
  <div class="container">
    <span v-if="isLoading" class="app-loader"></span>

    <template v-else>
      <slot name="header"></slot>

      <div class="notify-wrapper">
        <p class="notify">{{ emptyMessage }}</p>
      </div>

      <div v-if="items.length" class="wrapper">
        <slot name="items" :sorted-items="sortedItems"></slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  items: any[]
  isLoading: boolean
  emptyLabel: string
  activeLabel: string
}>()

const sortedItems = computed(() =>
  [...props.items].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  ),
)

const emptyMessage = computed(() => (!props.items.length ? props.emptyLabel : props.activeLabel))
</script>

<style scoped>
.container {
  background-color: #f5ddc5;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  min-height: 600px;
  text-align: center;
  padding-top: 10px;
}

.wrapper {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.notify-wrapper {
  padding: 10px;
}
.notify {
  color: #6e2c11;
  font-size: 18px;
  font-weight: 700;
}

@media (max-width: 767px) {
  .wrapper {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }
}
</style>
