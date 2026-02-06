<template>
  <div class="add-wrapper">
    <p class="add-label">
      {{ isUpload ? uploadLabel : label }}
    </p>

    <div v-if="isUpload && props.mediaType === 'video'" class="loading">
      <span class="percent">{{ uploadProgress }}%</span>
      <div class="progress-back">
        <div class="progress-line" :style="{ width: uploadProgress + '%' }"></div>
      </div>
    </div>

    <div v-else class="button-wrapper" @click="fileInput?.click()">
      <p class="add-button">&plus;</p>
    </div>

    <input
      type="file"
      ref="fileInput"
      style="display: none"
      :accept="acceptType"
      @change="addFile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    isUpload: boolean
    uploadProgress?: number
    mediaType?: 'video' | 'photo' | 'all'
    label?: string
    uploadLabel?: string
  }>(),
  {
    uploadProgress: 0,
    mediaType: 'all',
    label: 'Добавить медиа',
    uploadLabel: 'Загрузка...',
  },
)

const emit = defineEmits(['file-selected'])
const fileInput = ref<HTMLInputElement | null>(null)

const acceptType = computed(() => {
  if (props.mediaType === 'video') return 'video/*'
  if (props.mediaType === 'photo') return 'image/*'
  return 'video/*,image/*'
})

const addFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    emit('file-selected', target.files[0])
  }

  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.add-wrapper {
  margin: 10px;
  padding: 20px;
  display: flex;
  column-gap: 40px;
  align-items: center;
  justify-content: end;
  box-shadow: 0 0 10px 5px rgba(240, 163, 55, 0.3);
}

.add-label {
  color: #6e2c11;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 3px 0 0 rgba(240, 163, 55, 0.2);
}

.button-wrapper {
  width: 30px;
  height: 30px;
  border: #6e2c11 1px solid;
  box-shadow: 0 0 5px 5px rgba(240, 163, 55, 0.2);
  cursor: pointer;
}

.add-button {
  font-size: 22px;
}

.button-wrapper:active {
  scale: 0.9;
  box-shadow: inset 0 0 5px 5px rgba(240, 163, 55, 0.2);
}

.add-button:disabled {
  background-color: #957f6f;
}

.loading {
  display: flex;
  flex-direction: column;
  width: 200px;
  min-height: 40px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  gap: 8px;
  position: relative;
}

.percent {
  font-size: 16px;
  font-weight: 600;
  color: #6e2c11;
  font-family: sans-serif;
}

.progress-back {
  position: absolute;
  background: #fff;
  height: 6px;
  border-radius: 10px;
  margin: 0 10px;
  top: 70%;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.progress-line {
  background: #beeabe;
  height: 100%;
  border-radius: 10px;
}

.percent {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
