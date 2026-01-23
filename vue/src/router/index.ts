import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthModal from '@/views/ModalView.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import VerifyForm from '@/components/auth/VerifyForm.vue'
import AccountView from '@/views/AccountView.vue'
import AccountWall from '@/components/account/account-routs/AccountWall.vue'
import ChatsList from '@/components/account/account-routs/ChatsList.vue'
import ChatWindow from '@/components/account/account-routs/ChatWindow.vue'
import ContactsList from '@/components/account/account-routs/ContactsList.vue'
import PhotosList from '@/components/account/account-routs/PhotosList.vue'
import PhotoItem from '@/components/account/account-routs/PhotoItem.vue'
import VideosList from '@/components/account/account-routs/VideosList.vue'
import VideoItem from '@/components/account/account-routs/VideoItem.vue'
import UsersListView from '@/views/UsersListView.vue'
import ProfileSettingsView from '@/views/ProfileSettingsView.vue'
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
      path: '/auth',
      component: AuthModal,
      meta: { requiresGuest: true },
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
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'users',
          name: 'users',
          component: UsersListView,
        },
        {
          path: 'settings/:id',
          name: 'settings',
          component: ProfileSettingsView,
          props: true,
        },
        {
          path: 'user/:id',
          component: AccountView,
          props: true,
          children: [
            {
              path: '',
              name: 'wall',
              component: AccountWall,
              props: true,
            },
            {
              path: 'chats',
              name: 'chats',
              component: ChatsList,
              props: true,
            },
            {
              path: 'chat/:chatId',
              name: 'chat-item',
              component: ChatWindow,
              props: true,
            },
            {
              path: 'contacts',
              name: 'contacts',
              component: ContactsList,
              props: true,
            },
            {
              path: 'photos',
              name: 'photos',
              component: PhotosList,
              props: true,
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
              props: true,
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
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isVerified) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && authStore.isVerified) {
    if (authStore.user?.id) {
      next({ name: 'wall', params: { id: authStore.user.id } })
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router
