// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Echo: Echo
    Pusher: typeof Pusher
  }
}

export {}
