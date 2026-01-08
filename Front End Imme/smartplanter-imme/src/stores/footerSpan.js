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
        if (kc) this.startAutoFetch()
    },

    async fetchProfile() {
    if (!this.keycloak) return
    try {
        const profile = await this.keycloak.loadUserProfile()
        this.firstName = profile.firstName || ''
        this.lastName = profile.lastName || ''
        this.email = profile.email || ''
    } catch (err) {
        console.error('Gebruiker kan niet geladen worden', err)
    }
    },
    startAutoFetch() {
        this.fetchProfile()
        if (this.intervalId) clearInterval(this.intervalId)
        this.intervalId = setInterval(() => {
            this.fetchProfile()
    }, 2000)    
    }
  }
})
