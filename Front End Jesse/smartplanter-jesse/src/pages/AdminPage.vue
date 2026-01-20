<template>
  <SidebarNavbar />

  <div class="Admin">
    <WelcomeMessage />

    <!-- ================== Devices Tabel ================== -->
    <div class="adminContainer">
      <div class="adminTitle">
        <input v-model="newDeviceId" placeholder="Device ID" />
        <button @click="addDevice">Aanmaken</button>
      </div>

      <table class="deviceTable">
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
            <td>Geen devices gevonden</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ================== Planters Tabel met Dropdowns ================== -->
    <div class="adminContainer">
      <div class="adminTitle">
        <!-- Dropdowns zonder lege optie -->
        <select v-model="selectedUserID">
          <option v-for="user in uniqueUserIDs" :key="user" :value="user">
            {{ user }}
          </option>
        </select>

        <select v-model="selectedDeviceID">
          <option v-for="device in devices" :key="device.TtnDeviceID" :value="device.TtnDeviceID">
            {{ device.TtnDeviceID }}
          </option>
        </select>

        <button @click="koppel">Koppelen</button>
      </div>

      <table class="deviceTable">
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
            <td colspan="4">Geen planters gevonden</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import WelcomeMessage from '@/components/WelcomeMessage.vue'
import SidebarNavbar from '@/components/SidebarNavbar.vue'

export default {
  name: 'AdminPage',
  components: { SidebarNavbar, WelcomeMessage },

  data() {
    return {
      // Devices tabel
      devices: [],
      newDeviceId: '',

      // Planters tabel
      planters: [],
      selectedUserID: '',
      selectedDeviceID: '',

      // Koppelingen (frontend only)
      koppelingen: []
    }
  },

  mounted() {
    // Haal Devices op
    fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Devices')
      .then(res => res.json())
      .then(data => {
        this.devices = data
        // Init dropdowns op eerste waarde automatisch
        if (data.length) this.selectedDeviceID = data[0].TtnDeviceID
      })
      .catch(err => console.error('Fout bij ophalen devices:', err))

    // Haal Planters op
    fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter')
      .then(res => res.json())
      .then(data => {
        this.planters = data
        if (data.length) this.selectedUserID = data[0].UserID
      })
      .catch(err => console.error('Fout bij ophalen planters:', err))
  },

  computed: {
    uniqueUserIDs() {
      const ids = this.planters.map(p => p.UserID)
      return [...new Set(ids)]
    }
  },

  methods: {
    addDevice() {
      if (!this.newDeviceId) return

      this.devices.push({ TtnDeviceID: this.newDeviceId })

      // Optioneel: selecteer automatisch nieuwe device in dropdown
      this.selectedDeviceID = this.newDeviceId

      this.newDeviceId = ''
    },

    koppel() {
      if (!this.selectedUserID || !this.selectedDeviceID) return

      // Voeg toe aan koppelingen (frontend only)
      this.koppelingen.push({
        UserID: this.selectedUserID,
        DeviceID: this.selectedDeviceID
      })

      alert(`Gekoppeld: ${this.selectedUserID} → ${this.selectedDeviceID}`)
    }
  }
}
</script>

<style scoped>
.Admin {
  margin-left: 5rem;
  color: var(--text);
}

/* Container */
.adminContainer {
  background: var(--light);
  width: 90%;
  border-radius: 15px;
  margin: 2rem 0 0 3rem;
  padding: 1rem;
}

/* Input + button + dropdown */
.adminTitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input,
select {
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid var(--icon);
  background: var(--light);
  color: var(--text);
}

button {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
}

/* Tables */
.deviceTable {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

/* Alleen lijn onder header */
.deviceTable thead th {
  padding: 0.6rem;
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid var(--icon);
}

/* Geen lijnen tussen rows */
.deviceTable tbody td {
  padding: 0.6rem;
  text-align: left;
  border: none;
}
</style>
