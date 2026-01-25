<script setup>
import { computed, ref, onMounted, getCurrentInstance } from 'vue'

// Haal $auth op uit globalProperties
const { appContext } = getCurrentInstance()
const $auth = appContext.config.globalProperties.$auth

// Check of ingelogde gebruiker beheerder is
const isBeheerder = computed(() => $auth.user?.roles.includes('beheerder'))

// Meldingen
const notificationCount = ref(0)

async function fetchNotifications() {
  try {
    if (!$auth.user) return

    // Haal alle meldingen op
    const url = `https://smartplanters.dedyn.io:1880/smartplantdata?table=Meldingen`

    const response = await fetch(url)
    if (!response.ok) throw new Error('Fout bij ophalen meldingen')

    const data = await response.json()

    // Filter op ingelogde gebruiker
    const userId = $auth.user.id // of $auth.user.email als ID niet beschikbaar is
    const userMeldingen = data.filter(m => m.UserID === userId)

    // Stel het aantal meldingen in
    notificationCount.value = userMeldingen.length
  } catch (error) {
    console.error('Kon meldingen niet ophalen:', error)
    notificationCount.value = 0
  }
}

// Haal meldingen op bij mount
onMounted(() => {
  fetchNotifications()
})
</script>

<template>
  <div class="sidebar">
    <!-- LOGO -->
    <div class="logo">
      <i class="fa-solid fa-seedling"></i>
      <h1 class="logo-text">SmartPlanter</h1>
    </div>
    
    <!-- NAVIGATIE -->
    <nav>
      <ul>
        <li>
          <router-link to="/" class="nav-item">
            <i class="fa-solid fa-border-all"></i>
            <span class="label">Dashboard</span>
          </router-link>
        </li>

        <li>
          <router-link to="/notifications" class="nav-item">
            <i class="fa-solid fa-bell"></i>
            <span class="label">Meldingen</span>
          </router-link>
          <!-- Badge altijd zichtbaar -->
          <p 
            class="notificationCount" 
            :class="{ 'has-meldingen': notificationCount > 0 }"
          >
            {{ notificationCount }}
          </p>
        </li>

        <li>
          <router-link to="/data" class="nav-item">
            <i class="fa-solid fa-chart-column"></i>
            <span class="label">Data</span>
          </router-link>
        </li>

        <!-- ADMIN PAGE -->
        <li v-if="isBeheerder">
          <router-link to="/admin" class="nav-item">
            <i class="fa-solid fa-user-shield"></i>
            <span class="label">Admin</span>
          </router-link>
        </li>
      </ul>

      <ul>
        <li>
          <router-link to="/settings" class="nav-item">
            <i class="fa-solid fa-gear"></i>
            <span class="label">Instellingen</span>
          </router-link>
        </li>

        <li>
          <button class="nav-item" @click="$auth.logout()" style="padding: 0; margin: 0;">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span class="label">Loguit</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- PROFIEL -->
    <div class="profile">
      <div class="profilePicture">
        <span>{{ $auth.user?.firstLetter }}</span>
      </div>
      <div class="profileInfo">
        <span class="username">{{ $auth.user?.fullName }}</span>
        <span class="usermail">{{ $auth.user?.email }}</span>
      </div>
    </div>
  </div>
</template>

<style>
/* ================= SIDEBAR BASIS ================= */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100%;
  width: 4.5rem;
  display: flex;
  flex-direction: column;
  background: var(--light);
  box-shadow: 5px 0 10px rgba(0, 0, 0, 0.3);
  transition: width 0.3s ease;
  overflow: hidden;
  user-select: none;
  z-index: 1000;
  color: var(--text);  
  padding: 0; 
  margin: 0;
}

/* ================= LOGO ================= */
.logo {
  display: flex;
  align-items: center;
  height: 5rem;
  margin-left: 1rem;
}

.logo i {
  font-size: 30px;
  margin-right: 1rem;
  flex-shrink: 0;
  color: var(--icon);
}

.logo-text {
  font-size: 22px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: var(--text);
}

/* ================= NAVIGATIE ================= */
nav {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  padding-top: 0.5rem;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-left: 16px;
}

li {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 30px;
  font-weight: 500;
  background: none;
  border: none;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text);
}

.nav-item i {
  font-size: 30px;
  flex-shrink: 0;
  color: var(--icon);
}

.nav-item .label {
  font-size: 22px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-item.router-link-active,
.nav-item.router-link-active i {
  color: var(--primary);
}

/* ================= MELDING-BADGE ================= */
.notificationCount {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  font-weight: 600;
  margin-left: 0.5rem;
  background-color: var(--light); /* standaard neutraal */
  color: var(--light);
  transition: all 0.3s ease;
}

.notificationCount.has-meldingen {
  background-color: var(--danger); /* rood bij meldingen */
  color: var(--text);
}

/* ================= PROFIEL ================= */
.profile {
  display: flex;
  align-items: center;
  padding: 0.1rem;
  border-top: 2px solid var(--bg);
  transition: all 0.3s ease;
}

.profile .username,
.profile .usermail {
  color: var(--text);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profilePicture {
  width: 3.5rem;
  height: 3.5rem;
  margin: 0.5rem 0 0.5rem 0.25rem;
  border-radius: 50%;
  border: 2px solid;
  flex-shrink: 0;
  background: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  color: var(--primary-dark);
}

.profileInfo {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
}

/* ================= HOVER EFFECT ================= */
.sidebar:hover {
  width: 20rem;
}

.sidebar:hover .logo-text {
  opacity: 1;
}

.sidebar:hover .nav-item .label {
  opacity: 1;
}

.sidebar:hover .notificationCount {
  opacity: 1;
}

.sidebar:hover .username,
.sidebar:hover .usermail {
  opacity: 1;
}
</style>
