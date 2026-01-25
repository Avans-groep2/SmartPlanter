<template>
  <nav class="navbar">
    <div class="naamEnLogo">
      <img src="../assets/SmartplanterLogo.png" class="icoon" alt="logo">
      <span class="titel">Smartplanter</span>
    </div>

    <div class="navigatie">
      <router-link to="/home" class="nav-item">Moestuin</router-link>
      <router-link to="/notificaties" class="nav-item notification-link">
        <span>Meldingen</span>
          <span v-if="moestuinStore.meldingenCount > 0" class="meldingenBel">🔔</span>
      </router-link>
      <router-link to="/data" class="nav-item">Data</router-link>
    </div>
  </nav>
</template>

<script>
import { useMoestuinStore } from '../stores/moestuinScherm';
import { onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'NavBar',
  setup() {
    const moestuinStore = useMoestuinStore();
    let intervalId = null;

    onMounted(() => {
       moestuinStore.fetchMeldingenAction();

       const intervalId = setInterval(() => {
        moestuinStore.fetchMeldingenAction();
       }, 60000);
    })

    onBeforeUnmount(() => {
      if (intervalId) clearInterval(intervalId);
    });

    return { moestuinStore, intervalId };
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
  padding-right: 15px; 
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

.meldingenBel {
  margin-left: 5px;
  font-size: 1.2rem;
  /* Optioneel: animatie toevoegen zodat het opvalt */
  animation: ring 2s infinite;
  display: inline-block;
}

@keyframes ring {
  0% { transform: rotate(0); }
  10% { transform: rotate(15deg); }
  20% { transform: rotate(-15deg); }
  30% { transform: rotate(10deg); }
  40% { transform: rotate(-10deg); }
  50% { transform: rotate(0); }
  100% { transform: rotate(0); }
}
</style>
