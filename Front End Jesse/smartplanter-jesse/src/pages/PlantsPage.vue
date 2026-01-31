<template>
  <SidebarNavbar />

  <div class="Plant">
    <WelcomeMessage />

    <div class="plantContainer">
      <div class="plantInputs">
        <input
          v-model="selectedPlantsoort"
          placeholder="Plantsoort"
          @keyup.enter="wijzigPlant"
        />
        <input
          v-model="selectedPhMin"
          placeholder="PhMin"
          type="number"
          step="0.1"
          @keyup.enter="wijzigPlant"
        />
        <input
          v-model="selectedPhMax"
          placeholder="PhMax"
          type="number"
          step="0.1"
          @keyup.enter="wijzigPlant"
        />
        <input
          v-model="selectedGroeitijd"
          placeholder="Groeitijd (dagen)"
          type="number"
          @keyup.enter="wijzigPlant"
        />

        <button @click="wijzigPlant">Wijzigen</button>
        <button @click="addPlant">Toevoegen</button>
      </div>

      <table class="plantsTable">
        <thead>
          <tr>
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
import WelcomeMessage from "@/components/WelcomeMessage.vue";
import SidebarNavbar from "@/components/SidebarNavbar.vue";

export default {
  name: "PlantPage",
  components: { SidebarNavbar, WelcomeMessage },

  data() {
    return {
      planten: [],
      selectedPlantID: "",
      selectedPlantsoort: "",
      selectedPhMin: "",
      selectedPhMax: "",
      selectedGroeitijd: "",
      newPlantID: "",
      newPlantsoort: "",
      newPhMin: "",
      newPhMax: "",
      newGroeitijd: "",
    };
  },

  mounted() {
    this.loadPlanten();
  },

  methods: {
    async loadPlanten() {
      try {
        const res = await fetch(
          "https://smartplanters.dedyn.io:1880/smartplantdata?table=Planten",
        );
        this.planten = await res.json();
      } catch (err) {
        console.error("Fout bij ophalen planten:", err);
      }
    },

    getNextPlantID() {
      if (this.planten.length === 0) {
        return 1;
      }

      const hoogsteID = Math.max(...this.planten.map((p) => Number(p.PlantID)));

      return hoogsteID + 1;
    },

    selectPlant(plant) {
      this.selectedPlantID = plant.PlantID;
      this.selectedPlantsoort = plant.Plantsoort;
      this.selectedPhMin = plant.PhMin;
      this.selectedPhMax = plant.PhMax;
      this.selectedGroeitijd = plant.Groeitijd;
    },

    async wijzigPlant() {
      if (
        !this.selectedPlantID ||
        !this.selectedPlantsoort ||
        !this.selectedPhMin ||
        !this.selectedPhMax ||
        !this.selectedGroeitijd
      ) {
        this.$toast("Vul alle velden in", "error");
        return;
      }

      const url =
        `https://smartplanters.dedyn.io:1880/plants` +
        `?plantID=${this.selectedPlantID}` +
        `&plantSoort=${encodeURIComponent(this.selectedPlantsoort)}` +
        `&phMin=${this.selectedPhMin}` +
        `&phMax=${this.selectedPhMax}` +
        `&groeitijd=${this.selectedGroeitijd}`;

      try {
        fetch(url);
        this.$toast("Plant succesvol gewijzigd", "success");
        setTimeout(() => {
          this.loadPlanten();
        }, 500);
      } catch (err) {
        console.error("Kon plant niet wijzigen:", err);
        this.$toast("Kon plant niet wijzigen", "error");
      }
    },
    async addPlant() {
      if (
        this.newPlantsoort === "" ||
        this.newPhMin === "" ||
        this.newPhMax === "" ||
        this.newGroeitijd === ""
      ) {
        this.$toast("Vul alle velden in", "error");
        return;
      }

      const nextPlantID = this.getNextPlantID();

      const url =
        `https://smartplanters.dedyn.io:1880/smartplantedit?table=Planten` +
        `&plantID=${nextPlantID}` +
        `&plantSoort=${encodeURIComponent(this.selectedPlantsoort)}` +
        `&phMin=${this.selectedPhMin}` +
        `&phMax=${this.selectedPhMax}` +
        `&groeitijd=${this.selectedGroeitijd}`;

      try {
        await fetch(url);
        this.$toast("Plant succesvol toegevoegd", "success");

        // velden leegmaken
        this.selectedPlantsoort = "";
        this.selectedPhMin = "";
        this.selectedPhMax = "";
        this.selectedGroeitijd = "";

        setTimeout(() => {
          this.loadPlanten();
        }, 500);
      } catch (err) {
        console.error("Kon plant niet toevoegen:", err);
        this.$toast("Kon plant niet toevoegen", "error");
      }
    },
  },
};
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

.plantsTable {
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

.plantsTable tbody {
  display: block;
  min-height: 15rem;
  max-height: 30rem;
  overflow-y: auto;
}

.plantsTable tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
  transition: background 0.2s ease, opacity 0.3s ease;
}

.plantsTable tbody tr:hover {
  background: var(--primary);
  color: var(--text);
  font-weight: 600;
}

.plantsTable tbody td {
  padding: 0.6rem;
  border: none;
}

.actionCol {
  width: 3rem;
  text-align: center;
}

.deleteBtn {
  opacity: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text);
  transition: opacity 0.2s ease;
}

.plantsTable tbody tr:hover .deleteBtn {
  opacity: 1;
}

.softDeleted {
  opacity: 0;
  pointer-events: none;
}

.emptyRow {
  text-align: center;
  color: var(--icon);
  font-style: italic;
}
</style>
