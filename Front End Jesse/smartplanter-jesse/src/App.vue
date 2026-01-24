<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      userID: "",
      keycloakReady: false
    };
  },
  async mounted() {
    // Wacht tot Keycloak beschikbaar is
    await this.waitForKeycloak();

    if (this.keycloakReady && this.$keycloak.authenticated) {
      // Pak userID
      this.userID = this.$keycloak.tokenParsed.sub;

      // Stuur GET request om userID toe te voegen
      this.addUserIfNotExists();
    }
  },
  methods: {
    logout() {
      this.$keycloak.logout();
    },

    // Functie die wacht tot Keycloak geladen is
    waitForKeycloak() {
      return new Promise((resolve) => {
        const check = () => {
          if (this.$keycloak && this.$keycloak.authenticated !== undefined) {
            this.keycloakReady = true;
            resolve();
          } else {
            // Blijf controleren elke 50ms
            setTimeout(check, 50);
          }
        };
        check();
      });
    },

    async addUserIfNotExists() {
      if (!this.userID) return;

      const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Users&userID=${encodeURIComponent(this.userID)}`;

      try {
        const res = await fetch(url);

        if (res.ok) {
          console.log(`✅ UserID "${this.userID}" is toegevoegd of bestaat al`);
        } else {
          console.error(`❌ Fout bij toevoegen UserID: ${res.statusText}`);
        }
      } catch (err) {
        console.error("Fout bij fetch:", err);
      }
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

body,
#app {
  font-family: "Poppins", sans-serif;
  background: var(--bg);
  margin: 0;
  padding: 0;
}

* {
  transition: background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}

::selection {
  background-color: var(--primary);
  color: var(--primary-dark);
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: var(--primary-dark);
}
::-webkit-scrollbar-thumb {
  background: var(--primary);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}
</style>
