<template>
  <div class="user-item">
    <div>{{ user.id }}</div>
    <div>{{ user.name }}</div>
    <img v-if="user.avatar" :src="user.avatar" alt="" class="user-avatar" />
    <div>{{ user.profile?.country }}</div>
    <div>{{ user.profile?.city }}</div>
    <div>{{ user.profile?.birthday }}</div>
    <div>{{ user.contact_status?.type }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  user: any
}>()
</script>

<style>
.user-item {
}
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
