<template class="admin">
  <div class="deviceId">
    <h1 class="adminH1">Device Id kiezen:</h1>
    <div class="deviceKeuze">
        <input
        type="text"
        v-model="deviceIdKeuze"
        placeholder="Vul de device Id in..."
        />
        <button class="deviceKeuzenKnop" @click="bevestigNaam">Kies</button>
    </div>
    </div>

    <div class="accountKoppelen">
        <h1 class="adminH1">Selecteer Moestuin:</h1>
        <div class="moestuinKeuzeDropDown" ref="dropdown">
            <div class="dropdown-selected" @click="toggleDropdown">
                {{ gekozenMoestuin || 'Moestuin' }}
                <span class="dropDown">▼</span>
            </div>
            <div v-if="open" class="dropdownKeuzes">
                <div
                    v-for="moestuin in moestuinen"
                    :key="moestuin"
                    class="dropdownKeuze"
                    @click="selecteerMoestuin(moestuin)"
                    >{{ moestuin }}</div>
            </div>
        </div>
    </div>

</template>

<script>

export default {
  name: 'AccountBeheerder',
  components: {},
  data() {
    return {
        deviceIdKeuze: "",
        gekozenMoestuin: "",
        open: false,
        moestuinen: ["Moestuin 1", "Moestuin 2", "Moestuin 3"]
    };
  },
  methods: {
    bevestigDeviceId(){
      this.deviceIdKeuze = ""
    },

    toggleDropdown() {
        this.open = !this.open;
    },

    selecteerMoestuin(moestuin) {
        this.gekozenMoestuin = moestuin;
        this.moestuinStore.setMoestuin(moestuin);
        this.open = false;
    },

    handleClickOutside(event) {
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
.admin {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
  position: relative;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; 
}

.deviceId {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  max-width: 350px;
  min-height: 255px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}

.adminH1 {
  font-size: 30px;
  font-weight: 450;
}

.deviceKeuzenKnop {
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

.deviceKeuzenKnop:hover{
  filter: brightness(0.5);
  background-color: #2d6a4f;
}

.accountKoppelen {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  max-width: 350px;
  min-height: 255px;

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

.dropdownKeuzes {
  text-align: left;
  position: absolute;
  top: 105%;   
  width: 100%;
  border: 1px solid #2d6a4f;
  border-radius: 5px;
  overflow: hidden;
}

.dropdownKeuze {
  padding: 10px;
  font-size: 18px;
  color: #2d6a4f;
  cursor: pointer;
  background-color: white;
  transition: 0.15s ease;
}

.dropdownKeuze:hover {
  background-color: #2d6a4f;
  color: white;
}

</style>