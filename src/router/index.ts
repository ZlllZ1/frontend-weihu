import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import eventBus from '@/utils/eventBus'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/HomeView.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('@/views/create/CreateView.vue')
  },
  {
    path: '/friend',
    name: 'friend',
    component: () => import('@/views/friend/FriendView.vue')
  },
  {
    path: '/userInfo/:userId',
    name: 'userInfo',
    component: () => import('@/views/userInfo/UserInfo.vue')
  },
  {
    path: '/personalCenter',
    name: 'personalCenter',
    component: () => import('@/views/personalCenter/PersonalCenter.vue')
  },
  {
    path: '/post/:postId',
    name: 'post',
    component: () => import('@/views/post/PostView.vue')
  },
  {
    path: '/chat/:userId',
    name: 'chat',
    component: () => import('@/views/chat/ChatView.vue')
  },
  {
    path: '/privacyGuidelines',
    name: 'privacyGuidelines',
    component: () => import('@/views/privacyGuidelines/PrivacyGuidelines.vue')
  },
  {
    path: '/protocol',
    name: 'protocol',
    component: () => import('@/views/protocol/ProtocolView.vue')
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    component: () => import('@/views/forgetPassword/ForgetPassword.vue')
  },
  {
    path: '/feedbackError',
    name: 'feedbackError',
    component: () => import('@/views/feedbackError/FeedbackError.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/notFound/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const publicRoutes = ['home']

router.beforeEach((to, from, next) => {
  if (!publicRoutes.includes(to.name as string)) {
    if (!localStorage.getItem('token')) {
      eventBus.emit('openLogin')
      next(false)
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
