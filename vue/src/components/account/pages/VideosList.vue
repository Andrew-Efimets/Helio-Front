<template>
  <div class="videos">
    <div v-if="privacyError" class="error-message">{{ privacyError }}</div>

    <MediaGridPage
      v-else
      :items="videoStore.allVideos"
      :is-loading="videoStore.isLoading"
      empty-label="Видеозаписей пока нет"
      active-label="Видеозаписей"
    >
      <template #header>
        <MediaAddBlock
          v-if="isOwner"
          media-type="video"
          label="Загрузить видео"
          :is-upload="videoStore.isUpload"
          :upload-progress="videoStore.uploadProgress"
          @file-selected="videoStore.sendVideo"
        />
      </template>

      <template #items="{ sortedItems }">
        <VideoListCard v-for="video in sortedItems" :key="video.id" :video="video" />
      </template>
    </MediaGridPage>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import { useVideoStore } from '@/stores/videos.ts'
import VideoListCard from '@/components/details/media/VideoListCard.vue'
import MediaGridPage from '@/components/account/pages/MediaGridPage.vue'
import MediaAddBlock from '@/components/details/media/MediaAddBlock.vue'
import MediaLoadingPlaceholder from '@/components/details/media/MediaLoadingPlaceholder.vue'

const authStore = useAuthStore()
const videoStore = useVideoStore()
const route = useRoute()

const privacyError = ref<string | null>(null)
const isOwner = computed(() => Number(authStore.user?.id) === Number(route.params.id))

watch(
  () => route.params.id,
  (newId) => {
    if (newId && route.name === 'videos') {
      videoStore
        .fetchVideos(newId as string)
        .catch((e) => (privacyError.value = e.formattedMessage))
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.videos {
  padding: 10px 0;
  width: 100%;
}

.error-message {
  width: 100%;
  font-size: 16px;
  padding: 20px;
  background-color: #e99a9a;
  color: darkred;
  text-align: center;
}
</style>
