<template>
  <SidebarNavbar />

  <div class="Admin">
    <WelcomeMessage />

    <!-- ================= DEVICE MELDINGEN ================= -->
    <div class="adminContainer">
      <div class="adminTitle">
        <input v-model="newDeviceId" placeholder="Device ID" />
        <button @click="addDevice">Aanmaken</button>
      </div>

      <div class="table">
        <div class="row header">
          <div>Device ID</div>
          <div>Datum</div>
          <div>Tijd</div>
          <div>Melding</div>
        </div>

        <div
          v-for="(melding, index) in deviceMeldingen"
          :key="index"
          class="row"
        >
          <div>{{ melding.deviceId }}</div>
          <div>{{ melding.datum }}</div>
          <div>{{ melding.tijd }}</div>
          <div>{{ melding.tekst }}</div>
        </div>

        <div v-if="deviceMeldingen.length === 0" class="loading">
          Geen meldingen gevonden
        </div>
      </div>
    </div>

    <!-- ================= GEBRUIKER ↔ DEVICE ================= -->
    <div class="adminContainer">
      <div class="adminTitle dropdown">
        <input v-model="gebruikersnaam" placeholder="Gebruikersnaam" />

        <button @click="open = !open" class="dropdown-btn">
          {{ selectedDevice || 'Selecteer Device' }}
        </button>

        <transition name="fade-slide">
          <ul v-if="open" class="dropdown-menu">
            <li
              v-for="device in devices"
              :key="device.deviceId"
              @click="selectDevice(device)"
            >
              {{ device.deviceNaam }} ({{ device.deviceId }})
            </li>
          </ul>
        </transition>

        <button @click="koppelDevice">Koppelen</button>
      </div>

      <div class="table">
        <div class="row header">
          <div>Gebruikersnaam</div>
          <div>Email</div>
          <div>Device ID</div>
          <div>Device Naam</div>
        </div>

        <div
          v-for="(item, index) in gebruikersDevices"
          :key="index"
          class="row"
        >
          <div>{{ item.gebruikersnaam }}</div>
          <div>{{ item.email }}</div>
          <div>{{ item.deviceId }}</div>
          <div>{{ item.deviceNaam }}</div>
        </div>

        <div v-if="gebruikersDevices.length === 0" class="loading">
          Geen koppelingen gevonden
        </div>
      </div>
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
      // dropdown
      open: false,
      devices: [],
      selectedDevice: null,
      selectedDeviceId: null,

      // input
      newDeviceId: '',
      gebruikersnaam: '',

      // data
      deviceMeldingen: [],
      gebruikersDevices: []
    }
  },

  mounted() {
    // ================= MOCK DATA =================

    this.devices = [
      { deviceId: 'DEV-001', deviceNaam: 'Sensor Keuken' },
      { deviceId: 'DEV-002', deviceNaam: 'Sensor Garage' },
      { deviceId: 'DEV-003', deviceNaam: 'Sensor Zolder' }
    ]

    this.deviceMeldingen = [
      {
        deviceId: 'DEV-001',
        datum: '2026-01-05',
        tijd: '10:32',
        tekst: 'Temperatuur te hoog'
      },
      {
        deviceId: 'DEV-002',
        datum: '2026-01-05',
        tijd: '11:10',
        tekst: 'Batterij bijna leeg'
      }
    ]

    this.gebruikersDevices = [
      {
        gebruikersnaam: 'jan',
        email: 'jan@test.nl',
        deviceId: 'DEV-001',
        deviceNaam: 'Sensor Keuken'
      },
      {
        gebruikersnaam: 'piet',
        email: 'piet@test.nl',
        deviceId: 'DEV-002',
        deviceNaam: 'Sensor Garage'
      }
    ]
  },

  methods: {
    selectDevice(device) {
      this.selectedDevice = device.deviceNaam
      this.selectedDeviceId = device.deviceId
      this.open = false
    },

    addDevice() {
      if (!this.newDeviceId) return

      this.devices.push({
        deviceId: this.newDeviceId,
        deviceNaam: `Nieuw Device (${this.newDeviceId})`
      })

      this.newDeviceId = ''
    },

    koppelDevice() {
      if (!this.gebruikersnaam || !this.selectedDeviceId) return

      this.gebruikersDevices.push({
        gebruikersnaam: this.gebruikersnaam,
        email: `${this.gebruikersnaam}@test.nl`,
        deviceId: this.selectedDeviceId,
        deviceNaam: this.selectedDevice
      })

      this.gebruikersnaam = ''
      this.selectedDevice = null
      this.selectedDeviceId = null
    }
  }
}
</script>

<style scoped>
.Admin {
  margin-left: 5rem;
}

.adminContainer {
  background: var(--light);
  width: 28rem;
  border-radius: 15px;
  margin: 2rem 0 0 3rem;
  padding: 1rem;
}

.adminTitle {
  display: flex;
  gap: 0.5rem;
  position: relative;
}

input {
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid var(--icon);
}

button {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
}

/* ================= TABLE ================= */
.table {
  margin-top: 1rem;
}

.row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0.4rem 0;
}

.header {
  font-weight: bold;
  border-bottom: 1px solid var(--icon);
}

/* ================= DROPDOWN ================= */
.dropdown-btn {
  background: var(--primary);
}

.dropdown-menu {
  position: absolute;
  top: 3rem;
  background: var(--light);
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--icon);
  z-index: 10;
}

.dropdown-menu li {
  padding: 0.5rem;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background: var(--primary);
  color: white;
}

/* ================= TRANSITION ================= */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
