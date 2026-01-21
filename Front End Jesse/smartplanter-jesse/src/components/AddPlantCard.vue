<template>
  <article class="plants-card">

    <!-- Knop om modal te openen -->
    <button class="btnPlantToevoegen" @click="showAddPlantScreen = true">
      <i class="fa-solid fa-plus"></i> Plant Toevoegen
    </button>

    <!-- Modal -->
    <div v-if="showAddPlantScreen" class="harvest-screen">
      <h2>Plant Informatie</h2>

      <!-- Plant positie -->
      <input type="number" placeholder="Plant Positie" v-model="newPlant.position" class="form-input">

      <!-- Plant datum -->
      <input type="date" v-model="newPlant.plantDate" class="form-input">

      <!-- Dropdown plantsoorten -->
      <select v-model="newPlant.plantID" class="form-input">
        <option disabled value="">Kies een plantsoort</option>
        <option
          v-for="plant in plantOptions"
          :key="plant.PlantID"
          :value="plant.PlantID"
        >
          {{ plant.Plantsoort }}
        </option>
      </select>

      <!-- Actieknop -->
      <div class="harvest-actions">
        <button @click="addPlant" class="btnPlantToevoegen">
          Plant Toevoegen
        </button>
      </div>
    </div>

  </article>
</template>

<script>
export default {
  name: "AddPlantCard",
  props: {
    name: String,
    position: Number,
    plantDate: String,
    harvestDate: String,
  },
  data() {
    return {
      showAddPlantScreen: false,
      plantOptions: [],
      newPlant: {
        position: null,
        plantDate: "",
        plantID: "", // geselecteerde plant
      },
    };
  },
  mounted() {
    this.fetchPlantOptions();
  },
  methods: {
    async fetchPlantOptions() {
      try {
        const response = await fetch(
          "https://smartplanters.dedyn.io:1880/smartplantdata?table=Planten"
        );
        const data = await response.json();
        this.plantOptions = data;
      } catch (error) {
        console.error("Fout bij ophalen plantsoorten:", error);
      }
    },
    addPlant() {
      console.log("Nieuwe plant:", this.newPlant);
      this.showAddPlantScreen = false;
      // Hier kun je de nieuwe plant opslaan of versturen naar je backend
    },
  },
};
</script>

<style>
/* Algemene container styling */
.plants-card {
  position: relative; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--light);
  padding: 1rem;
  border-radius: 25px;
  min-height: 15rem;
  max-height: 15rem;
}

/* Knop styling */
.btnPlantToevoegen {
  background: var(--primary);
  color: var(--text);
  border-radius: 25px;
  height: auto;
  border: none;
  width: 90%;
  margin: 1rem 0;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
}

/* Modal styling */
.harvest-screen {
  position: absolute;
  inset: 0;
  background: var(--light);
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  gap: 1rem;
  padding: 1rem;
}

.harvest-screen h2 {
  color: var(--text);
  margin-bottom: 0rem;
}

/* Actieknop in modal */
.harvest-actions {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0;
}

.harvest-actions button {
  background: var(--primary);
  color: var(--text);
  border: none;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 1.2rem;
  cursor: pointer;
}

/* Stijl voor alle inputs en dropdowns */
.form-input {
  width: 90%;
  padding: 0.4rem 0.8rem;
  font-size: 1rem;
  border-radius: 10px;
  background: var(--bg);
  color: var(--text);
  border: none;
  box-sizing: border-box;
}

.form-input:hover {
    background: var(--primary);
}

.form-input option {
  background-color: var(--bg);
  color: var(--text);
}



.form-input::placeholder {
    color: var(--text);
}

.form-input::selection {
    background: var(--bg);
    color: var(--primary);
}
</style>
