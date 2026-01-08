import { defineStore } from 'pinia'
import Keycloak from 'keycloak-js'

export const useFooterSpan = defineStore('footerSpan', {
  state: () => ({
    firstName: '',
    lastName: '',
    email: ''
  }),
  getters: {
    fullName: (state) => {
      const first = state.firstName || ''
      const last = state.lastName || ''
      return (first || last) ? `${first} ${last}`.trim() : 'Onbekend'
    }
  },
  actions: {
    async fetchProfile(keycloak) {
      if (!keycloak) return
      try {
        const profile = await keycloak.loadUserProfile()
        this.firstName = profile.firstName || ''
        this.lastName = profile.lastName || ''
        this.email = profile.email || ''
      } catch (err) {
        console.error('Gebruiker kan niet geladen worden', err)
      }
    },
    startAutoFetch(keycloak) {
        this.fetchProfile(keycloak)
        setInterval(() => {
            this.fetchProfile(keycloak)
        }, 2000)
    }
  }
})
