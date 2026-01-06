<template class="Account">

  <div class="account-container">
    <div class="inspiratieKnop"> 
    <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white";>? </a>
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

.account-container {
  display: flex;
  gap: 30px;
  margin-top: 2%;
  margin-left: 14px;
  align-items: flex-start;
}

.accountknop{
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  max-width: 350px;
  min-height: 255px;

  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}


.settingsknop {
  background-color: #2d6a4f;
  color: white;
  font-weight: 300;
  font-size: 25px;
  margin-bottom: 2px;
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
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  max-width: 350px;

  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}

@media (max-width: 768px) {
  .account-container {
    flex-direction: column;
    margin-left: 0;
    padding: 0 16px;
  }

  .accountknop,
  .MoestuinKeuze {
    max-width: 100%;
  }

  .settingsknop {
    font-size: 20px;
    padding: 10px 20px;
  }
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

.inspiratieKnop {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #2d6a4f;
    border: 3px solid #2d6a4f;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    right: 20px;
    bottom: 80px; 
    z-index: 1000;
    transition: background-color 0.2s;
}

.inspiratieKnop:hover {
  background-color: #3c803c;
}

</style> 
