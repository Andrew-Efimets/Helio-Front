import { createRouter, createWebHistory } from 'vue-router'
import AccountView from '@/views/AccountView.vue'
import ChatsView from '@/views/ChatsView.vue'
import UsersView from '@/views/UsersView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
          path: 'verify',
          name: 'verify',
          component: () => import('@/components/auth/VerifyForm.vue'),
        },
      ],
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
    {
      path: '/chats',
      name: 'chats',
      component: ChatsView,
    },
  ],
})

export default router
