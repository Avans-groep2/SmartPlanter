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
import { allowedVariants } from 'vuetify/lib/labs/VVideo/VVideoControls';

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
      console.log("Authenticated");
      footerSpan.fetchProfile();

      const verversGegevens = async () => {
        try{
          const refreshed = await keycloak.updateToken(-1);
          await footerSpan.fetchProfile();
          if (refreshed) {
            console.log("Token vernieuwd met vernieuwde keycloak gegevens")
          }
          await footerSpan.fetchProfile();
        } catch (error) {
          console.error("Kon profiel gegevens niet verversen", error)
        }
      };

      window.addEventListener('focus', () => {
        verversGegevens();
      });

      keycloak.onTokenExpired = () => {
        verversGegevens();
      };

      setInterval(() => {
        keycloak.updateToken(30).then((refreshed) => {
          if (refreshed) {
            footerSpan.fetchProfile();
          }
        });
      }, 20000);

      router.isReady().then(() => app.mount('#app'))
    }
  })
  .catch(err => console.error("Authentication Failed", err))