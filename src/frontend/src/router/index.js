import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/menu', name: 'Menu', component: () => import('../views/Menu.vue') },
  { path: '/atmosphere', name: 'Atmosphere', component: () => import('../views/Atmosphere.vue') },
  { path: '/checkout', name: 'Checkout', component: () => import('../views/Checkout.vue') },
  { path: '/admin', name: 'Admin', component: () => import('../views/Admin.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
