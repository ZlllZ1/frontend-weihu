import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
