<template class="Account">

  <div class="accountknop">
    <a href="https://141.148.237.73:8443/realms/smartplanter/account/" class="settingsknop">Account setting</a>
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
  font-size: 25px;
  font-weight: 200%; 
}

.settingsknop {
  margin-left: 14px;
  margin-top: 30px;
  max-width: 350px;

  display: flex;

  background-color: #2d6a4f;
  color: white;

  font-weight: 400;
  font-size: 25px;
  padding: 10px 60px;
  /*border: none;*/
  border-radius: 25px;
  cursor: pointer;
  transition: 0.2s ease;
  /*align-self: flex-start;
  align-self: start;*/
  box-shadow:0 2px 8px rgba(0,0,0,0.25) ;

}

.settingsknop:hover {
  filter: brightness(0.5);
  background-color: #2d6a4f;
}

.MoestuinKeuze {
  margin-top: 50px;
  margin-left: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  padding: 12px;
  max-width: 350px;

  background-color: rgba(255, 255, 244, 0.63);
  border-radius: 8px;
  box-shadow:0 2px 8px rgba(0,0,0,0.25) ;
}

.moestuinKeuzeDropDown {
  position: relative;
  width: 180px;
  margin-bottom: 20px;
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
  color: #2d6a4f;
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
