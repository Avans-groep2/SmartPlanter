// main.js
import { createApp, reactive } from 'vue'
import { createPinia } from 'pinia';
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
app.config.globalProperties.$keycloak = keycloak

keycloak.init({ onLoad: initOptions.onLoad })
  .then(async auth => {
    if (!auth) {
      window.location.reload()
      return
    }

    console.log("Authenticated")

    app.use(router)
    app.use(vuetify)
    app.use(createPinia());

    router.isReady().then(() => app.mount('#app'))

  })
  .catch(() => console.error("Authentication Failed"))


