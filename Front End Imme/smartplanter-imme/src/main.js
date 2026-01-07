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

keycloak.init({ onLoad: initOptions.onLoad })
  .then(async auth => {
    if (!auth) {
      window.location.reload()
      return
    }

    console.log("Authenticated")

    const profile = await keycloak.loadUserProfile()
    userProfile.firstName = profile.firstName || ""
    userProfile.lastName = profile.lastName || ""
    userProfile.email = profile.email || ""

    app.use(router)
    app.use(vuetify)

    router.isReady().then(() => app.mount('#app'))

  })
  .catch(() => console.error("Authentication Failed"))


