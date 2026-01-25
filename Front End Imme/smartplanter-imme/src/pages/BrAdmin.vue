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
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(id, index) in opgeschoondeDevices" :key="index">
            <td>{{ id }}</td>
            <td>
              <button class="verwijderKnop" @click="verwijderDevice(id)">✖</button>
            </td>
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(planter, index) in planterData" :key="index">
            <td>{{ planter.UserID }}</td>
            <td>{{ planter.DeviceID }}</td>
            <td>{{ planter.PlantenTeller }}</td>
            <td>{{ planter.DeviceNaam }}</td>
            <td>
              <button class="verwijderKnop" @click="verwijderKoppeling(planter.UserID, planter.DeviceID)">✖</button>
            </td>
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
      return devicesRaw.value.map(d => d.TtnDeviceID).filter(id => id);
    });

    const uniekeUsers = computed(() => {
      const users = planterData.value.map(p => p.UserID);
      return [...new Set(users)].filter(u => u);
    });

const insertNieuwDevice = async () => {
  if (!deviceIdKeuze.value.trim()) return alert("Vul een Device ID in");
  
  const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Devices&ttnDeviceID=${encodeURIComponent(deviceIdKeuze.value.trim())}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.error) {
       alert("Database Error: " + data.code);
    } else {
      deviceIdKeuze.value = "";
      await laadAlleData(); 
      alert("Device succesvol toegevoegd!");
    }
  } catch (err) {
    alert("Fout bij device aanmaken: " + err.message);
  }
};

   const opslaanKoppeling = async () => {
  if (!gekozenUserId.value || !gekozenDeviceID.value) {
    return alert("Selecteer eerst een gebruiker en device");
  }

  const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Planter` +
              `&userID=${encodeURIComponent(gekozenUserId.value)}` +
              `&deviceID=${encodeURIComponent(gekozenDeviceID.value)}` +
              `&plantenTeller=${plantenTellerKeuze.value}` +
              `&deviceNaam=${encodeURIComponent(deviceNaamKeuze.value || 'Nieuwe Planter')}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.error) {
      alert("Database Error: " + data.code); 
    } else {
      alert("Koppeling succesvol!");
      gekozenUserId.value = "";
      gekozenDeviceID.value = "";
      plantenTellerKeuze.value = 0;
      deviceNaamKeuze.value = "";
      await laadAlleData();
    }
  } catch (err) {
    alert("Netwerkfout bij koppelen");
  }
};

/*const verwijderDevice = async (ttnID) => {
  if (!ttnID) return;

  // 1. Verwijder direct uit de lokale lijst (UI update zoals medestudent)
  devicesRaw.value = devicesRaw.value.filter((d) => d.TtnDeviceID !== ttnID);

  // 2. Stuur verzoek naar de specifieke 'cleardata' API
  const url = `https://smartplanters.dedyn.io:1880/cleardata?table=Devices&ttnDeviceID=${encodeURIComponent(ttnID)}`;
  
  fetch(url, { method: "GET" });

  // 3. Melding aan de gebruiker
  alert("Device succesvol verwijderd");
}; */

const verwijderDevice = async (ttnID) => {
  if (!ttnID) return;
  if (!confirm(`Weet je zeker dat je device ${ttnID} wilt verwijderen?`)) return;

  // De URL parameter moet EXACT matchen met je Node-RED 'Delete' node
  // Probeer 'deviceID' als 'ttnDeviceID' een 400 error gaf
  const url = `https://smartplanters.dedyn.io:1880/cleardata?table=Devices&deviceID=${encodeURIComponent(ttnID)}`;
  
  try {
    const res = await fetch(url, { method: "GET" });
    
    if (res.ok) {
      // Pas NA een succesvolle response de UI bijwerken
      devicesRaw.value = devicesRaw.value.filter((d) => d.TtnDeviceID !== ttnID);
      alert("Device definitief verwijderd uit database");
    } else {
      alert("Server fout: Device kon niet worden verwijderd.");
    }
  } catch (err) {
    console.error("Netwerkfout:", err);
    alert("Kon geen verbinding maken met de server.");
  }
};

const verwijderKoppeling = async (userID, deviceID) => {
  if (!userID || !deviceID) return;

  const url = `https://smartplanters.dedyn.io:1880/cleardata?table=Planter&userID=${encodeURIComponent(userID)}&deviceID=${encodeURIComponent(deviceID)}`;
  
  try {
    const res = await fetch(url, { method: "GET" });

    if (res.ok) {
      // UI alleen filteren als de database-actie gelukt is
      planterData.value = planterData.value.filter((p) => !(p.UserID === userID && p.DeviceID === deviceID));
      alert("Koppeling succesvol verwijderd");
    } else {
      alert("Fout bij verwijderen: Database niet bijgewerkt.");
    }
  } catch (err) {
    alert("Netwerkfout bij het verwijderen van de koppeling.");
  }
};

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
      gekozenDeviceID, plantenTellerKeuze, deviceNaamKeuze, verwijderDevice,
      verwijderKoppeling,
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
  flex-wrap: wrap; 
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

.delete-btn {
  background-color: #bc4749;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.delete-btn:hover {
  background-color: #a33b3d;
}

.koppelsTabel th:last-child, 
.deviceId-tabel th:last-child {
  text-align: right;
  width: 50px;
}
</style>