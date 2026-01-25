// main.js
import { createApp } from 'vue'
import App from './App.vue'
import Keycloak from 'keycloak-js'
import router, { setKeycloak } from './router'
import './assets/styles/theme.css'
import { toast } from './toast.js'  // toast helper

/* ======================================================
   FLAGS
====================================================== */
const authDisabled = process.env.VUE_APP_AUTH_DISABLED === 'false'

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
setKeycloak(keycloak)

/* ======================================================
   USER HELPERS
====================================================== */
function buildUserObject() {
  if (!keycloak.tokenParsed) return null

  const {
    sub,
    preferred_username,
    email,
    given_name,
    family_name,
    realm_access
  } = keycloak.tokenParsed

  return {
    id: sub,
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
      id: 'tester',
      username: 'dev',
      fullName: 'Developer Mode',
      roles: ['beheerder']
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
   USER CHECK + INSERT
====================================================== */
function ensureUserExists() {
  const userID = keycloak.tokenParsed.sub
  const username = keycloak.tokenParsed.preferred_username

  if (!userID || !username) {
    console.error('❌ User gegevens ontbreken')
    return
  }

  const DATA_URL =
    'https://smartplanters.dedyn.io:1880/smartplantdata?table=Users'

  const INSERT_URL =
    `https://smartplanters.dedyn.io:1880/smartplantedit?table=Users` +
    `&userID=${encodeURIComponent(userID)}` +
    `&username=${encodeURIComponent(username)}` +
    `&rights=read`

  fetch(DATA_URL)
    .then(res => res.json())
    .then(users => {
      const exists = users.some(
        u => u.UserID === userID && u.Username === username
      )

      if (exists) {
        return
      }

      return fetch(INSERT_URL)
    })
    .then(res => {
      if (!res) return

      if (res.ok) {
        console.log('✅ User succesvol toegevoegd aan database')
      } else {
        return res.text().then(text => {
          console.error('❌ Fout bij toevoegen user:', text)
        })
      }
    })
    .catch(err => {
      console.error('❌ Netwerkfout bij user check/toevoegen:', err)
    })
}

/* ======================================================
   GLOBALE TOAST FUNCTIE REGISTREREN
====================================================== */
function registerGlobalToast(app) {
  // Voeg de toast helper toe aan Vue globale properties
  app.config.globalProperties.$toast = toast
}

/* ======================================================
   APP INITIALISATIE
====================================================== */
if (authDisabled) {
  console.warn('⚠️ AUTH DISABLED (DEV MODE)')

  const app = createApp(App)
  app.config.globalProperties.$auth = createDevAuth()
  registerGlobalToast(app)   // ✅ Globale toast
  app.use(router)
  app.mount('#app')
} else {
  keycloak
    .init({
      onLoad: 'login-required',
      pkceMethod: 'S256'
    })
    .then(authenticated => {
      if (!authenticated) return

      ensureUserExists()

      const app = createApp(App)
      app.config.globalProperties.$auth = auth
      registerGlobalToast(app)  // ✅ Globale toast
      app.use(router)
      app.mount('#app')

      startTokenRefresh()
    })
    .catch(err => {
      console.error('❌ Keycloak authenticatie mislukt:', err)
    })
}

/* ======================================================
   TOKEN AUTO REFRESH
====================================================== */
function startTokenRefresh() {
  setInterval(() => {
    keycloak
      .updateToken(70)
      .catch(() => {
        console.error('❌ Token refresh mislukt')
      })
  }, 60000)
}


/* ======================================================
   NO NEGATIVE NUMBER INPUT
====================================================== */
// Voor alle number inputs
document.addEventListener('input', (e) => {
  const target = e.target;

  if (target.matches('input[type="number"]')) {
    // Als het negatief is, verwijder het teken
    if (target.value.startsWith('-')) {
      target.value = target.value.replace('-', '');
    }
  }
});

