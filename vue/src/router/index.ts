import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import VerifyForm from '@/components/auth/VerifyForm.vue'
import AccountView from '@/views/AccountView.vue'
import AccountWall from '@/components/account/pages/AccountWall.vue'
import ChatsList from '@/components/account/pages/ChatsList.vue'
import ChatWindow from '@/components/account/pages/ChatWindow.vue'
import ContactsList from '@/components/account/pages/ContactsList.vue'
import PhotosList from '@/components/account/pages/PhotosList.vue'
import VideosList from '@/components/account/pages/VideosList.vue'
import MediaItem from '@/components/account/pages/MediaItem.vue'
import UsersListView from '@/views/UsersListView.vue'
import ProfileSettingsView from '@/views/ProfileSettingsView.vue'
import ProfileSettings from '@/components/account/settings/ProfileSettings.vue'
import AvatarSettings from '@/components/account/settings/AvatarSettings.vue'
import PrivacySettings from '@/components/account/settings/PrivacySettings.vue'
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
      path: '/',
      component: HomeView,
      meta: { requiresGuest: true },
      children: [
        {
          path: 'login',
          name: 'login',
          components: {
            default: HomeView,
            modalMain: LoginForm,
          },
          meta: { isModal: true },
        },
        {
          path: 'register',
          name: 'register',
          components: {
            modalMain: RegisterForm,
          },
          meta: { isModal: true },
        },
        {
          path: 'verify',
          name: 'verify',
          components: {
            modalMain: VerifyForm,
          },
          meta: { isModal: true },
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
          redirect: { name: 'profile-settings' },
          component: ProfileSettingsView,
          props: true,
          children: [
            {
              path: 'profile-settings',
              name: 'profile-settings',
              component: ProfileSettings,
            },
            {
              path: 'avatar-settings',
              name: 'avatar-settings',
              component: AvatarSettings,
            },
            {
              path: 'privacy-settings',
              name: 'privacy-settings',
              component: PrivacySettings,
            },
          ],
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
              components: {
                default: PhotosList,
                modalMain: MediaItem,
              },
              meta: { isModal: true, backTo: 'photos' },
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
              components: {
                default: VideosList,
                modalMain: MediaItem,
              },
              meta: { isModal: true, backTo: 'videos' },
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
