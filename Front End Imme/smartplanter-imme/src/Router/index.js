import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Account from '../pages/Account.vue'
import Data from '../pages/Data.vue'
import Notificaties from '../pages/Notificaties.vue'
import BrAdmin from '../pages/BrAdmin.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home, meta: { requiresAuth: true }},
  { path: '/account', component: Account },
  { path: '/data', component: Data },
  { path: '/notificaties', component: Notificaties },
  { path: '/bradmin', component: BrAdmin, meta: { requiresAuth: true, role: 'admin'}}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const keycloak = window.$keycloak 

  if (!keycloak) return next()

  if (to.meta.requiresAuth && !keycloak.authenticated) {
    keycloak.login({ redirectUri: window.location.origin + to.fullPath })
    return
  }

  if (to.meta.role) {
    const hasRole = keycloak.hadRealmRole(to.meta.role);
    if (!hasRole) {
      console.warn("Geen toegang: Geen admin");
      return next('/home');
    }
  }

  next()
})

export default router
