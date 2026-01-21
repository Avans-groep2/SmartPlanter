<template>

  <footer class="footer">
    <div class="accountNaam">
      <span class="username">{{ userStore.fullName }}</span> 
      <span class="email">{{ userStore.email }}</span>
    </div>

    <div class="links">
  <button class="logoutButton" @click="doLogout">
    <img src="../assets/logout.png" class="footerIcoon" alt="logout"/>
  </button>

  <div class="badge-container">
    <a href="mailto:ima.piels@student.avans.nl">
      <img src="../assets/mail.png" class="footerIcoon" alt="mail">
    </a>
    <span v-if="userStore.meldingenCount > 0" class="notification-badge">
      {{ userStore.meldingenCount }}
    </span>
  </div>
        
      <router-link to="/account" class="nav-item-settings"><img src="../assets/setting.png" class="footerIcoon" alt="settings"/></router-link>
      <router-link v-if="isBeheerder" to="/bradmin" class="nav-item-admin"><img src="../assets/security.png" class="footerIcoon" alt="admin"/></router-link>

    </div>
  </footer>
</template>

<script>
import router from '../Router/index';
import { computed } from 'vue';
import { useFooterSpan } from '@/stores/footerSpan';

export default {
  name: "FooterBar",
  setup() {
    const userStore = useFooterSpan()

    const isBeheerder = computed(() => {
      if (!userStore.keycloak) return false;

      return userStore.keycloak.hasRealmRole('beheerder') ||
        userStore.keycloak.hasResourceRole('beheerder', 'frontend-imme');
    });

    const doLogout = () => {
      if (userStore.keycloak) {
        userStore.keycloak.logout();
      }
    };
    
    return { userStore, doLogout, isBeheerder}

  }
}
</script>

<style>
.badge-container {
  position: relative;
  display: inline-block;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -8px;
  background-color: #ff4d4d; /* Fel rood */
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 14px;
  text-align: center;
  border: 2px solid #1f4936; /* Zelfde kleur als footer achtergrond */
  
  /* Omdat .links invert(1) heeft, moeten we dit bolletje TERUG inverting geven 
     zodat het rood blijft in plaats van cyaan/blauw te worden */
  filter: invert(1); 
  z-index: 10;
}


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

.nav-item-admin.router-link-active img {
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
