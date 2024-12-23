import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import eventBus from '@/utils/eventBus'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '首页 - 微乎'
    },
    component: () => import('@/views/home/HomeView.vue')
  },
  {
    path: '/create',
    name: 'create',
    meta: {
      title: '创作中心 - 微乎'
    },
    component: () => import('@/views/create/CreateView.vue')
  },
  {
    path: '/friend',
    name: 'friend',
    meta: {
      title: '朋友圈 - 微乎'
    },
    component: () => import('@/views/friend/FriendView.vue')
  },
  {
    path: '/userInfo/:email',
    name: 'userInfo',
    meta: {
      title: '用户详情 - 微乎'
    },
    component: () => import('@/views/userInfo/UserInfo.vue')
  },
  {
    path: '/personalCenter',
    children: [
      {
        path: '',
        name: 'personalCenter',
        meta: {
          title: '个人中心 - 微乎'
        },
        component: () => import('@/views/personalCenter/PersonalCenter.vue')
      },
      {
        path: 'edit',
        name: 'edit',
        meta: {
          title: '编辑中心 - 微乎'
        },
        component: () => import('@/views/edit/EditView.vue')
      }
    ]
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      title: '设置 - 微乎'
    },
    component: () => import('@/views/setting/SettingView.vue')
  },
  {
    path: '/post/:postId',
    name: 'post',
    meta: {
      title: '帖子详情 - 微乎'
    },
    component: () => import('@/views/post/PostView.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    meta: {
      title: '聊天 - 微乎'
    },
    component: () => import('@/views/chat/ChatView.vue')
  },
  {
    path: '/privacyGuidelines',
    name: 'privacyGuidelines',
    meta: {
      title: '隐私协议 - 微乎'
    },
    component: () => import('@/views/privacyGuidelines/PrivacyGuidelines.vue')
  },
  {
    path: '/protocol',
    name: 'protocol',
    meta: {
      title: '用户指引 - 微乎'
    },
    component: () => import('@/views/protocol/ProtocolView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    meta: {
      title: 'NOT FOUND - 微乎'
    },
    component: () => import('@/views/notFound/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const publicRoutes = [
  'home',
  'privacyGuidelines',
  'protocol',
  'forgetPassword',
  'feedbackError'
]

router.beforeEach((to, from, next) => {
  if (!publicRoutes.includes(to.name as string)) {
    if (!localStorage.getItem('token')) {
      eventBus.emit('openLogin')
      next(false)
    } else {
      document.title = to.meta.title || '微乎'
      next()
    }
  } else {
    next()
  }
})

export default router
