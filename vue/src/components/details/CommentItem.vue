<template>
  <div class="comment">
    <img :src="comment.user.active_avatar?.avatar_url || '/default-avatar.png'" class="avatar" />
    <div class="content">
      <div class="header">
        <span class="author">{{ comment.user.name }}</span>
        <span class="date">{{ formatDate(comment.created_at) }}</span>
      </div>
      <p class="text">{{ comment.content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ comment: any }>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.comment {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  color: #6e2c11;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.author {
  font-weight: bold;
  font-size: 11px;
}

.date {
  font-size: 11px;
  color: #999;
  margin-left: 8px;
}

.text {
  font-size: 14px;
}
</style>
