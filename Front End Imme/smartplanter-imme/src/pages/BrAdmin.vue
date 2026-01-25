<template>
  <div class="admin">
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
          <tr v-for="(id, index) in opgeschoondeDevices" :key="index">
            <td>{{ id }}</td>
          </tr>
          <tr v-if="opgeschoondeDevices.length === 0 && !loading">
            <td>Geen devices gevonden in de database.</td>
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
import { ref, onMounted, computed } from 'vue';

export default {
  name: 'AdminPage',
  setup() {
    const devicesRaw = ref([]);
    const planterData = ref([]);
    const loading = ref(false);

    const deviceIdKeuze = ref("");
    const gekozenUserId = ref("");
    const gekozenDeviceID = ref("");
    const plantenTellerKeuze = ref(0); 
    const deviceNaamKeuze = ref("");

    const userDropdownOpen = ref(false);
    const deviceDropdownOpen = ref(false);

    const laadAlleData = async () => {
      loading.value = true;
      try {
        // GEBRUIK HTTPS (Cruciaal voor Azure!)
        const [resDev, resPlan] = await Promise.all([
          fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Devices'),
          fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter')
        ]);

        devicesRaw.value = await resDev.json();
        planterData.value = await resPlan.json();
      } catch (err) {
        console.error("Fout bij laden:", err);
      } finally {
        loading.value = false;
      }
    };

    const opgeschoondeDevices = computed(() => {
      // Map naar TtnDeviceID
      return devicesRaw.value.map(d => d.TtnDeviceID).filter(id => id);
    });

    const uniekeUsers = computed(() => {
      // Gebruik UserID
      const users = planterData.value.map(p => p.UserID);
      return [...new Set(users)].filter(u => u);
    });

    const insertNieuwDevice = async () => {
      if (!deviceIdKeuze.value.trim()) return alert("Vul een Device ID in");
      
      // Exacte parameter: TtnDeviceID
      const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Devices&TtnDeviceID=${encodeURIComponent(deviceIdKeuze.value.trim())}`;
      
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Server error");
        deviceIdKeuze.value = "";
        await laadAlleData();
        alert("Device toegevoegd!");
      } catch (err) {
        alert("Fout bij toevoegen: " + err.message);
      }
    };

    const opslaanKoppeling = async () => {
  if (!gekozenUserId.value || !gekozenDeviceID.value) {
    return alert("Selecteer eerst een gebruiker en device");
  }

  // LET OP: De hoofdletters hieronder zijn exact gelijk aan de databasekolommen
  const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Planter` +
              `&UserID=${encodeURIComponent(gekozenUserId.value)}` +
              `&DeviceID=${encodeURIComponent(gekozenDeviceID.value)}` +
              `&PlantenTeller=${plantenTellerKeuze.value}` +
              `&DeviceNaam=${encodeURIComponent(deviceNaamKeuze.value || 'Nieuwe Planter')}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.error) {
      // Als je nu een error krijgt, staat er precies WELK veld fout is
      alert("Database Error: " + data.code); 
    } else {
      // Reset velden na succes
      gekozenUserId.value = "";
      gekozenDeviceID.value = "";
      plantenTellerKeuze.value = 0;
      deviceNaamKeuze.value = "";
      await laadAlleData();
      alert("Koppeling succesvol!");
    }
  } catch (err) {
    alert("Netwerkfout bij koppelen. Check of je op HTTPS zit.");
  }
};

    // UI Logica voor dropdowns
    const toggleUserDropdown = () => {
      deviceDropdownOpen.value = false;
      userDropdownOpen.value = !userDropdownOpen.value;
    };
    const toggleDeviceDropdown = () => {
      userDropdownOpen.value = false;
      deviceDropdownOpen.value = !deviceDropdownOpen.value;
    };
    const selecteerUser = (u) => { gekozenUserId.value = u; userDropdownOpen.value = false; };
    const selecteerDevice = (d) => { gekozenDeviceID.value = d; deviceDropdownOpen.value = false; };

    onMounted(laadAlleData);

    return {
      devicesRaw, planterData, loading, deviceIdKeuze, gekozenUserId, 
      gekozenDeviceID, plantenTellerKeuze, deviceNaamKeuze,
      userDropdownOpen, deviceDropdownOpen, opgeschoondeDevices, 
      uniekeUsers, laadAlleData, insertNieuwDevice, opslaanKoppeling,
      toggleUserDropdown, toggleDeviceDropdown, selecteerUser, selecteerDevice
    };
  }
};
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