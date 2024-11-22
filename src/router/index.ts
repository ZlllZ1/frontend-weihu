import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import CreateView from '@/views/create/CreateView.vue'
import FriendView from '@/views/friend/FriendView.vue'
import UserInfo from '@/views/userInfo/UserInfo.vue'
import PersonalCenter from '@/views/personalCenter/PersonalCenter.vue'
import PostView from '@/views/post/PostView.vue'
import chatView from '@/views/chat/chatView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/create',
    name: 'create',
    component: CreateView
  },
  {
    path: '/friend',
    name: 'friend',
    component: FriendView
  },
  {
    path: '/userInfo/:userId',
    name: 'userInfo',
    component: UserInfo
  },
  {
    path: '/personalCenter',
    name: 'personalCenter',
    component: PersonalCenter
  },
  {
    path: '/post/:postId',
    name: 'post',
    component: PostView
  },
  {
    path: '/chat/:userId',
    name: 'chat',
    component: chatView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
