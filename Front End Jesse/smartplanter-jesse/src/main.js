// main.js
import { createApp } from 'vue'
import App from './App.vue'
import Keycloak from 'keycloak-js'
import router, { setKeycloak } from './router'
import './assets/styles/theme.css'

/* ======================================================
   FLAGS
====================================================== */
const authDisabled = process.env.VUE_APP_AUTH_DISABLED === 'true'

/* ======================================================
   THEME INITIALISATIE
====================================================== */
function initTheme() {
  const savedColor = localStorage.getItem('primary-color')
  if (savedColor) {
    document.documentElement.style.setProperty('--primary', savedColor)
  }

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
  }
}

initTheme()

/* ======================================================
   KEYCLOAK CONFIG
====================================================== */
const keycloakConfig = {
  url: process.env.VUE_APP_KEYCLOAK_URL || 'https://141.148.237.73:8443',
  realm: process.env.VUE_APP_KEYCLOAK_REALM || 'smartplanter',
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID || 'frontend-jesse',
}

const keycloak = new Keycloak(keycloakConfig)

// beschikbaar maken voor router guards
setKeycloak(keycloak)

/* ======================================================
   USER HELPERS
====================================================== */
function buildUserObject() {
  if (!keycloak.tokenParsed) return null

  const {
    sub,               // ← Keycloak user ID
    preferred_username,
    email,
    given_name,
    family_name,
    realm_access
  } = keycloak.tokenParsed

  return {
    id: sub,           // ← hier is je ID beschikbaar
    sub,               // optioneel, Keycloak puur
    username: preferred_username,
    email,
    firstName: given_name,
    lastName: family_name,
    fullName: `${given_name ?? ''} ${family_name ?? ''}`.trim(),
    firstLetter:
      given_name?.charAt(0)?.toUpperCase() ??
      preferred_username?.charAt(0)?.toUpperCase() ??
      '?',
    roles: realm_access?.roles ?? []
  }
}

/* ======================================================
   GLOBAAL AUTH OBJECT
====================================================== */
function createDevAuth() {
  return {
    keycloak: null,
    user: {
      username: 'dev',
      fullName: 'Developer Mode',
      roles: ['admin'],
      id: 'dev'       // ook hier ID toevoegen voor dev mode
    },
    logout() {},
    refresh() {}
  }
}

const auth = {
  keycloak,

  get user() {
    return buildUserObject()
  },

  logout() {
    keycloak.logout()
  },

  refresh() {
    return keycloak.updateToken(60)
  }
}

/* ======================================================
   APP INITIALISATIE
====================================================== */
if (authDisabled) {
  console.warn('⚠️ AUTH DISABLED (DEV MODE)')

  const app = createApp(App)
  app.config.globalProperties.$auth = createDevAuth()
  app.use(router)
  app.mount('#app')
} else {
  keycloak
    .init({
      onLoad: 'login-required',
      pkceMethod: 'S256'
    })
    .then((authenticated) => {
      if (!authenticated) {
        console.warn('⚠️ Keycloak authentication failed or canceled.')
        return
      }

      console.log('✅ Authenticated')

      const app = createApp(App)
      app.config.globalProperties.$auth = auth
      app.use(router)
      app.mount('#app')

      startTokenRefresh()
    })
    .catch((error) => {
      console.error('❌ Authentication Failed', error)
    })
}

/* ======================================================
   TOKEN AUTO REFRESH
====================================================== */
function startTokenRefresh() {
  setInterval(() => {
    keycloak
      .updateToken(70)
      .then((refreshed) => {
        if (refreshed) {
          console.log('🔄 Token refreshed')
        }
      })
      .catch(() => {
        console.error('❌ Failed to refresh token')
      })
  }, 60000)
}
