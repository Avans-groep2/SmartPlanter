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

keycloak.init({ onLoad: 'login-required', checkLoginFrame: false })
  .then((authenticated) => {
    if (authenticated) {
      window.$keycloak = keycloak;
      const footerSpan = useFooterSpan()
      footerSpan.setKeycloak(keycloak)

      // Ververs token automatisch als deze bijna verloopt
      keycloak.onTokenExpired = () => {
        keycloak.updateToken(70).then((refreshed) => {
          if (refreshed) {
            footerSpan.fetchProfile(); // Update de store met nieuwe token data
          }
        }).catch(() => {
          console.error('Sessie verlopen');
        });
      };

      router.isReady().then(() => app.mount('#app'))
    }
  })
  .catch(err => console.error("Authentication Failed", err))