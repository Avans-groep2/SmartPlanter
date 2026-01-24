<template>
  <div class="admin">
    <div class="deviceIdAanmaken admin-card">
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
          <tr v-for="(id, index) in opgeschoondeDevices" :key="index">
            <td>{{ id }}</td>
          </tr>
          <tr v-if="opgeschoondeDevices.length === 0 && !loading">
            <td>Geen devices gevonden in de database.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="UserIdKoppels admin-card">
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
              v-for="id in opgeschoondeDevices"
              :key="id"
              class="dropdownKeuze"
              @click="selecteerDevice(id)"
            >{{ id }}</div>
          </div>
        </div>

        <input type="number" v-model="plantenTellerKeuze" placeholder="Planten" class="admin-input klein"/>
        <input type="text" v-model="deviceNaamKeuze" placeholder="Naam van device" class="admin-input"/> 

        <button class="koppelMakenKnop" @click="opslaanKoppeling">Koppel</button>
      </div>

      <p v-if="loading" class="koppelsLaden">Koppels worden geladen...</p>

      <table v-else class="koppelsTabel">
        <thead>
          <tr>
            <th>UserID</th>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Data opslag
      devicesRaw: [],    // Ruwe data van de API
      planterData: [],   // Data voor de onderste tabel
      loading: false,

      // Formulier velden
      deviceIdKeuze: "",
      gekozenUserId: "",
      gekozenDeviceID: "",
      plantenTellerKeuze: null,
      deviceNaamKeuze: "",

      // UI State (Dropdowns)
      userDropdownOpen: false,
      deviceDropdownOpen: false
    };
  },

  computed: {
    // Maakt een schone lijst van alleen de IDs voor de bovenste tabel en dropdown
    opgeschoondeDevices() {
      return this.devicesRaw.map(d => d.TtnDeviceID).filter(id => id);
    },
    // Haalt unieke UserIDs uit de bestaande koppelingen voor de dropdown
    uniekeUsers() {
      const users = this.planterData.map(p => p.UserID);
      return [...new Set(users)].filter(u => u);
    }
  },

  mounted() {
    this.laadAlleData();
    // Sluit dropdowns als je buiten de dropdown klikt
    window.addEventListener('click', () => {
      this.userDropdownOpen = false;
      this.deviceDropdownOpen = false;
    });
  },

  methods: {
    async laadAlleData() {
      this.loading = true;
      try {
        // API van je collega ophalen
        const [resDev, resPlan] = await Promise.all([
          fetch('http://smartplanters.dedyn.io:1880/smartplantdata?table=Devices'),
          fetch('http://smartplanters.dedyn.io:1880/smartplantdata?table=Planter')
        ]);

        this.devicesRaw = await resDev.json();
        this.planterData = await resPlan.json();
      } catch (err) {
        console.error("Fout bij laden:", err);
      } finally {
        this.loading = false;
      }
    },

    async insertNieuwDevice() {
      if (!this.deviceIdKeuze.trim()) return;
      
      const url = `http://smartplanters.dedyn.io:1880/smartplantadd?table=Devices&ttndeviceid=${this.deviceIdKeuze}`;
      
      try {
        const res = await fetch(url);
        if (res.ok) {
          this.deviceIdKeuze = "";
          await this.laadAlleData(); // Ververs de tabellen
        }
      } catch (err) {
        alert("Kon device niet toevoegen");
      }
    },

    async opslaanKoppeling() {
      if (!this.gekozenUserId || !this.gekozenDeviceID) {
        alert("Selecteer eerst een gebruiker en device");
        return;
      }

      const url = `http://smartplanters.dedyn.io:1880/smartplantadd?table=Planter&userid=${this.gekozenUserId}&deviceid=${this.gekozenDeviceID}&plantenteller=${this.plantenTellerKeuze}&devicenaam=${this.deviceNaamKeuze}`;
      
      try {
        const res = await fetch(url);
        if (res.ok) {
          // Reset formulier
          this.gekozenUserId = "";
          this.gekozenDeviceID = "";
          this.plantenTellerKeuze = null;
          this.deviceNaamKeuze = "";
          await this.laadAlleData();
        }
      } catch (err) {
        alert("Koppelen mislukt");
      }
    },

    // UI Functies voor de dropdowns
    toggleUserDropdown() {
      this.deviceDropdownOpen = false;
      this.userDropdownOpen = !this.userDropdownOpen;
    },
    toggleDeviceDropdown() {
      this.userDropdownOpen = false;
      this.deviceDropdownOpen = !this.deviceDropdownOpen;
    },
    selecteerUser(user) {
      this.gekozenUserId = user;
      this.userDropdownOpen = false;
    },
    selecteerDevice(id) {
      this.gekozenDeviceID = id;
      this.deviceDropdownOpen = false;
    }
  }
};
</script>

<style scoped>
/* Gebruik de styling uit je screenshot */
.admin { padding: 40px; background-color: #f9f9f9; min-height: 100vh; }
.admin-card { 
  background: white; 
  padding: 30px; 
  border-radius: 15px; 
  margin-bottom: 30px; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.05); 
}
.adminH1 { font-size: 24px; margin-bottom: 20px; color: #333; }

/* Tabel styling volgens screenshot 2 */
table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th { text-align: left; padding: 12px; border-bottom: 2px solid #333; font-weight: bold; }
td { padding: 12px; border-bottom: 1px solid #eee; }

/* Inputs & Knoppen */
.admin-input { 
  padding: 10px; 
  border: 1px solid #ccc; 
  border-radius: 8px; 
  margin-right: 10px;
}
.klein { width: 100px; }
.deviceKeuzenKnop, .koppelMakenKnop { 
  background-color: #3e8e53; 
  color: white; 
  border: none; 
  padding: 10px 20px; 
  border-radius: 8px; 
  cursor: pointer; 
}

/* Custom Dropdown Styling */
.koppelsDropdown { position: relative; display: inline-block; margin-right: 10px; cursor: pointer; }
.dropdown-selected { 
  background: white; 
  border: 1px solid #ccc; 
  padding: 10px 15px; 
  border-radius: 8px; 
  min-width: 150px; 
}
.dropdownKeuzes { 
  position: absolute; 
  top: 100%; 
  left: 0; 
  width: 100%; 
  background: white; 
  border: 1px solid #ccc; 
  z-index: 10; 
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.dropdownKeuze { padding: 10px; border-bottom: 1px solid #eee; }
.dropdownKeuze:hover { background-color: #f0f0f0; }
</style>