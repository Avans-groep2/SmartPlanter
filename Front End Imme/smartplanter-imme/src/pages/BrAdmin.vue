<template>
  <div class="admin-page">
    <SidebarNavbar />
    
    <div class="content-container">
      <WelcomeMessage />

      <div class="admin-card">
        <div class="input-header">
          <input 
            v-model="newDeviceId" 
            placeholder="Device ID" 
            class="styled-input"
          />
          <button @click="addDevice" class="btn-submit">Aanmaken</button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Device ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(device, index) in devices" :key="index">
              <td>{{ device.TtnDeviceID }}</td>
            </tr>
            <tr v-if="devices.length === 0">
              <td class="empty-row">Geen devices gevonden...</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="admin-card">
        <div class="input-header multi-input">
          <select v-model="selectedUserID" class="styled-input">
            <option value="" disabled>Selecteer User</option>
            <option v-for="user in uniqueUserIDs" :key="user" :value="user">
              {{ user }}
            </option>
          </select>

          <select v-model="selectedDeviceID" class="styled-input">
            <option value="" disabled>Selecteer Device</option>
            <option v-for="device in devices" :key="device.TtnDeviceID" :value="device.TtnDeviceID">
              {{ device.TtnDeviceID }}
            </option>
          </select>

          <input v-model="selectedPlantenTeller" type="number" placeholder="PlantenTeller" class="styled-input" />
          <input v-model="selectedDeviceNaam" placeholder="Device Naam" class="styled-input" />
          
          <button @click="koppel" class="btn-submit">Koppelen</button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>UserID</th>
              <th>DeviceID</th>
              <th>PlantenTeller</th>
              <th>DeviceNaam</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(planter, index) in planters" :key="index">
              <td>{{ planter.UserID }}</td>
              <td>{{ planter.DeviceID }}</td>
              <td>{{ planter.PlantenTeller }}</td>
              <td>{{ planter.DeviceNaam }}</td>
            </tr>
            <tr v-if="planters.length === 0">
              <td colspan="4" class="empty-row">Geen planters gevonden</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import WelcomeMessage from "@/components/WelcomeMessage.vue";
import SidebarNavbar from "@/components/SidebarNavbar.vue";

export default {
  name: "AdminPage",
  components: { SidebarNavbar, WelcomeMessage },
  
  data() {
    return {
      devices: [],
      newDeviceId: "",
      planters: [],
      selectedUserID: "",
      selectedDeviceID: "",
      selectedPlantenTeller: "",
      selectedDeviceNaam: ""
    };
  },

  computed: {
    uniqueUserIDs() {
      // Haalt unieke users uit de planters lijst voor de dropdown
      return [...new Set(this.planters.map(p => p.UserID))];
    }
  },

  mounted() {
    this.refreshData();
  },

  methods: {
    async refreshData() {
      try {
        // Ophalen Devices
        const devRes = await fetch('http://smartplanters.dedyn.io:1880/smartplantdata?table=Devices');
        this.devices = await devRes.json();

        // Ophalen Planters
        const planRes = await fetch('http://smartplanters.dedyn.io:1880/smartplantdata?table=Planter');
        this.planters = await planRes.json();
      } catch (err) {
        console.error("Fout bij ophalen data:", err);
      }
    },

    async addDevice() {
      if (!this.newDeviceId.trim()) return;
      
      const url = `http://smartplanters.dedyn.io:1880/smartplantadd?table=Devices&ttndeviceid=${this.newDeviceId}`;
      
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Fout bij toevoegen');
        
        this.newDeviceId = ""; // Reset veld
        await this.refreshData(); // Tabel verversen
      } catch (err) {
        alert("Device kon niet worden toegevoegd");
      }
    },

    async koppel() {
      if (!this.selectedUserID || !this.selectedDeviceID) return;

      const url = `http://smartplanters.dedyn.io:1880/smartplantadd?table=Planter&userid=${this.selectedUserID}&deviceid=${this.selectedDeviceID}&plantenteller=${this.selectedPlantenTeller}&devicenaam=${this.selectedDeviceNaam}`;
      
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Fout bij koppelen');
        
        await this.refreshData(); // Tabel verversen
      } catch (err) {
        alert("Planter kon niet worden toegevoegd");
      }
    }
  }
};
</script>

<style scoped>
.admin-page {
  background-color: #f9f9f9;
  min-height: 100vh;
  display: flex;
}

.content-container {
  flex: 1;
  padding: 40px;
}

.admin-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.input-header {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
  align-items: center;
}

.styled-input {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.btn-submit {
  background-color: #3e8e53; /* De groene kleur uit je screenshot */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-submit:hover {
  background-color: #347a46;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 2px solid #333;
  font-weight: 700;
}

.admin-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  color: #444;
}

.empty-row {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>