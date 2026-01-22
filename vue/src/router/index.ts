import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import VerifyForm from '@/components/auth/VerifyForm.vue'
import AccountView from '@/views/AccountView.vue'
import AccountWall from '@/components/account/account-routs/AccountWall.vue'
import ChatsList from '@/components/account/account-routs/ChatsList.vue'
import ChatWindow from '@/components/account/account-routs/ChatWindow.vue'
import ContactsList from '@/components/account/account-routs/ContactsList.vue'
import UsersList from '@/components/account/account-routs/UsersList.vue'
import PhotosList from '@/components/account/account-routs/PhotosList.vue'
import PhotoItem from '@/components/account/account-routs/PhotoItem.vue'
import VideosList from '@/components/account/account-routs/VideosList.vue'
import VideoItem from '@/components/account/account-routs/VideoItem.vue'
import { useAuthStore } from '@/stores/auth.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/account',
      redirect: () => {
        const authStore = useAuthStore()
        if (authStore.isVerified && authStore.user?.id) {
          return { name: 'wall', params: { id: authStore.user.id } }
        }
        return { name: 'login' }
      },
    },
    {
      path: '/users',
      name: 'users',
      component: UsersList,
    },
    {
      path: '/auth',
      component: AuthModal,
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginForm,
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterForm,
        },
        {
          path: 'verify',
          name: 'verify',
          component: VerifyForm,
        },
      ],
    },
    {
      path: '/user/:id',
      name: 'account',
      component: AccountView,
      props: true,
      children: [
        {
          path: '',
          name: 'wall',
          component: AccountWall,
        },
        {
          path: 'chats',
          name: 'chats',
          component: ChatsList,
        },
        {
          path: 'chat/:chatId',
          name: 'chat-item',
          props: true,
          component: ChatWindow,
        },
        {
          path: 'contacts',
          name: 'contacts',
          component: ContactsList,
        },
        {
          path: 'photos',
          name: 'photos',
          component: PhotosList,
        },
        {
          path: 'photo/:photoId',
          name: 'photo',
          component: PhotoItem,
          props: true,
        },
        {
          path: 'videos',
          name: 'videos',
          component: VideosList,
        },
        {
          path: 'video/:videoId',
          name: 'video',
          component: VideoItem,
          props: true,
        },
      ],
    },
  ],
})

export default router
