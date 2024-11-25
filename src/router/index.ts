import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import eventBus from '@/utils/eventBus'

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
    component: () => import('@/views/chat/chatView.vue')
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

// router.beforeEach((to, from, next) => {
//   if (to.name !== 'home') {
//     if (!localStorage.getItem('token')) {
//       eventBus.emit('openLogin')
//       next(false)
//     }
//   }
// })
export default router
