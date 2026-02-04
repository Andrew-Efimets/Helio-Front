<template>
  <div class="comments">
    <div class="comments__container">
      <h3 class="comments__title">Комментарии</h3>
      <div class="comments__wrapper">
        <div class="comments__plate"></div>
        <div class="comments__input-container">
          <div class="comments__input-wrapper">
            <div v-if="showPicker" class="comments__emoji emoji" ref="emojiPickerContainer">
              <EmojiPicker :native="true" @select="onSelectEmoji" theme="light" />
            </div>
            <button
              @click="showPicker = !showPicker"
              type="button"
              class="emoji__button"
              ref="emojiButton"
            >
              😊
            </button>
            <textarea
              ref="autoTextarea"
              id="comment"
              v-model="message"
              class="comments__input"
              placeholder="Оставить комментарий"
              rows="1"
              @input="adjustHeight"
              @keydown.stop
            />
            <div class="comments__send send">
              <span class="send__button">
                <img src="@/assets/send-icon.png" alt="send" class="send__icon" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted, onUnmounted } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const message = ref('')
const autoTextarea = ref<HTMLTextAreaElement | null>(null)
const showPicker = ref(false)

const adjustHeight = () => {
  const el = autoTextarea.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }
}

const onSelectEmoji = (emoji: any) => {
  message.value += emoji.i

  nextTick(() => {
    adjustHeight()
    autoTextarea.value?.focus()
  })
}

const emojiPickerContainer = ref<HTMLElement | null>(null)
const emojiButton = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  if (
    showPicker.value &&
    emojiPickerContainer.value &&
    !emojiPickerContainer.value.contains(target) &&
    !emojiButton.value?.contains(target)
  ) {
    showPicker.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import '@/assets/css/details/comments-media.css';
</style>
