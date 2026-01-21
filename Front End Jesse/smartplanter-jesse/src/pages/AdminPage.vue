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
        <select v-model="selectedUserID">
          <option v-for="user in uniqueUserIDs" :key="user" :value="user">
            {{ user }}
          </option>
        </select>

        <select v-model="selectedDeviceID">
          <option
            v-for="device in devices"
            :key="device.TtnDeviceID"
            :value="device.TtnDeviceID"
          >
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
      selectedUserID: '',
      selectedDeviceID: '',

      koppelingen: []
    }
  },

  mounted() {
    fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Devices')
      .then(res => res.json())
      .then(data => {
        this.devices = data
        if (data.length) this.selectedDeviceID = data[0].TtnDeviceID
      })
      .catch(err => console.error('Fout bij ophalen devices:', err))

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
      return [...new Set(this.planters.map(p => p.UserID))]
    }
  },

  methods: {
    addDevice() {
      if (!this.newDeviceId) return

      this.devices.push({ TtnDeviceID: this.newDeviceId })
      this.selectedDeviceID = this.newDeviceId
      this.newDeviceId = ''
    },

    koppel() {
      if (!this.selectedUserID || !this.selectedDeviceID) return

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

/* ================= Containers ================= */
.adminContainer {
  background: var(--light);
  width: 90%;
  border-radius: 15px;
  margin: 2rem 0 0 3rem;
  padding: 1rem;
}

/* ================= Controls ================= */
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

/* ================= Tables ================= */
.deviceTable {
  width: 100%;
  border-collapse: collapse;
}

/* Header */
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

/* Body – voorkomt verspringen */
.deviceTable tbody {
  display: block;
  min-height: 11rem;
  max-height: 11rem;     
  overflow-y: auto;      
}

/* Rows */
.deviceTable tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.deviceTable tbody td {
  padding: 0.6rem;
  border: none;
}

/* Empty state */
.emptyRow {
  text-align: center;
  color: var(--icon);
  font-style: italic;
}
</style>
