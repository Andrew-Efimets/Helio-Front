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

    return Promise.reject(error)
  },
)

export default api
