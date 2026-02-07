import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  const message = ref<string | null>(null)
  const type = ref<'success' | 'error' | 'info'>('info')

  const show = (
    msg: string,
    msgType: 'success' | 'error' | 'info' = 'success',
    duration = 5000,
  ) => {
    message.value = msg
    type.value = msgType

    setTimeout(() => {
      message.value = null
    }, duration)
  }

  return { message, type, show }
})
