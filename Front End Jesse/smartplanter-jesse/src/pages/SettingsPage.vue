<template>
  <SidebarNavbar/>
  <div class="Settings">
    <WelcomeMessage/>

    <div class="themeContainer">
      <h2>Thema</h2>
      <div>
    <button @click="setLight" class="btnTheme lightTheme"></button>

    <button @click="setDark" class="btnTheme darkTheme"></button>
  </div>
      <h2>Accent Kleur</h2>
      <input type="color" id="colorPicker" v-model="primaryColor" @input="updatePrimaryColor">
     </div> 

     <div class="accountContainer">
      <h2>Account</h2>
        <div class="AccountLinks">
          <a href="https://141.148.237.73:8443/realms/smartplanter/account/">Wijzig Gebruikersnaam</a>
          <a href="https://141.148.237.73:8443/realms/smartplanter/login-actions/required-action?execution=UPDATE_PASSWORD&client_id=account-console&tab_id=Y5oKab4nKhc&client_data=eyJydSI6Imh0dHBzOi8vMTQxLjE0OC4yMzcuNzM6ODQ0My9yZWFsbXMvc21hcnRwbGFudGVyL2FjY291bnQvYWNjb3VudC1zZWN1cml0eS9zaWduaW5nLWluIiwicnQiOiJjb2RlIiwicm0iOiJxdWVyeSIsInN0IjoiY2IwYjZhODAtYmQwMC00YWI3LWFkZTEtNjljYTRjYmQzZmQ1In0">Wijzig Wachtwoord</a>
        </div>
     </div> 

     
     


  </div>
  
  
</template>

<script>
import WelcomeMessage from '@/components/WelcomeMessage.vue';
import SidebarNavbar from '../components/SidebarNavbar.vue';

export default {
  name: 'SettingsPage',
  components: {
    SidebarNavbar,
    WelcomeMessage
  },

  data() {
    return {
      primaryColor: '#5d00ff'
    }
  },

  mounted() {
    // accent kleur herstellen
    const savedColor = localStorage.getItem('primary-color');
    if (savedColor) {
      document.documentElement.style.setProperty('--primary', savedColor);
      this.primaryColor = savedColor;
    }

    // thema herstellen
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
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

  .themeContainer,
  .accountContainer {
    background: var(--light);
    width: 20rem;
    height: auto;
    border-radius: 15px;
    margin: 2rem 0 0 3rem;
    padding: 0.5rem;
  }

  .themeContainer h2,
  .accountContainer h2 {
    color: var(--text);
    font-size: 1.5rem;
  }

  .accountContainer a {
    text-decoration: none;
    cursor: pointer;
    color: var(--primary);
  }

  .themeContainer .btnTheme {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    margin: 0.1rem;
    border: 2px solid var(--icon);
  }

  .themeContainer .lightTheme {
    background: #fff;
  }

  .themeContainer .darkTheme {
    background: #000;
  }

  input {
    background: var(--light);
    border: var(--light);
  }

  .AccountLinks {
    display: flex;
    flex-direction: column;
  }

  .AccountLinks a:hover {
    font-weight: bold;
    transition: all 0.2s ease;
  }

</style>
