<template class="admin">
  <div class="deviceIdAanmaken">
    <h1 class="adminH1">Device Id kiezen:</h1>
    <div class="deviceKeuze">
        <input
        type="text"
        v-model="deviceIdKeuze"
        placeholder="Vul de device Id in..."
        class="admin-input"
        />
        <button class="deviceKeuzenKnop" @click="insertNieuwDevice">Aanmaken</button>
    </div>

    <table class="deviceId-tabel">
      <thead>
        <tr>
          <th>Device ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="device in uniekeDevices"
            :key="device">
          <td>{{ device }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="UserIdKoppels">
    <h1 class="adminH1">Koppel hier de gebruiker met de deviceId</h1>

    <div class="koppelMaken">
      <div class="koppelsDropdown" ref="userDropdown">
        <div class="dropdown-selected" @click.stop="toggleUserDropdown">
          {{ gekozenUserId || 'Selecteer gebruiker' }}
          <span class="dropDown">▼</span>
        </div>
        <div v-if="userDropdownOpen" class="dropdownKeuzes">
          <div
            v-for="user in uniekeUsers"
            :key="user"
            class="dropdownKeuze"
            @click="selecteerUser(user)"
          >{{ user }}</div>
        </div>
      </div>

      <div class="koppelsDropdown" ref="deviceDropdown">
        <div class="dropdown-selected" @click.stop="toggleDeviceDropdown">
          {{ gekozenDeviceID || 'Selecteer Device' }}
          <span class="dropDown">▼</span>
        </div>
        <div v-if="deviceDropdownOpen" class="dropdownKeuzes">
          <div
            v-for="device in uniekeDevices"
            :key="device"
            class="dropddownKeuze"
            @click="selecteerDevice(device)"
          >{{ device }}</div>
        </div>
      </div>

      <input
        type="number"
        v-model="plantenTellerKeuze"
        placeholder="Aantal planten"
        class="admin-input klein"/>
      <input 
        type="text"
        v-model="deviceNaamKeuze"
        placeholder="Naam van device"
        class="admin-input"/>  

        <button class="koppelMakenKnop" @click="opslaanKoppeling">Koppel</button>
      </div>
        <p v-if="loading" class="koppelsLaden">Koppels worden geladen...</p>

        <table v-else class="koppelsTabel">
          <thead>
            <tr>
              <th>UseID</th>
              <th>DeviceID</th>
              <th>PlantenTeller</th>
              <th>DeviceNaam</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(planter, index) in planterData" :key="index">
              <td>{{ planter.UserID }}</td>
              <td>{{ planter.DeviceID }}</td>
              <td>{{ planter.PlantenTeller }}</td>
              <td>{{ planter.DeviceNaam }}</td>
            </tr>
        </tbody>
      </table>
    </div>
</template>

<script>

import {ref, onMounted, computed} from 'vue';

export default {
  name: 'AccountBeheerder',
  
  setup() {
    const planterData = ref([]);
    const loading = ref(true);

    const deviceIdKeuze = ref("");
    const plantenTellerKeuze = ref(0);
    const deviceNaamKeuze = ref("");
    const gekozenDeviceID = ref("");
    const gekozenUserId = ref("");

    const fetchPlanterData = async () => {
      try{
        loading.value = true;
        const response = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter');
        const data = await response.json();
        planterData.value = Array.isArray(data) ? data : [];
      } catch (error){
        console.error("Fout bij het ophalen van planterData", error);
      } finally {
        loading.value = false;
      }
    };

    const uniekeUsers = computed(() => {
      return[...new Set(planterData.value.map(p =>p.UserID))];
    });

    const uniekeDevices = computed(() => {
      return [...new Set(planterData.value.map(p => p.DeviceID))];
    });

    onMounted(() => {
      fetchPlanterData();
    });

    return {
      planterData, loading, deviceIdKeuze, gekozenUserId, gekozenDeviceID, 
      uniekeDevices, uniekeUsers, fetchPlanterData, plantenTellerKeuze, 
      deviceNaamKeuze
    };
  },

  data() {
    return {
      userDropdownOpen: false,
      deviceDropdownOpen: false
    };
  },
  methods: {
    toggleUserDropdown() {
      this.userDropdownOpen = !this.userDropdownOpen;
      this.deviceDropdownOpen = false;
    },
    toggleDeviceDropdown(){
      this.deviceDropdownOpen = !this.deviceDropdownOpen;
      this.userDropdownOpen = false;
    },
    selecteerUser(user) {
      this.gekozenUserId = user;
      this.userDropdownOpen = false;
    },
    selecteerDevice(device){
      this.gekozenDeviceID = device;
      this.deviceDropdownOpen = false;
    },

    async insertNieuwDevice(){
      if(!this.deviceIdKeuze) 
        return alert("Vul eerst een DeviceID in");

      const nieuwDevice = {
        DeviceID: this.deviceIdKeuze,
        UserID: "Nieuw",
        PlantenTeller: 0,
        DeviceNaam: "Nieuw Device"
      };

      try{ 
        const response = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(nieuwDevice)
      });

        if (response.ok) {
          alert("Device ID opgeslagen om database!");
          this.deviceIdKeuze = "";
          this.fetchPlanterData();
        }
      } catch (error) {
        console.error("Het DeviceID is niet opgeslagen", error);
      }
    },

    async opslaanKoppeling() {
      if (!this.gekozenUserId || !this.gekozenDeviceID) {
        return alert("Selecteer een gebruiker en een device");
      }
      const koppeling = {
        UserID: this.gekozenUserId,
        DeviceID: this.gekozenDeviceID,
        PlantenTeller: this.plantenTellerKeuze,
        DeviceNaam: this.deviceNaamKeuze
      };

      try {
        const response = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(koppeling)
        });

        if (response.ok) {
          alert("Koppeling succesvol opgeslagen!");
          this.fetchPlanterData(); 
        }
      } catch (error) {
        console.error("Fout bij koppelen:", error);
      }
    },

    handleClickOutside(event) {
      const uDrop = this.$refs.userDropdown;
      const dDrop = this.$refs.deviceDropdown;

      if (uDrop && !uDrop.contains(event.target) && dDrop && !dDrop.contains(event.target)) {
        this.userDropdownOpen = false;
        this.deviceDropdownOpen = false;
      }
    }
  },

    mounted() {
      document.addEventListener("click", this.handleClickOutside);
    },

    beforeUnmount() {
      document.removeEventListener("click", this.handleClickOutside);
    }
}

</script>

<style>
.koppelMaken {
  display: flex;
  flex-wrap: wrap; /* Zorgt dat het netjes blijft op kleine schermen */
  gap: 10px;
  align-items: center;
}

.admin-input.klein {
  width: 120px;
}

.admin {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
  position: relative;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; 
}

.adminH1{
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 1rem;
  color: black;
}

.deviceIdAanmaken, .UserIdKoppels {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.deviceKeuze, .koppelMaken {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
}

.admin-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 250px;
}

.koppelMakenKnop, .deviceKeuzenKnop {
  background-color: #2d6a4f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.koppelMakenKnop:hover {
  background-color: #1b4332;
}

.koppelsTabel, .deviceId-tabel {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.koppelsTabel th, .deviceId-tabel th {
  text-align: left;
  padding: 12px 8px;
  border-bottom: 2px solid #a7d3bf;
}

.koppelsTabel td, .deviceId-tabel td {
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
}

.koppelsDropdown {
  position: relative;
  width: 220px;
}

.dropdown-selected {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  background: white;
}

.dropdownKeuzes {
  position: absolute;
  top: 105%;
  width: 100%;
  border: 1px solid #ccc;
  background: white;
  z-index: 10;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.dropdownKeuze {
  padding: 10px;
  cursor: pointer;
}

.dropdownKeuze:hover {
  background-color: #2d6a4f;
  color: white;
}

.koppelsLaden {
  font-style: italic;
  color: #888;
}


</style>