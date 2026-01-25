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
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';

export default {
  name: 'AccountBeheerder',
  
  setup() {
    const planterDataRaw = ref([]);
    const devicesRaw = ref([]);
    const loading = ref(true);

    const deviceIdKeuze = ref("");
    const plantenTellerKeuze = ref(0);
    const deviceNaamKeuze = ref("");
    const gekozenDeviceID = ref("");
    const gekozenUserId = ref("");

    const userDropdownOpen = ref(false);
    const deviceDropdownOpen = ref(false);

    const fetchAllData = async () => {
      try {
        loading.value = true;
        const [resPlanter, resDevices] = await Promise.all([
          fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter'),
          fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Devices')
        ]);
        planterDataRaw.value = await resPlanter.json();
        devicesRaw.value = await resDevices.json();
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        loading.value = false;
      }
    };

    // LOGICA VOOR DEVICES TABEL
    const opgeschoondeDevices = computed(() => {
      if (!Array.isArray(devicesRaw.value)) return [];
      return devicesRaw.value.map(obj => {
        const key = Object.keys(obj)[0];
        return key ? key.replace('TtnDeviceID', '').trim() : null;
      }).filter(id => id);
    });

    // LOGICA VOOR PLANTER TABEL
    const planterData = computed(() => {
      if (!Array.isArray(planterDataRaw.value)) return [];
      return planterDataRaw.value.map(obj => {
        let cleaned = { UserID: '?', DeviceID: '?', PlantenTeller: obj.PlantenTeller || 0, DeviceNaam: '' };
        Object.keys(obj).forEach(key => {
          if (key.includes('UserID')) {
            const split = key.replace('UserID', '').split('DeviceID');
            cleaned.UserID = split[0];
            cleaned.DeviceID = split[1] || cleaned.DeviceID;
          }
          if (key.includes('DeviceNaam')) {
            cleaned.DeviceNaam = key.replace('DeviceNaam', '');
          }
        });
        return cleaned;
      });
    });

    const uniekeUsers = computed(() => {
      const users = planterData.value.map(p => p.UserID).filter(u => u && u !== '?');
      return [...new Set(users)];
    });

    const insertNieuwDevice = async () => {
      if (!deviceIdKeuze.value) return alert("Vul een ID in");
      // Gebruik TtnDeviceID conform database screenshot
      const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Devices&TtnDeviceID=${encodeURIComponent(deviceIdKeuze.value.trim())}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Fout bij aanmaken");
        alert("Device aangemaakt!");
        deviceIdKeuze.value = "";
        await fetchAllData();
      } catch (err) { alert(err.message); }
    };

    const opslaanKoppeling = async () => {
      if (!gekozenUserId.value || !gekozenDeviceID.value) return alert("Kies user en device");
      const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Planter&UserID=${gekozenUserId.value}&DeviceID=${gekozenDeviceID.value}&PlantenTeller=${plantenTellerKeuze.value}&DeviceNaam=${encodeURIComponent(deviceNaamKeuze.value)}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Koppel fout");
        alert("Succesvol gekoppeld!");
        await fetchAllData();
      } catch (err) { alert(err.message); }
    };

    const toggleUserDropdown = () => { userDropdownOpen.value = !userDropdownOpen.value; deviceDropdownOpen.value = false; };
    const toggleDeviceDropdown = () => { deviceDropdownOpen.value = !deviceDropdownOpen.value; userDropdownOpen.value = false; };
    const selecteerUser = (u) => { gekozenUserId.value = u; userDropdownOpen.value = false; };
    const selecteerDevice = (d) => { gekozenDeviceID.value = d; deviceDropdownOpen.value = false; };

    onMounted(fetchAllData);

    return {
      planterData, loading, deviceIdKeuze, gekozenUserId, gekozenDeviceID, 
      opgeschoondeDevices, uniekeUsers, plantenTellerKeuze, deviceNaamKeuze,
      insertNieuwDevice, opslaanKoppeling, userDropdownOpen, deviceDropdownOpen,
      toggleUserDropdown, toggleDeviceDropdown, selecteerUser, selecteerDevice
    };
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