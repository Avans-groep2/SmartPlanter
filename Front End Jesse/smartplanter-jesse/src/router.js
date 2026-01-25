// router.js
import { createRouter, createWebHistory } from 'vue-router'
import { toast } from './toast.js'

import DashboardPage from './pages/DashboardPage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import DataPage from './pages/DataPage.vue'
import NotificationsPage from './pages/NotificationsPage.vue'
import AdminPage from './pages/AdminPage.vue'
import PlantsPage from './pages/PlantsPage.vue'

let keycloakInstance = null

export function setKeycloak(keycloak) {
  keycloakInstance = keycloak
}

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardPage
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsPage
  },
  {
    path: '/data',
    name: 'data',
    component: DataPage
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    meta: {
      // requiresRole: 'beheerder'
    }
  },
  {
    path: '/plants',
    name: 'plants',
    component: PlantsPage,
    meta: {
      // requiresRole: 'beheerder'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiredRole = to.meta.requiresRole

  // Geen rol nodig → doorlaten
  if (!requiredRole) {
    return next()
  }

  // Keycloak niet klaar
  if (!keycloakInstance) {
    console.error('⚠️ Keycloak niet geïnitialiseerd')
    return next('/')
  }

  // Rol check (realm role)
  const isAdmin = keycloakInstance.hasRealmRole('beheerder')

  if (!isAdmin) {
    toast("Geen toegang", "error")
    return next('/')
  }

  next()
})

export default router
