<template>
  <div class="input-container">
    <div class="input-wrapper">
      <div v-if="showPicker" class="emoji" ref="emojiPickerContainer">
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
        :value="modelValue"
        @input="onInput"
        class="input"
        :placeholder="placeholder"
        rows="1"
        @keydown.enter.exact.prevent="handleSend"
      />

      <div class="send" @click="handleSend">
        <span class="send__button">
          <img src="@/assets/send-icon.png" alt="send" class="send__icon" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted, onUnmounted } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Введите текст...' },
})

const emit = defineEmits(['update:modelValue', 'send'])
const autoTextarea = ref<HTMLTextAreaElement | null>(null)
const showPicker = ref(false)
const emojiPickerContainer = ref<HTMLElement | null>(null)
const emojiButton = ref<HTMLElement | null>(null)

const adjustHeight = () => {
  const el = autoTextarea.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  adjustHeight()
}

const onSelectEmoji = (emoji: any) => {
  const newValue = props.modelValue + emoji.i
  emit('update:modelValue', newValue)

  nextTick(() => {
    adjustHeight()
    autoTextarea.value?.focus()
  })
}

const handleSend = () => {
  if (props.modelValue.trim()) {
    emit('send', props.modelValue)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (
    showPicker.value &&
    !emojiPickerContainer.value?.contains(target) &&
    !emojiButton.value?.contains(target)
  ) {
    showPicker.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  nextTick(adjustHeight)
})

onUnmounted(() => window.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 20px;
}

.input-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  position: relative;
}

.input {
  outline: none;
  resize: none;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  background: transparent;
  width: 100%;
  max-height: 300px;
  padding: 10px 40px 10px 40px;
  border: #6e2c11 1px solid;
  border-radius: 8px;
  color: #6e2c11;
  line-height: 22px;
  font-size: 12px;
  font-weight: bold;
  font-family: Georgia;
}

.input:focus {
  border-color: #be7f19;
}

.send {
  position: absolute;
  width: 30px;
  left: 90%;
  bottom: 2px;
}

.send__button {
  width: 100%;
}

.send__icon {
  width: 100%;
  cursor: pointer;
}

.send:active {
  scale: 0.8;
}

.emoji {
  position: absolute;
  width: 100%;
  bottom: 100%;
  right: 0;
  z-index: 10;
  margin-bottom: 10px;
}

.emoji__button {
  position: absolute;
  border: none;
  background: transparent;
  font-size: 20px;
  right: 90%;
  bottom: 8px;
  cursor: pointer;
}
</style>
