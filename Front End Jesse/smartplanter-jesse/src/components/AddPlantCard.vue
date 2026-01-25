<template>
  <article class="plants-card">
    <button class="btnPlantToevoegen" @click="showAddPlantScreen = true">
      <i class="fa-solid fa-plus"></i> Plant Toevoegen
    </button>

    <div v-if="showAddPlantScreen" class="harvest-screen">
      <div class="title">
        <button @click="showAddPlantScreen = false">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <h2>Plant Informatie</h2>
      </div>

      <input
        type="number"
        placeholder="Plant Positie"
        v-model="newPlant.position"
        class="form-input"
        @keyup.enter="addPlant"
        min="0"
      />

      <input
        type="date"
        v-model="newPlant.plantDate"
        class="form-input"
        @keyup.enter="addPlant"
      />

      <select v-model="newPlant.plantID" class="form-input">
        <option disabled value="">Kies een plantsoort</option>
        <option
          v-for="plant in plantOptions"
          :key="plant.PlantID"
          :value="plant.PlantID"
          @keyup.enter="addPlant"
        >
          {{ plant.Plantsoort }}
        </option>
      </select>

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
    deviceID: {
      type: [String, Number],
      required: true,
    },
  },

  emits: ["plant-added"],

  data() {
    return {
      showAddPlantScreen: false,
      plantOptions: [],
      newPlant: {
        position: "",
        plantDate: "",
        plantID: "",
      },
    };
  },

  mounted() {
    this.fetchPlantOptions();
  },

  methods: {
    async fetchPlantOptions() {
      try {
        const res = await fetch(
          "https://smartplanters.dedyn.io:1880/smartplantdata?table=Planten",
        );
        this.plantOptions = await res.json();
      } catch (err) {
        console.error("Fout bij ophalen van plantopties:", err);
        this.$toast("Kan plantopties niet ophalen", "error");
      }
    },

    addPlant() {
      // Controleer of deviceID aanwezig is
      if (!this.deviceID) {
        this.$toast("Selecteer eerst een planter", "error");
        return;
      }

      if (
        !this.newPlant.position ||
        !this.newPlant.plantDate ||
        !this.newPlant.plantID
      ) {
        this.$toast(
          "Vul alle velden in voordat je een plant toevoegt",
          "warning",
        );
        return;
      }

      const url =
        `https://smartplanters.dedyn.io:1880/smartplantedit?table=PlantPositie` +
        `&deviceID=${this.deviceID}` +
        `&plantID=${this.newPlant.plantID}` +
        `&plantDatum=${this.newPlant.plantDate}` +
        `&plantpositie=${this.newPlant.position}`;

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Toevoegen mislukt");

          this.showAddPlantScreen = false;
          this.newPlant = { position: "", plantDate: "", plantID: "" };
          this.$emit("plant-added");
          this.$toast("Plant succesvol toegevoegd!", "success");
        })
        .catch((err) => {
          console.error("Fout bij toevoegen plant:", err);
          this.$toast("Plant toevoegen mislukt", "error");
        });
    },
  },
};
</script>

<style>
.plants-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--light);
  padding: 1rem;
  border-radius: 25px;
  min-height: 16.5rem;
}

.btnPlantToevoegen {
  background: var(--primary);
  color: var(--text);
  border-radius: 25px;
  height: auto;
  border: none;
  width: 100%;
  margin: 1rem 0;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
}

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
  font-size: 1.5rem;
}

.harvest-screen .title {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.harvest-screen .title button {
  background: var(--primary);
  color: var(--text);
  border: none;
  border-radius: 10px;
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
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

.form-input {
  width: 90%;
  padding: 0.4rem 0.8rem;
  font-size: 1rem;
  border-radius: 10px;
  background: var(--inputbg);
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
