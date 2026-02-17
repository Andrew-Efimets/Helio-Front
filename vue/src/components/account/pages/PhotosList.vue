<template>
  <div class="photos">
    <div v-if="privacyError" class="error-message">{{ privacyError }}</div>

    <MediaGridPage
      v-else
      :items="photoStore.allPhotos"
      :is-loading="photoStore.isLoading"
      empty-label="Фотографий пока нет"
      active-label="Фотографий"
    >
      <template #header>
        <MediaAddBlock
          v-if="isOwner"
          media-type="photo"
          label="Загрузить фотографию"
          :is-upload="photoStore.isUpload"
          @file-selected="photoStore.sendPhoto"
        />
      </template>

      <template #items="{ sortedItems }">
        <div v-for="photo in sortedItems" :key="photo.id" class="media-item">
          <MediaLoadingPlaceholder v-if="!photo.photo_url" />
          <RouterLink
            v-else
            :to="{ name: 'photo', params: { id: route.params.id, photoId: photo.id } }"
          >
            <img :src="photo.photo_url" class="img-fit" />
          </RouterLink>
        </div>
      </template>
    </MediaGridPage>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { usePhotoStore } from '@/stores/photos.ts'
import { useRoute, RouterLink } from 'vue-router'
import { watch, ref, computed } from 'vue'
import MediaGridPage from '@/components/account/pages/MediaGridPage.vue'
import MediaAddBlock from '@/components/details/media/MediaAddBlock.vue'
import MediaLoadingPlaceholder from '@/components/details/media/MediaLoadingPlaceholder.vue'

const authStore = useAuthStore()
const photoStore = usePhotoStore()
const route = useRoute()
const privacyError = ref()

watch(
  () => route.params.id,
  (newId) => {
    if (newId && route.name === 'photos') {
      privacyError.value = null
      photoStore
        .fetchPhotos(newId as string)
        .catch((e) => (privacyError.value = e.formattedMessage))
    }
  },
  { immediate: true },
)

const isOwner = computed(() => Number(authStore.user?.id) === Number(route.params.id))
</script>

<style scoped>
.photos {
  padding: 10px 0;
}

.media-item {
  aspect-ratio: 1/1;
  overflow: hidden;
  border-radius: 8px;
}

.img-fit {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
