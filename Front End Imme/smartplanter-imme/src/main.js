import { createApp, reactive } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './Router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Keycloak from 'keycloak-js'
import { useFooterSpan } from './stores/footerSpan';

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(router)
app.use(vuetify)
const pinia = createPinia()
app.use(pinia)

const keycloak = new Keycloak({
  url: 'https://141.148.237.73:8443/',
  realm: 'smartplanter',
  clientId: 'frontend-imme',
  onLoad: 'login-required'
})
app.config.globalProperties.$keycloak = keycloak

keycloak.init({ onLoad: 'login-required' })
  .then(() => {
    window.$keycloak = keycloak;
    app.config.globalProperties.$keycloak = keycloak;
    console.log("Authenticated")
    const footerSpan = useFooterSpan()
    footerSpan.setKeycloak(keycloak) // ✅ start automatisch realtime updates
    router.isReady().then(() => app.mount('#app'))
  })
  .catch(err => console.error("Authentication Failed", err))
