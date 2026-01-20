import { createRouter, createWebHistory } from 'vue-router'
import AccountView from '@/views/AccountView.vue'
import ChatsView from '@/views/ChatsView.vue'
import AccountSearchView from '@/views/AccountSearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AccountView,
    },
    {
      path: '/auth',
      component: () => import('@/components/auth/AuthModal.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/components/auth/LoginForm.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/components/auth/RegisterForm.vue'),
        },
        {
          path: 'confirm',
          name: 'confirm',
          component: () => import('@/components/auth/ConfirmForm.vue'),
        },
      ],
    },
    {
      path: '/account-search',
      name: 'account-search',
      component: AccountSearchView,
    },
    {
      path: '/chats',
      name: 'chats',
      component: ChatsView,
    },
  ],
})

export default router
