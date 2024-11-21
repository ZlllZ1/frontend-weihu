import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import CreateView from '@/views/create/CreateView.vue'
import FriendView from '@/views/friend/FriendView.vue'
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
