import axios, { type RawAxiosRequestHeaders } from 'axios'

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

    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await axios.get('/sanctum/csrf-cookie', {
          withCredentials: true,
          baseURL: import.meta.env.VITE_API_BASE_URL,
        })

        return api(originalRequest)
      } catch (retryError) {
        return Promise.reject(retryError)
      }
    }

    if (error.response?.status === 401) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default api
