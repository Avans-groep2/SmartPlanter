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
import { reactive, computed, onMounted, onBeforeUnmount, getCurrentInstance} from 'vue'

export default {
  name: "FooterBar",
  setup() {
    const internal = getCurrentInstance()
    const keycloak = internal.appContext.config.globalProperties.$keycloak

    const userProfile = reactive({
      firstName: "",
      lastName: "",
      email: ""
    })


    const fullName = computed(() => {
        return (userProfile.firstName || userProfile.lastName)
          ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
          : "Onbekend"
      })

    const email = computed(() => userProfile.email)

    const doLogout = () => {
      keycloak.logout()
    }

    let intervalId = null

    const fetchProfile = async () => {
      if (!keycloak) return
      try {
        const profile = await keycloak.loadUserProfile()
        userProfile.firstName = profile.firstName || ""
        userProfile.lastName = profile.lastName || ""
        userProfile.email = profile.email || ""
      } catch (err) {
        console.error("Kon user profile niet laden:", err)
      }
    }

    onMounted(() => {
      fetchProfile()
      intervalId = setInterval(fetchProfile, 30000)
    })

    onBeforeUnmount(() => {
      if (intervalId) clearInterval(intervalId)
    })

    return { fullName, email, doLogout }
  }
};
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
