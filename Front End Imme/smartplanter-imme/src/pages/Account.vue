<template class="Account">

  <div class="accountknop">
    <a href="https://141.148.237.73:8443/realms/smartplanter/account/" class="settingsknop">Account aanpassen</a>
    <a href="https://141.148.237.73:8443/realms/smartplanter/protocol/openid-connect/auth?client_id=account-console&redirect_uri=https%3A%2F%2F141.148.237.73%3A8443%2Frealms%2Fsmartplanter%2Faccount%2Faccount-security%2Fsigning-in&state=8c3aac17-1241-4bd4-9de2-d11824f4ed4a&response_mode=query&response_type=code&scope=openid&nonce=898ca48e-a8a8-4ddc-8bf2-39a537423d6e&kc_action=UPDATE_PASSWORD&code_challenge=LnzxFopox0ypY48supME6ceKSjZy8OUotdIRR13--Io&code_challenge_method=S256" class="settingsknop">Wachtwoord aanpassen</a>
  </div>

  <div class="MoestuinKeuze">
    <h1>U werkt nu in:</h1>
    <div class="moestuinKeuzeDropDown" ref="dropdown">
      <div class="dropdown-selected" @click="toggleDropdown">
        {{ gekozenMoestuin || '- -' }}
        <span class="dropDown">▼</span>
      </div>

      <div v-if="open" class="dropdown-options">
        <div
          v-for="moestuin in moestuinen"
          :key="moestuin"
          class="dropdown-option"
          @click="selecteerMoestuin(moestuin)"
        >
          {{ moestuin }}
        </div>
      </div>
    </div>

    <div class="moestuinNaamContainer">
  <h1>Moestuin naam:</h1>

  <div class="inputButtonRow">
    <input
      type="text"
      v-model="moestuinNaam"
      placeholder="Vul de naam in..."
    />
    <button class="moestuinNaamButton" @click="bevestigNaam">OK</button>
  </div>

</div>

    </div>

  


</template>


<script>

export default {
  name: 'AccountPagina',
  components: { },

  data() {
    return {
      gekozenMoestuin: "",
      open: false,    
      moestuinen: ["Moestuin 1", "Moestuin 2", "Moestuin 3"],
      moestuinNaam: ""
    };
  },

  methods: {
    toggleDropdown() {
      this.open = !this.open;
    },

    selecteerMoestuin(moestuin) {
      this.gekozenMoestuin = moestuin;
      this.open = false; 
    },

    bevestigNaam() {
      console.log(this.moestuinNaam);
      this.moestuinNaam = "";
    },

     handleClickOutside(event) {
      // Klik buiten de dropdown?
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.open = false;
      }
    },
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }
  
};
</script>



<style>
.Account {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
  position: relative;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; 
}

#h1 {
  font-size: 20px;
  font-weight: 200%; 
  color:#2d6a4f;
}

.accountknop{
  margin-top: 2%;
  margin-left: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  padding: 12px;
  max-width: 350px;
  min-height: 300px;

  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}


.settingsknop {
  background-color: #2d6a4f;
  color: white;
  font-weight: 300;
  font-size: 25px;

  padding: 10px 50px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}

.settingsknop:hover {
  filter: brightness(0.5);
  background-color: #2d6a4f;
}

.MoestuinKeuze {
  margin-top: 2%;
  margin-left: 60%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  max-width: 350px;
  min-height: 300px;

  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}

.moestuinKeuzeDropDown {
  position: relative;
  width: 180px;
  margin-bottom: 25px;
}

.dropdown-selected {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid #2d6a4f;
  border-radius: 5px;
  padding: 10px;
  font-size: 18px;
  color: #2d6a4f;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-options {
  text-align: left;
  position: absolute;
  top: 105%;   
  width: 100%;
  border: 1px solid #2d6a4f;
  border-radius: 5px;
  overflow: hidden;
}

.dropdown-option {
  padding: 10px;
  font-size: 18px;
  color: #2d6a4f;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.925);
  transition: 0.15s ease;
}

.dropdown-option:hover {
  background-color: #2d6a4f;
  color: white;
}

.moestuinNaamContainer {       
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.moestuinNaamContainer input {
  width: 220px;
  padding: 10px;
  font-size: 18px;
  border: 1px solid #2d6a4f;   
  border-radius: 5px;
  outline: none;
  color: #2d6a4f;
}

.inputButtonRow {
  display: flex;
  align-items: center;
  gap: 5px;
}

.moestuinNaamButton {
  background-color: #2d6a4f;
  color: white;
  font-size: 15px;
  padding: 8px 15px; 
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
  width: auto; 
  height: 3rem;
  box-shadow:0 2px 8px rgba(0,0,0,0.25)  ;
}

.moestuinNaamButton:hover{
  filter: brightness(0.5);
  background-color: #2d6a4f;
}



</style> 
