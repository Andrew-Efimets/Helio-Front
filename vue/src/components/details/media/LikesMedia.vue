<template>
  <div class="likes">
    <div class="wrapper">
      <div class="like">
        <img
          :class="{ 'is-active': isLiked }"
          src="@/assets/like.png"
          alt="like"
          class="like-img"
          @click="toggleLikeComponent"
        />
      </div>
      <div v-if="likeStore.totalCount" class="like-counter">
        <span class="like-description">
          Нравится {{ myLikeText }}
          <template v-if="displayCounter"> {{ displayCounter }} {{ human }} </template>
        </span>
        <div v-for="like in likeStore.allLikes" :key="like.id" class="avatar__wrapper">
          <img
            v-if="like.user?.active_avatar?.avatar_url"
            :src="like.user.active_avatar.avatar_url"
            alt="avatar"
            class="mini-avatar"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useLikeStore } from '@/stores/likes'
import { useAuthStore } from '@/stores/auth.ts'
import { useRoute } from 'vue-router'

const likeStore = useLikeStore()
const authStore = useAuthStore()
const route = useRoute()
const optimisticLiked = ref(false)
const isProcessing = ref(false)

const actualIsLiked = computed(() => {
  return likeStore.allLikes.some((like) => like.user_id === authStore.user?.id)
})

const isLiked = computed(() => (isProcessing.value ? optimisticLiked.value : actualIsLiked.value))

const toggleLikeComponent = async () => {
  if (!authStore.user?.id || isProcessing.value) return

  optimisticLiked.value = !actualIsLiked.value
  isProcessing.value = true

  try {
    await likeStore.toggleLike(authStore.user.id)
  } catch (error) {
    console.error('Ошибка при лайке:', error)
  } finally {
    isProcessing.value = false
  }
}

const myLikeText = computed(() => {
  if (!actualIsLiked.value) return ''
  return likeStore.totalCount > 1 ? 'вам и ещё ' : 'вам'
})

const displayCounter = computed(() => {
  if (actualIsLiked.value && likeStore.totalCount === 1) return 0
  return actualIsLiked.value ? likeStore.totalCount - 1 : likeStore.totalCount
})

const human = computed(() => {
  const count = displayCounter.value
  return count % 10 === 1 && count % 100 !== 11 ? 'человеку' : 'людям'
})

const loadLikes = () => {
  const ownerId = route.params.id as string
  if (ownerId) likeStore.fetchMediaLikes(ownerId)
}

const initEcho = () => {
  const { id, type } = likeStore.getParams()
  if (!window.Echo || !id || !type) return

  window.Echo.channel(`likes.${type}.${id}`).listen('LikesUpdate', (e) => {
    likeStore.allLikes = e.likes
  })
}

onMounted(() => {
  loadLikes()
  initEcho()
})

onUnmounted(() => {
  const { id, type } = likeStore.getParams()
  if (window.Echo && id && type) {
    window.Echo.leave(`likes.${type}.${id}`)
  }
})

watch(
  () => [route.params.videoId, route.params.photoId],
  () => {
    const { id, type } = likeStore.getParams()
    window.Echo.leave(`likes.${type}.${id}`)
    loadLikes()
    initEcho()
  },
)
</script>

<style scoped>
.likes {
  margin: 10px 20px;
  width: 50%;
  padding: 10px;
  background-color: #f9f2e7;
  border-radius: 10px;
}

.wrapper {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.like-img {
  width: 30px;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.like-img.is-active {
  content: url('@/assets/active-like.png');
}

.like-img:active {
  transform: scale(0.8);
}

.like-counter {
  display: flex;
  align-items: center;
  column-gap: 5px;
}

.like-description {
  color: #6e2c11;
  margin-right: 20px;
}

.avatar__wrapper {
  display: flex;
  align-items: center;
}

.mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: -15px;
}
</style>
