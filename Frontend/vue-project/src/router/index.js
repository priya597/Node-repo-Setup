import { createRouter, createWebHistory } from 'vue-router'
import CustomerView from '../views/CustomerView.vue'
import MachineView from '../views/MachineView.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/customers',
    name: 'customers',
    component: CustomerView
  },
  {
    path: '/machines',
    name: 'machines',
    component: MachineView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
