import { defineStore } from 'pinia'
import keycloak from 'keycloak-js'

export const useFooterSpan = defineStore('footerSpan', {
  state: () => ({
    firstName: '',
    lastName: '',
    email: '',
    keycloak: null,
    intervalId: null
  }),
  getters: {
    fullName: (state) => {
      const first = state.firstName || ''
      const last = state.lastName || ''
      return (first || last) ? `${first} ${last}`.trim() : 'Onbekend'
    }
  },
  actions: {
    setKeycloak(kc) {
        this.keycloak = kc
        if (kc){
          this.fetchProfile();
          this.startAutoFetch();
        } 
    },

    async fetchProfile() {
    if (!this.keycloak || !this.keycloak.authenticated) return;
    try {
        const profile = await this.keycloak.loadUserProfile()
        this.firstName = profile.firstName || ''
        this.lastName = profile.lastName || ''
        this.email = profile.email || ''
    } catch (err) {
        console.warn('Gegevens laden is neit gelukt, terug naar token data', err);
        console.error('Gebruiker kan niet geladen worden', err);
        const token = this.keycloak.tokenParsed;
        if (token) {
          this.firstName = token.given_name || '';
          this.lastName = token.family_name || '';
          this.email = token.email || '';
        }
    }
    },
    startAutoFetch() {
        if (this.intervalId) clearInterval(this.intervalId)
        this.intervalId = setInterval(() => {
            this.fetchProfile()
    }, 3000)    
    }
  }
})
