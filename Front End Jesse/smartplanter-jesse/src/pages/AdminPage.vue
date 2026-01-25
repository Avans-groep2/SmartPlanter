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
            <td class="emptyRow">Geen devices gevonden</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ================== Planters Tabel ================== -->
    <div class="adminContainer">
      <div class="adminTitle">
        <!-- Users dropdown: UserID als value, Username tonen, alfabetisch -->
        <select v-model="selectedUserID">
          <option
            v-for="user in sortedUsers"
            :key="user.UserID"
            :value="user.UserID"
          >
            {{ user.Username }}
          </option>
        </select>

        <!-- Devices dropdown -->
        <select v-model="selectedDeviceID">
          <option
            v-for="device in devices"
            :key="device.TtnDeviceID"
            :value="device.TtnDeviceID"
          >
            {{ device.TtnDeviceID }}
          </option>
        </select>

        <input v-model="selectedPlantenTeller" placeholder="PlantenTeller" type="number"/>
        <input v-model="selectedDeviceNaam" placeholder="Device Naam" />

        <button @click="koppel">Koppelen</button>
      </div>

      <table class="deviceTable">
        <thead>
          <tr>
            <th>Username</th>
            <th>DeviceID</th>
            <th>PlantenTeller</th>
            <th>DeviceNaam</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(planter, index) in planters" :key="index">
            <td>{{ getUsername(planter.UserID) }}</td>
            <td>{{ planter.DeviceID }}</td>
            <td>{{ planter.PlantenTeller }}</td>
            <td>{{ planter.DeviceNaam }}</td>
          </tr>

          <tr v-if="planters.length === 0">
            <td colspan="4" class="emptyRow">
              Geen planters gevonden
            </td>
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
      devices: [],
      newDeviceId: '',

      planters: [],
      selectedDeviceID: '',
      selectedPlantenTeller: '',
      selectedDeviceNaam: '',

      users: [],
      selectedUserID: '' // UserID opgeslagen voor backend
    }
  },

  mounted() {
    this.loadDevices()
    this.loadPlanters()
    this.loadUsers()
  },

  computed: {
    // Alle users alfabetisch op Username
    sortedUsers() {
      return [...this.users].sort((a, b) => {
        if (a.Username.toLowerCase() < b.Username.toLowerCase()) return -1
        if (a.Username.toLowerCase() > b.Username.toLowerCase()) return 1
        return 0
      })
    }
  },

  methods: {
    // Devices ophalen
    loadDevices() {
      fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Devices')
        .then(res => res.json())
        .then(data => {
          this.devices = data
          if (!this.selectedDeviceID && data.length) {
            this.selectedDeviceID = data[data.length - 1].TtnDeviceID
          }
        })
        .catch(err => console.error('Fout bij ophalen devices:', err))
    },

    // Planters ophalen
    loadPlanters() {
      fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter')
        .then(res => res.json())
        .then(data => { this.planters = data })
        .catch(err => console.error('Fout bij ophalen planters:', err))
    },

    // Users ophalen
    loadUsers() {
      fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Users')
        .then(res => res.json())
        .then(data => {
          this.users = data
          if (!this.selectedUserID && data.length) {
            this.selectedUserID = data[0].UserID
          }
        })
        .catch(err => console.error('Fout bij ophalen users:', err))
    },

    // Device toevoegen
    addDevice() {
      if (!this.newDeviceId.trim()) return

      const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Devices&TtnDeviceID=${this.newDeviceId}`

      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Fout bij toevoegen device')

          this.newDeviceId = ''
          return this.loadDevices()
        })
        .catch(err => {
          console.error(err)
          alert('Device kon niet worden toegevoegd')
        })
    },

    // Koppelen van User → Device
    koppel() {
      if (!this.selectedUserID || !this.selectedDeviceID) return

      const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Planter` +
                  `&userID=${this.selectedUserID}` +
                  `&deviceID=${this.selectedDeviceID}` +
                  `&plantenTeller=${this.selectedPlantenTeller}` +
                  `&deviceNaam=${this.selectedDeviceNaam}`

      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Fout bij toevoegen planter')

          this.selectedPlantenTeller = ''
          this.selectedDeviceNaam = ''
          return this.loadPlanters()
        })
        .catch(err => {
          console.error(err)
          alert('Planter kon niet worden toegevoegd')
        })
    },

    // Helper: UserID → Username
    getUsername(userID) {
      const user = this.users.find(u => u.UserID === userID)
      return user ? user.Username : userID
    }
  }
}
</script>

<style scoped>
.Admin {
  margin-left: 5rem;
  color: var(--text);
}

.adminContainer {
  background: var(--light);
  width: 90%;
  border-radius: 15px;
  margin: 2rem 0 0 3rem;
  padding: 1rem;
}

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

.deviceTable {
  width: 100%;
  border-collapse: collapse;
}

.deviceTable thead {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.deviceTable thead th {
  padding: 0.6rem;
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid var(--icon);
}

.deviceTable tbody {
  display: block;
  min-height: 11rem;
  max-height: 11rem;     
  overflow-y: auto;      
}

.deviceTable tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.deviceTable tbody td {
  padding: 0.6rem;
  border: none;
}

.emptyRow {
  text-align: center;
  color: var(--icon);
  font-style: italic;
}
</style>
