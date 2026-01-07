<template>

  <footer class="footer">
    <div class="accountNaam">
      <span class="username">{{ fullName }}</span> 
      <span class="email">{{ email }}</span>
    </div>

    <div class="links">
      <button class="logoutButton" @click="doLogout"><img src="../assets/logout.png" class="footerIcoon" alt="logout"/></button>

      <a href="mailto:ima.piels@student.avans.nl">
        <img src="../assets/mail.png" class="footerIcoon" alt="mail"></img></a>
        
      <router-link to="/account" class="nav-item-settings"><img src="../assets/setting.png" class="footerIcoon" alt="settings"/></router-link>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterBar",
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      refreshInterval: null
    }
  },
  computed: {
    fullName() {
      if (this.firstName || this.lastName) {
        return `${this.firstName} ${this.lastName}`.trim()
      }
      return "Onbekend"
    }
  },
  mounted() {
    this.updateUserData()

    this.refreshInterval = setInterval(() => {
      this.updateUserData()
    }, 600000)
  },

  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },

  methods: {
    doLogout() {
      this.$keycloak.logout()
    },
    updateUserData() {
      const kc = this.$keycloak
      if (kc && kc.tokenParsed) {
        this.firstName = kc.tokenParsed.given_name || ""
        this.lastName = kc.tokenParsed.family_name || ""
        this.email = kc.tokenParsed.email || ""
      }
    }
  }
}
</script>

<style>
.footer {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  background: #1f4936;
  padding: 10px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color:white;
}

.footer {
  box-shadow: 0 -4px 25px rgba(0,0,0,0.25);
}

.footerIcoon{
  height: 30px;
  text-decoration: none;
  cursor: pointer;
  transition: filter 10.0s ease;
}


.footerIcoon:hover {
  filter: brightness(0.5);
  background-color: #fed9f0;
}

.navigatie{
  display: flex;
  gap: 2vh;
}

.nav-item-settings.router-link-active img {
  border-bottom: 2px solid #d968cc;
}

.links{
  margin-top: 0.7vh;
  margin-right: 5vh;
  display:flex;
  gap:20px;
  filter: invert(1);
}

.nav-item {
  margin-right: 2vh;
  font-size: 19px;
  text-decoration: none;
  font-weight: 600;
}

.username, .email {
  font-weight: 300;
  display: block;
}

.logoutButton{
  border: none;
  background-color: #ffffff00;
}
</style>
