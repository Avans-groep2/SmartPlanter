<template>
  <SidebarNavbar />

  <div class="Plant">
    <WelcomeMessage />

    <div class="plantContainer">
      <!-- Inputs boven table -->
      <div class="plantInputs">
        <input v-model="selectedPlantID" placeholder="PlantID" type="number" readonly />
        <input v-model="selectedPlantsoort" placeholder="Plantsoort" />
        <input v-model="selectedPhMin" placeholder="PhMin" type="number" step="0.1" />
        <input v-model="selectedPhMax" placeholder="PhMax" type="number" step="0.1" />
        <input v-model="selectedGroeitijd" placeholder="Groeitijd (dagen)" type="number" />

        <button @click="wijzigPlant">Wijzigen</button>
      </div>

      
        <table class="plantsTable">
          <thead>
            <tr>
              <th>PlantID</th>
              <th>Plantsoort</th>
              <th>PhMin</th>
              <th>PhMax</th>
              <th>Groeitijd</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="plant in planten" 
              :key="plant.PlantID" 
              @click="selectPlant(plant)"
              class="tableRow"
            >
              <td>{{ plant.PlantID }}</td>
              <td>{{ plant.Plantsoort }}</td>
              <td>{{ plant.PhMin }}</td>
              <td>{{ plant.PhMax }}</td>
              <td>{{ plant.Groeitijd }}</td>
            </tr>

            <tr v-if="planten.length === 0">
              <td colspan="5" class="emptyRow">Geen planten gevonden</td>
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
  name: 'PlantPage',
  components: { SidebarNavbar, WelcomeMessage },

  data() {
    return {
      planten: [],
      selectedPlantID: '',
      selectedPlantsoort: '',
      selectedPhMin: '',
      selectedPhMax: '',
      selectedGroeitijd: ''
    }
  },

  mounted() {
    this.loadPlanten()
  },

  methods: {
    async loadPlanten() {
      try {
        const res = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planten')
        this.planten = await res.json()
      } catch (err) {
        console.error('Fout bij ophalen planten:', err)
      }
    },

    selectPlant(plant) {
      this.selectedPlantID = plant.PlantID
      this.selectedPlantsoort = plant.Plantsoort
      this.selectedPhMin = plant.PhMin
      this.selectedPhMax = plant.PhMax
      this.selectedGroeitijd = plant.Groeitijd
    },

    async wijzigPlant() {
      if (!this.selectedPlantID || !this.selectedPlantsoort || !this.selectedPhMin || !this.selectedPhMax || !this.selectedGroeitijd) {
        this.$toast('Vul alle velden in', 'error')
        return
      }

      const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Planten` +
                  `&PlantID=${this.selectedPlantID}` +
                  `&Plantsoort=${encodeURIComponent(this.selectedPlantsoort)}` +
                  `&PhMin=${this.selectedPhMin}` +
                  `&PhMax=${this.selectedPhMax}` +
                  `&Groeitijd=${this.selectedGroeitijd}`

      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error('Fout bij wijzigen plant')

        this.$toast('Plant succesvol gewijzigd', 'success')
        this.loadPlanten()
      } catch (err) {
        console.error(err)
        this.$toast('Kon plant niet wijzigen', 'error')
      }
    }
  }
}
</script>

<style scoped>
.Plant {
  margin-left: 5rem;
  color: var(--text);
}

.plantContainer {
  background: var(--light);
  width: 90%;
  border-radius: 15px;
  margin: 2rem 0 0 3rem;
  padding: 1rem;
}

/* Inputs boven table */
.plantInputs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.plantInputs input {
  padding: 0.5rem;
  border-radius: 10px;
  border: 2px solid var(--icon);
  background: var(--light);
  color: var(--text);
}

.plantInputs button {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
}

deviceTable {
  width: 100%;
  border-collapse: collapse;
}

.plantsTable thead {
  display: table;
  width: 100%;
  table-layout: fixed;
  border-bottom: 2px solid var(--icon);
}

.plantsTable thead th {
  padding: 0.6rem;
  text-align: left;
  font-weight: bold;
}

/* Scrollbare body */
.plantsTable tbody {
  display: block;
  min-height: 11rem;
  max-height: 11rem;
  overflow-y: auto;
}

/* Rows */
.plantsTable tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
  transition: background 0.2s ease, opacity 0.3s ease;
}

/* Hover row */
.plantsTable tbody tr:hover {
  background: var(--primary);
  color: var(--text);
  font-weight: 600;
}

/* Cells */
.plantsTable tbody td {
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
.plantsTable tbody tr:hover .deleteBtn {
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
