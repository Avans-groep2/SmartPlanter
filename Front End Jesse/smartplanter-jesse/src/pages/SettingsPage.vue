<template>
  <SidebarNavbar/>
  <div class="Settings">
    <header>
      <WelcomeMessage/>
      <PlantSelector 
        v-model="selectedDeviceId" 
        ref="plantSelector" 
        :key="plantSelectorKey" 
      />
    </header>

    <div class="settingsContainer">
      <h2>Thema</h2>
      <div>
        <button @click="setLight" class="btnTheme lightTheme"></button>
        <button @click="setDark" class="btnTheme darkTheme"></button>
      </div>

      <h2>Accent Kleur</h2>
      <input class="colorInput" type="color" id="colorPicker" v-model="primaryColor" @input="updatePrimaryColor">
    </div> 

    <div class="settingsContainer">
      <h2>Plantenbak</h2>
      <div class="divColumn">
        <input type="text" class="inputText" v-model="planterName" @keyup.enter="updatePlanterName">
        <button @click="updatePlanterName">Wijzigen</button>
      </div>
    </div> 

    <div class="settingsContainer">
      <h2>Account</h2>
      <div class="divColumn">
        <a href="https://141.148.237.73:8443/realms/smartplanter/account/">Wijzig Gebruikersnaam en Email</a>
        <a href="https://141.148.237.73:8443/realms/smartplanter/login-actions/required-action?execution=UPDATE_PASSWORD&client_id=account-console&tab_id=Y5oKab4nKhc&client_data=eyJydSI6Imh0dHBzOi8vMTQxLjE0OC4yMzcuNzM6ODQ0My9yZWFsbXMvc21hcnRwbGFudGVyL2FjY291bnQvYWNjb3VudC1zZWN1cml0eS9zaWduaW5nLWluIiwicnQiOiJjb2RlIiwicm0iOiJxdWVyeSIsInN0IjoiY2IwYjZhODAtYmQwMC00YWI3LWFkZTEtNjljYTRjYmQzZmQ1In0">Wijzig Wachtwoord</a>
      </div>
    </div> 
  </div>
</template>

<script>
import WelcomeMessage from '@/components/WelcomeMessage.vue';
import SidebarNavbar from '../components/SidebarNavbar.vue';
import PlantSelector from '@/components/PlantSelector.vue';

export default {
  name: 'SettingsPage',
  components: {
    SidebarNavbar,
    WelcomeMessage,
    PlantSelector
  },

  data() {
    return {
      primaryColor: '#337a3d',
      planterName: '',
      selectedDeviceId: null,
      plantSelectorKey: 0
    }
  },

  mounted() {
    // Accent kleur herstellen
    const savedColor = localStorage.getItem('primary-color');
    if (savedColor) {
      document.documentElement.style.setProperty('--primary', savedColor);
      this.primaryColor = savedColor;
    }

    // Thema herstellen
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Planternaam ophalen uit localStorage
    const savedPlanterName = localStorage.getItem('chosenDeviceName');
    if (savedPlanterName) {
      this.planterName = savedPlanterName;
    }
  },

  methods: {
    setLight() {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    },

    setDark() {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    },

    updatePrimaryColor() {
      document.documentElement.style.setProperty('--primary', this.primaryColor);
      localStorage.setItem('primary-color', this.primaryColor);
    },

    updatePlanterName() {
  const selectedID = localStorage.getItem('chosenDeviceId');

  if (!selectedID) {
    this.$toast("Geen planter geselecteerd","error");
    return;
  }

  // Fire-and-forget fetch naar backend
  const url = `https://smartplanters.dedyn.io:1880/harvest?table=Planter&userID=tester&deviceID=${selectedID}&deviceNaam=${encodeURIComponent(this.planterName)}`;
  fetch(url);

  // Update localStorage zodat naam behouden blijft
  localStorage.setItem('chosenDeviceName', this.planterName);

  // Update PlantSelector **opties direct**
  if (this.$refs.plantSelector && this.$refs.plantSelector.updateOptionName) {
    // roep een method aan in PlantSelector om de naam van de geselecteerde planter te wijzigen
    this.$refs.plantSelector.updateOptionName(selectedID, this.planterName);
  }

  // Toast tonen
  this.$toast("Planternaam succesvol gewijzigd","success");
}
  }
}
</script>

<style>
.Settings {
    min-height: 100vh;
    width: auto;
    margin-left: 5rem;
    overflow-y: hidden;
    overflow-x: hidden;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 1rem;
}

.settingsContainer {
    background: var(--light);
    width: 20rem;
    height: auto;
    border-radius: 15px;
    margin: 2rem 0 0 3rem;
    padding: 0.5rem;
}

.settingsContainer h2 {
    color: var(--text);
    font-size: 1.5rem;
    margin: 0.5rem;
}

.settingsContainer a {
    text-decoration: none;
    cursor: pointer;
    color: var(--primary);
}

.settingsContainer .btnTheme {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    margin: 0.1rem;
    border: 2px solid var(--icon);
}

.settingsContainer .lightTheme {
    background: #fff;
}

.settingsContainer .darkTheme {
    background: #000;
}

.settingsContainer input {
    background: var(--light);
    border: var(--light);
}

.settingsContainer .inputText {
    background: var(--inputbg);
    border-radius: 20px;    
    font-size: 1.2rem;
    padding: 0.2rem 0.4rem;
    color: var(--text);
}

.settingsContainer button {
    background: var(--primary);
    color: var(--text);
    border: none;
    border-radius: 20px;
    padding: 0.2rem 0.4rem;
    font-size: 1.2rem;
    cursor: pointer;   
}

.settingsContainer .colorInput {
  width: 2rem;               /* zelfde als btnTheme */
  height: 2rem;
  border-radius: 50%;        /* rond */
  border: 2px solid var(--primary-dark);
  padding: 0;                 /* padding reset */
  cursor: pointer;
  -webkit-appearance: none;   /* Chrome/Safari */
  appearance: none;           /* alle browsers */
  background: none;           /* verwijdert default bg */
}

/* Chrome, Safari */
.settingsContainer .colorInput::-webkit-color-swatch-wrapper {
  padding: 0;                 
  border-radius: 50%;         
  border: none;               
}

.settingsContainer .colorInput::-webkit-color-swatch {
  border-radius: 50%;         /* rond */
  border: none;
}

/* Firefox */
.settingsContainer .colorInput::-moz-color-swatch {
  border-radius: 50%;
  border: none;
}


.divColumn {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.divColumn a:hover {
    font-weight: bold;
    transition: all 0.1s ease;
}
</style>
