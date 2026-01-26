import axios, { type RawAxiosRequestHeaders } from 'axios'
import { useAuthStore } from '@/stores/auth.ts'
import router from '@/router'

const apiServ = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
  } as RawAxiosRequestHeaders,
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await apiServ.get('/sanctum/csrf-cookie')

        return api(originalRequest)
      } catch (retryError) {
        return Promise.reject(retryError)
      }
    }

    if (error.response?.status === 401) {
      authStore.reset()

      const instRoute = router as any

      if (instRoute.currentRoute.value.name !== 'login') {
        instRoute.push({ name: 'login' }).catch(() => {})
      }
    }

    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      if (status === 422) {
        error.formattedMessage = data.message || 'Ошибка валидации данных'
      } else if (status === 419) {
        error.formattedMessage = 'Сессия истекла, мы пытаемся обновить её. Попробуйте еще раз.'
      } else if (status === 500) {
        error.formattedMessage = 'Ошибка на стороне сервера. Попробуйте позже.'
      } else {
        error.formattedMessage = data.message || 'Произошла непредвиденная ошибка'
      }
    } else {
      error.formattedMessage = 'Нет соединения с сервером. Проверьте интернет.'
    }

    return Promise.reject(error)
  },
)

export default api
