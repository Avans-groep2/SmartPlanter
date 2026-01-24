<template>
  <SidebarNavbar />

  <div class="Notification">
    <header>
      <WelcomeMessage />
      <PlantSelector 
        v-model="selectedDeviceID" 
        :includeAllOption="true"
      />
    </header>

    <!-- ================== Belangrijke Meldingen ================== -->
    <div class="notificationContainer">
      <h2 class="notificationTitle">Belangrijke meldingen</h2>

      <table class="deviceTable">
        <thead>
          <tr>
            <th>Planter</th>
            <th>Bericht</th>
            <th class="actionCol"></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(melding, index) in belangrijkeMeldingen"
            :key="index"
          >
            <td>{{ getPlanterNaam(melding.DeviceID) }}</td>
            <td>{{ getBericht(melding.Berichtcode) }}</td>
            <td class="actionCol">
              <button
                class="deleteBtn"
                title="Verwijderen"
                @click="softDelete(melding)"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>

          <tr v-if="belangrijkeMeldingen.length === 0">
            <td colspan="3" class="emptyRow">
              Geen belangrijke meldingen
            </td>
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
            <th class="actionCol"></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(melding, index) in overigeMeldingen"
            :key="index"
          >
            <td>{{ getPlanterNaam(melding.DeviceID) }}</td>
            <td>{{ getBericht(melding.Berichtcode) }}</td>
            <td class="actionCol">
              <button
                class="deleteBtn"
                title="Verwijderen"
                @click="softDelete(melding)"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>

          <tr v-if="overigeMeldingen.length === 0">
            <td colspan="3" class="emptyRow">
              Geen overige meldingen
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
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
      meldingBerichten: [],
      selectedDeviceID: ''
    }
  },

  mounted() {
    this.fetchMeldingen()
    this.fetchPlanters()
    this.fetchMeldingBerichten()
  },

  computed: {
    belangrijkeMeldingen() {
      return this.meldingen.filter(m =>
        m.Prioriteit === 'hoog' &&
        (!this.selectedDeviceID || m.DeviceID === this.selectedDeviceID)
      )
    },

    overigeMeldingen() {
      return this.meldingen.filter(m =>
        m.Prioriteit === 'normaal' &&
        (!this.selectedDeviceID || m.DeviceID === this.selectedDeviceID)
      )
    }
  },

  methods: {
    async fetchMeldingen() {
      const { appContext } = getCurrentInstance()
      const $auth = appContext.config.globalProperties.$auth
      const userId = $auth.user?.id

      try {
        const res = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Meldingen')
        const data = await res.json()
        this.meldingen = data.filter(m => m.UserID === userId)
      } catch (error) {
        console.error('Fout bij ophalen meldingen:', error)
      }
    },

    async fetchPlanters() {
      try {
        const res = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter')
        this.planters = await res.json()
      } catch (error) {
        console.error('Fout bij ophalen planters:', error)
      }
    },

    async fetchMeldingBerichten() {
      try {
        const res = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=MeldingBericht')
        this.meldingBerichten = await res.json()
      } catch (error) {
        console.error('Fout bij ophalen meldingBerichten:', error)
      }
    },

    getPlanterNaam(deviceId) {
      const planter = this.planters.find(p => p.DeviceID === deviceId)
      return planter ? planter.DeviceNaam : 'Onbekende planter'
    },

    getBericht(berichtcode) {
      const berichtObj = this.meldingBerichten.find(b => b.Berichtcode === berichtcode)
      return berichtObj ? berichtObj.Bericht : 'Onbekend bericht'
    },

    async softDelete(melding) {
    try {
      const meldingID = melding.MeldingID;
      if (!meldingID) throw new Error('MeldingID is undefined');

      // Verwijder melding direct uit de lokale array
      this.meldingen = this.meldingen.filter(m => m.MeldingID !== meldingID);

      fetch(
        `https://smartplanters.dedyn.io:1880/cleardata?table=Meldingen&meldingID=${meldingID}`,
        { method: 'GET' }
      ).catch(err => {
        console.warn('Fetch faalde, maar melding is waarschijnlijk verwijderd:', err);
      });

    } catch (error) {
      console.error('Fout bij verwijderen melding:', error);
      alert('Verwijderen mislukt. Probeer opnieuw.');
    }
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

/* ================= Containers ================= */
.notificationContainer {
  background: var(--light);
  width: 90%;
  border-radius: 15px;
  margin: 2rem 0 0 3rem;
  padding: 1rem;
}

/* ================= Titles ================= */
.notificationTitle {
  margin: 0 0 0.8rem 0;
  font-size: 2rem;
  font-weight: 600;
}

/* ================= Tables ================= */
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

/* Scrollbare body */
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
  transition: background 0.2s ease, opacity 0.3s ease;
}

/* Hover row */
.deviceTable tbody tr:hover {
  background: var(--primary);
  color: var(--text);
  font-weight: 600;
}

/* Cells */
.deviceTable tbody td {
  padding: 0.6rem;
  border: none;
}

/* Actie kolom */
.actionCol {
  width: 3rem;
  text-align: center;
}

/* Delete knop (verborgen standaard) */
.deleteBtn {
  opacity: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text);
  transition: opacity 0.2s ease;
}

/* Toon prullenbak alleen bij hover van rij */
.deviceTable tbody tr:hover .deleteBtn {
  opacity: 1;
}

/* Soft delete animatie */
.softDeleted {
  opacity: 0;
  pointer-events: none;
}

/* Empty state */
.emptyRow {
  text-align: center;
  color: var(--icon);
  font-style: italic;
}
</style>
