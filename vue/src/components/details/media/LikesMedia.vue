<template>
  <div class="likes">
    <div v-if="isOpenList" class="liked-list" ref="likedListRef">
      <div
        v-for="like in [...likeStore.allLikes].reverse()"
        :key="like.user.id"
        class="liked-list__item"
      >
        <img :src="like.user.active_avatar.avatar_url" class="mini-avatar" />
        <RouterLink :to="{ name: 'wall', params: { id: String(like.user.id) } }" class="link">
          <p class="user-name">{{ like.user.name }}</p>
        </RouterLink>
      </div>
    </div>
    <div class="likes-container">
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
          <span class="like-description" @click="openLikedList" ref="likeDescriptionRef">
            Нравится {{ myLikeText }}
            <template v-if="displayCounter"> {{ displayCounter }} {{ human }} </template>
          </span>
          <div v-for="like in likeStore.allLikes.slice(-5)" :key="like.id" class="avatar__wrapper">
            <img
              v-if="like.user.active_avatar.avatar_url"
              :src="like.user.active_avatar.avatar_url"
              alt="avatar"
              class="mini-avatar avatar-preview"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useLikeStore } from '@/stores/likes'
import { useAuthStore } from '@/stores/auth.ts'
import { useRoute, RouterLink } from 'vue-router'

const likeStore = useLikeStore()
const authStore = useAuthStore()
const route = useRoute()
const optimisticLiked = ref(false)
const isProcessing = ref(false)
const isOpenList = ref(false)

const actualIsLiked = computed(() => {
  return likeStore.allLikes.some((like) => like.user_id === authStore.user?.id)
})

const isLiked = computed(() => (isProcessing.value ? optimisticLiked.value : actualIsLiked.value))

const likedListRef = ref<HTMLElement | null>(null)
const likeDescriptionRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node

  if (
    isOpenList.value &&
    likedListRef.value &&
    !likedListRef.value.contains(target) &&
    !likeDescriptionRef.value?.contains(target)
  ) {
    isOpenList.value = false
  }
}

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

const openLikedList = () => {
  isOpenList.value = !isOpenList.value
}

onMounted(() => {
  loadLikes()
  initEcho()
  window.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  const { id, type } = likeStore.getParams()
  if (window.Echo && id && type) {
    window.Echo.leave(`likes.${type}.${id}`)
  }
  window.removeEventListener('click', handleClickOutside, true)
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
  width: 60%;
  position: relative;
}

.likes-container {
  margin: 10px 20px;
  padding: 10px;
  background-color: #f9f2e7;
  border-radius: 10px;
}

.wrapper {
  display: flex;
  align-items: center;
  column-gap: 20px;
  margin-left: 20px;
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
  cursor: pointer;
}

.like-description:hover {
  text-decoration: underline;
  color: #d87c56;
}

.avatar__wrapper {
  display: flex;
  align-items: center;
}

.mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.avatar-preview {
  margin-left: -15px;
}

.liked-list {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  position: absolute;
  bottom: 100%;
  left: 25%;
  background-color: #f9f2e7;
  padding: 10px;
  border-radius: 10px;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(153, 61, 26, 0.5) transparent;
  z-index: 100;
  box-shadow: 0 4px 15px rgba(110, 44, 17, 0.2);
}

.liked-list::-webkit-scrollbar {
  width: 6px;
}

.liked-list__item {
  display: flex;
  align-items: center;
  column-gap: 20px;
}

.link {
  text-decoration: none;
  color: #6e2c11;
}

.link:hover {
  text-decoration: underline;
}

@media screen and (max-width: 1024px) {
  .likes {
    width: 100%;
  }
}
</style>
