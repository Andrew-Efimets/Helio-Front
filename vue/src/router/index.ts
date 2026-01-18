import { createRouter, createWebHistory } from 'vue-router'
import AccountView from '@/views/AccountView.vue'
import ChatsView from '@/views/ChatsView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
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
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
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
