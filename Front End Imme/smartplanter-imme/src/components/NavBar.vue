<template>
  <nav class="navbar">
    <div class="naamEnLogo">
      <img src="../assets/SmartplanterLogo.png" class="icoon" alt="logo">
      <span class="titel">Smartplanter</span>
    </div>

    <div class="navigatie">
      <router-link to="/home" class="nav-item">Moestuin</router-link>
      <router-link to="/notificaties" class="nav-item notification-link">Notificaties
        <span v-if="userStore.meldingenCount > 0" class="nav-badge">
          {{ userStore.meldingenCount }}
        </span>
      </router-link>
      <router-link to="/data" class="nav-item">Data</router-link>
    </div>
  </nav>
</template>

<script>
import { useMoestuinStore } from '../stores/moestuinScherm';

export default {
  name: 'NavBar',
  setup() {
    const userStore = useMoestuinStore();

    return { userStore };
  }
}
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  background: #2d6a4f;
  padding: 15px 25px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
   box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

.navigatie{
  display: flex;
  gap: 2vh;
}

.notification-link {
  position: relative;
  padding-right: 15px; /* Ruimte maken voor het bolletje */
}

.nav-badge {
  position: absolute;
  top: -8px;      /* Iets boven de tekst */
  right: -5px;     /* Iets naar rechts */
  background-color: #ff4d4d; /* Fel rood */
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 50%;
  min-width: 12px;
  height: 18px;
  display: flex;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 99;
}

/* Zorg dat het bolletje niet verdwijnt bij hover */
.nav-item:hover .nav-badge {
  filter: none; 
}

.nav-item {
  margin-right: 2vh;
  font-size: 19px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.5s ease;
}

.nav-item:hover {
  filter: brightness(0.5);
  color:#2d6a4f;
}

.nav-item.router-link-active {
  border-bottom: 2px solid #14a765;;
}

.naamEnLogo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icoon{
  height: 30px;
}

.titel {
  color: white;
  font-size: 28px;
  font-weight: 600;
}
</style>
