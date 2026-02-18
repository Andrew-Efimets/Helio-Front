<template>
  <div class="likes">
    <AppTransition name="dropdown">
      <div v-if="isOpenList" class="liked-list" ref="likedListRef">
        <div
          v-for="like in [...currentLikes].reverse()"
          :key="like.user.id"
          class="liked-list__item"
        >
          <img :src="like.user.active_avatar.avatar_url" class="mini-avatar" />
          <RouterLink :to="{ name: 'wall', params: { id: String(like.user.id) } }" class="link">
            <p class="user-name">{{ like.user.name }}</p>
          </RouterLink>
        </div>
      </div>
    </AppTransition>
    <div class="likes-container">
      <div class="wrapper">
        <div class="like">
          <img
            :class="{ 'is-active': isLikedLocal }"
            src="@/assets/like.png"
            alt="like"
            class="like-img"
            @click="toggleLikeComponent"
          />
        </div>
        <template v-if="isDataLoaded">
          <div v-if="totalCount" class="like-counter">
            <span class="like-description" @click="openLikedList" ref="likeDescriptionRef">
              Нравится {{ myLikeText }}
              <template v-if="displayCounter"> {{ displayCounter }} {{ human }} </template>
            </span>

            <div
              v-for="like in currentLikes.slice(-5)"
              :key="like.id"
              class="avatar__wrapper"
              @click="openLikedList"
              ref="avatarsRef"
            >
              <img
                v-if="like.user.active_avatar.avatar_url"
                :src="like.user.active_avatar.avatar_url"
                alt="avatar"
                class="mini-avatar avatar-preview"
              />
            </div>
          </div>
          <span v-else class="like-empty"> Оценить </span>
        </template>
        <span v-else class="app-mini-loader"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useLikeStore } from '@/stores/likes'
import { useAuthStore } from '@/stores/auth.ts'
import { RouterLink } from 'vue-router'
import AppTransition from '@/components/details/AppTransition.vue'

const props = defineProps<{
  mediaId: string | number
  mediaType: 'post' | 'photo' | 'video'
  ownerId: string | number
}>()

const likeStore = useLikeStore()
const authStore = useAuthStore()
const isOpenList = ref(false)
const currentLikes = computed(() => likeStore.getLikes(props.mediaType, props.mediaId))
const isDataLoaded = computed(() => currentLikes.value !== null)
const totalCount = computed(() => (currentLikes.value ? currentLikes.value.length : 0))

const actualIsLiked = computed(() => {
  if (!currentLikes.value) return false
  return currentLikes.value.some((like) => Number(like.user_id) === Number(authStore.user?.id))
})

const avatarsRef = ref<HTMLElement | null>(null)
const likedListRef = ref<HTMLElement | null>(null)
const likeDescriptionRef = ref<HTMLElement | null>(null)
const isLikedLocal = ref(actualIsLiked.value)

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (
    isOpenList.value &&
    likedListRef.value &&
    !likedListRef.value.contains(target) &&
    !likeDescriptionRef.value?.contains(target) &&
    !avatarsRef.value?.contains(target)
  ) {
    isOpenList.value = false
  }
}

watch(actualIsLiked, (newVal) => {
  isLikedLocal.value = newVal
})

const toggleLikeComponent = async () => {
  if (!authStore.user?.id) return

  const previousState = isLikedLocal.value

  isLikedLocal.value = !isLikedLocal.value

  try {
    await likeStore.toggleLike(props.ownerId, props.mediaType, props.mediaId)
  } catch (error) {
    isLikedLocal.value = previousState
    console.error(error)
  }
}

const myLikeText = computed(() => {
  if (!actualIsLiked.value) return ''
  return totalCount.value > 1 ? 'вам и ещё ' : 'вам'
})

const human = computed(() => {
  const count = displayCounter.value
  return count % 10 === 1 && count % 100 !== 11 ? 'человеку' : 'людям'
})

const displayCounter = computed(() => {
  const count = actualIsLiked.value ? totalCount.value - 1 : totalCount.value
  return count > 0 ? count : null
})

const initEcho = () => {
  if (!window.Echo) return
  const channelName = `likes.${props.mediaType}.${props.mediaId}`
  window.Echo.channel(channelName).listen('LikesUpdate', (e: any) => {
    likeStore.updateLikesFromSocket(props.mediaType, props.mediaId, e.likes)
  })
}

const openLikedList = () => {
  isOpenList.value = !isOpenList.value
}

watch(
  () => props.mediaId,
  async (newId, oldId) => {
    if (window.Echo && oldId) {
      window.Echo.leave(`likes.${props.mediaType}.${oldId}`)
    }

    likeStore.likesMap[`${props.mediaType}_${newId}`] = null as any

    isLikedLocal.value = false
    await likeStore.fetchMediaLikes(props.ownerId, props.mediaType, newId)

    isLikedLocal.value = actualIsLiked.value
    initEcho()
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  if (window.Echo) {
    window.Echo.leave(`likes.${props.mediaType}.${props.mediaId}`)
  }
  window.removeEventListener('click', handleClickOutside, true)
})
</script>

<style scoped>
.likes {
  width: 100%;
  position: relative;
}

.likes-container {
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
  row-gap: 10px;
}

.like-description {
  color: #6e2c11;
  margin-right: 20px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
}

.like-empty {
  color: #6e2c11;
  margin-right: 20px;
  font-size: 14px;
}

.like-description:hover {
  text-decoration: underline;
  color: #d87c56;
}

.avatar__wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
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

@media screen and (max-width: 490px) {
  .like-description {
    display: none;
  }
}
</style>
