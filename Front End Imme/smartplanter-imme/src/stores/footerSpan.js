import { defineStore } from 'pinia'

export const useFooterSpan = defineStore('footerSpan', {
  state: () => ({
    firstName: '',
    lastName: '',
    email: '',
    keycloak: null,
  }),
  getters: {
    fullName: (state) => {
      const first = state.firstName || ''
      const last = state.lastName || ''
      return (first || last) ? `${first} ${last}`.trim() : 'Laden...'
    }
  },
  actions: {
    setKeycloak(kc) {
        this.keycloak = kc
        if (kc && kc.authenticated){
          this.fetchProfile();
        } 
    },

    async fetchProfile() {
    if (this.keycloak && this.keycloak.authenticated){
    try {
        const profile = await this.keycloak.loadUserProfile()
        this.firstName = profile.firstName || ''
        this.lastName = profile.lastName || ''
        this.email = profile.email || ''
    } catch (err) {
        console.warn('Gegevens laden is niet gelukt, terug naar token data', err);
        const token = this.keycloak.tokenParsed;
        if (token) {
          this.firstName = token.given_name || '';
          this.lastName = token.family_name || '';
          this.email = token.email || '';
        }
    }  
    }
  }
  }
})
