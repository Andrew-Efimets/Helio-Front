import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vueDevTools(), vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    allowedHosts: ['heliophone.com'],
    proxy: {
      '/api/v1': {
        target: 'http://heliophone.com',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'http://heliophone.com',
        changeOrigin: true,
      },
    },
  },
})
