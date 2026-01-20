<template>
  <SidebarNavbar />

  <div class="Notification">
    <header>
      <WelcomeMessage />
      <PlantSelector @change="selectedDeviceID = $event" :includeAllOption="true"/>
    </header>

    <!-- ================== Belangrijke Meldingen ================== -->
    <div class="notificationContainer">
      <h2 class="notificationTitle">Belangrijke meldingen</h2>

      <table class="deviceTable">
        <thead>
          <tr>
            <th>Planter</th>
            <th>Bericht</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(melding, index) in belangrijkeMeldingen"
            :key="index"
          >
            <td>{{ getPlanterNaam(melding.DeviceID) }}</td>
            <td>{{ melding.Bericht }}</td>
          </tr>

          <tr v-if="belangrijkeMeldingen.length === 0">
            <td colspan="2">Geen belangrijke meldingen</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ================== Overige Meldingen ================== -->
    <div class="notificationContainer">
      <h2 class="notificationTitle">Overige meldingen</h2>

      <table class="deviceTable">
        <thead>
          <tr>
            <th>Planter</th>
            <th>Bericht</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(melding, index) in overigeMeldingen"
            :key="index"
          >
            <td>{{ getPlanterNaam(melding.DeviceID) }}</td>
            <td>{{ melding.Bericht }}</td>
          </tr>

          <tr v-if="overigeMeldingen.length === 0">
            <td colspan="2">Geen overige meldingen</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import WelcomeMessage from '@/components/WelcomeMessage.vue'
import SidebarNavbar from '@/components/SidebarNavbar.vue'
import PlantSelector from '@/components/PlantSelector.vue'

export default {
  name: 'NotificationsPage',
  components: {
    SidebarNavbar,
    WelcomeMessage,
    PlantSelector
  },

  data() {
    return {
      meldingen: [],
      planters: [],
      selectedDeviceID: '' // ← leeg = alle planters
    }
  },

  mounted() {
    // Meldingen ophalen
    fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Meldingen')
      .then(res => res.json())
      .then(data => {
        this.meldingen = data
      })
      .catch(err =>
        console.error('Fout bij ophalen meldingen:', err)
      )

    // Planters ophalen
    fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter')
      .then(res => res.json())
      .then(data => {
        this.planters = data
      })
      .catch(err =>
        console.error('Fout bij ophalen planters:', err)
      )
  },

  computed: {
    belangrijkeMeldingen() {
      return this.meldingen.filter(m =>
        m.Prioriteit === 'important' &&
        (
          !this.selectedDeviceID ||
          m.DeviceID === this.selectedDeviceID
        )
      )
    },

    overigeMeldingen() {
      return this.meldingen.filter(m =>
        m.Prioriteit === 'normal' &&
        (
          !this.selectedDeviceID ||
          m.DeviceID === this.selectedDeviceID
        )
      )
    }
  },

  methods: {
    getPlanterNaam(deviceId) {
      const planter = this.planters.find(
        p => p.DeviceID === deviceId
      )
      return planter ? planter.DeviceNaam : 'Onbekende planter'
    }
  }
}
</script>

<style scoped>
.Notification {
  margin-left: 5rem;
  color: var(--text);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Container */
.notificationContainer {
  background: var(--light);
  width: 90%;
  border-radius: 15px;
  margin: 2rem 0 0 3rem;
  padding: 1rem;
}

/* Titel */
.notificationTitle {
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
}

/* Tables */
.deviceTable {
  width: 100%;
  border-collapse: collapse;
}

.deviceTable thead th {
  padding: 0.6rem;
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid var(--icon);
}

.deviceTable tbody td {
  padding: 0.6rem;
  border: none;
}
</style>
