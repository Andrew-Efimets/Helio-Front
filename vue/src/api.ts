import axios, { type RawAxiosRequestHeaders } from 'axios'
import { useAuthStore } from '@/stores/auth.ts'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
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
        await api.get('/sanctum/csrf-cookie', {
          withCredentials: true,
          baseURL: import.meta.env.VITE_API_BASE_URL,
        })

        return api(originalRequest)
      } catch (retryError) {
        return Promise.reject(retryError)
      }
    }

    if (error.response?.status === 401) {
      authStore.reset()

      if (router.currentRoute.value.name !== 'login') {
        router.push({ name: 'login' })
      }
    }

    return Promise.reject(error)
  },
)

export default api
