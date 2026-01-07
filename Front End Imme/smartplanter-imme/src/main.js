// main.js
import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './Router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Keycloak from 'keycloak-js'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

const initOptions = {
  url: 'https://141.148.237.73:8443/',
  realm: 'smartplanter',
  clientId: 'frontend-imme',
  onLoad: 'login-required'
}

const keycloak = new Keycloak(initOptions)

const userProfile = reactive({
  firstName: "",
  lastName: "",
  email: ""
})

app.config.globalProperties.$keycloak = keycloak
app.config.globalProperties.$userProfile = userProfile
window.$keycloak = keycloak
window.$userProfile = userProfile

keycloak.init({ onLoad: initOptions.onLoad })
  .then(async auth => {
    if (!auth) {
      window.location.reload()
      return
    }

    console.log("Authenticated")

    await updateUserProfile()

    app.use(router)
    app.use(vuetify)

    router.isReady().then(() => app.mount('#app'))

    setInterval(async () => {
      try {
        const ref = await keycloak.updateToken(70)
        if (ref) console.log("Token refreshed")
        await updateUserProfile()
      } catch (err) {
        console.error("Failed to refresh token or profile:", err)
      }
    }, 60000) 
  })
  .catch(() => console.error("Authentication Failed"))


async function updateUserProfile() {
  try {
    const profile = await keycloak.loadUserProfile()
    userProfile.firstName = profile.firstName || ""
    userProfile.lastName = profile.lastName || ""
    userProfile.email = profile.email || ""
  } catch (err) {
    console.error("Kon user profile niet laden:", err)
    const token = keycloak.tokenParsed || {}
    userProfile.firstName = token.given_name || ""
    userProfile.lastName = token.family_name || ""
    userProfile.email = token.email || ""
  }
}
