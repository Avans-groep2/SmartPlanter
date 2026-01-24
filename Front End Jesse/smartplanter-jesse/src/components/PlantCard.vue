<template>
  <article class="plants-position">
    <!-- Overlay -->
    <div class="overlay">
      <h2 class="title">
        <i class="fa-solid fa-seedling"></i>
        {{ name }}
      </h2>

      <div class="plant-position">
        <i class="fa-solid fa-location-dot"></i>
        <h1>{{ position }}</h1>
      </div>
    </div>

    <!-- Header -->
    <header class="plants-title">
      <h2 class="title">
        <i class="fa-solid fa-seedling"></i>
        {{ name }}
      </h2>
      
      <div class="plant-position">
        <i class="fa-solid fa-location-dot"></i>
        <h1>{{ position }}</h1>
      </div>
    </header>

    <!-- Plant info -->
    <section class="plant-info">
      <h1 class="daysToOogst"><strong>{{ daysToHarvest }}</strong></h1>
      <div class="plantDate">
        <p>Geplant op:</p>
        <p>{{ displayPlantDate }}</p>
      </div>
      <div class="plantOogst">
        <p>Oogst verwacht:</p>
        <p>{{ displayHarvestDate }}</p>
      </div>
    </section>

    <!-- Button oogsten -->
    <button class="btnOogst" @click="showHarvestScreen = true">
      Plant oogsten
    </button>

    <!-- Oogst modal -->
    <div v-if="showHarvestScreen" class="harvest-screen">
      <h2>Hoe was de oogst?</h2>

      <!-- Rating -->
      <div class="rating">
        <i
          v-for="star in 5"
          :key="star"
          class="fa-star"
          :class="star <= displayRating ? 'fas full' : 'far empty'"
          @mouseenter="hoverStar(star)"
          @mouseleave="leaveStar"
          @click="setRating(star)"
        ></i>
      </div>

      <!-- Actions -->
      <div class="harvest-actions">
        <button @click="showHarvestScreen = false">Annuleren</button>
        <button @click="confirmHarvest">Bevestigen</button>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "PlantCard",
  props: {
    name: String,
    position: Number,
    plantDate: String, // ISO YYYY-MM-DD
  },
  data() {
    return {
      showHarvestScreen: false,
      rating: 3,
      hoverRatingValue: null,
      groeitijd: null // aantal dagen tot oogst
    }
  },
  computed: {
    displayRating() {
      return this.hoverRatingValue ?? this.rating;
    },
    daysToHarvest() {
      if (!this.plantDate || this.groeitijd === null) return '';
      
      const plantDate = new Date(this.plantDate);
      const harvestDate = new Date(plantDate);
      harvestDate.setDate(harvestDate.getDate() + this.groeitijd);

      const today = new Date();
      const diffTime = harvestDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 0 ? `${diffDays} dagen tot oogst` : "Kan geoogst worden!";
    },
    displayPlantDate() {
      if (!this.plantDate) return '';
      const date = new Date(this.plantDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    displayHarvestDate() {
      if (!this.plantDate || this.groeitijd === null) return '';
      const plantDate = new Date(this.plantDate);
      const harvestDate = new Date(plantDate);
      harvestDate.setDate(harvestDate.getDate() + this.groeitijd);

      const day = String(harvestDate.getDate()).padStart(2, '0');
      const month = String(harvestDate.getMonth() + 1).padStart(2, '0');
      const year = harvestDate.getFullYear();
      return `${day}-${month}-${year}`;
    }
  },
  mounted() {
    // Haal de plantgegevens op
    fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planten')
      .then(res => res.json())
      .then(data => {
        const plant = data.find(p => p.Plantsoort === this.name);
        if (plant) {
          this.groeitijd = plant.Groeitijd;
        }
      });
  },
  methods: {
    setRating(star) { this.rating = star },
    hoverStar(star) { this.hoverRatingValue = star },
    leaveStar() { this.hoverRatingValue = null },
    confirmHarvest() {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const oogstDatum = `${year}-${month}-${day}`;
      const currentDeviceID = localStorage.getItem('chosenDeviceId');
      const plantpositie = Number(this.position);
      const oogstResultaat = Number(this.rating);

      const url = `https://smartplanters.dedyn.io:1880/harvest?table=PlantPositie&oogstDatum=${oogstDatum}&oogstResultaat=${oogstResultaat}&plantpositie=${plantpositie}&deviceID=${currentDeviceID}`;

      fetch(url)

      this.$emit('plant-harvested', this.position);
      
        }
    }
  }
</script>

<style>
.plants-position {
  position: relative; 
  flex-direction: column;
  background: var(--light);
  padding: 0.5rem 0 0 0;
  border-radius: 25px;
}

.overlay {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--light);
  justify-content: center;
  align-items: center;
  gap: 1rem;
  color: #fff;
  border-radius: 25px;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.plants-position:hover .overlay {
  opacity: 0;
}

.plants-title {
  display: flex;
  justify-content: space-between;
}

.title {
  display: flex;
  color: var(--text);
}

.title h2 {
  font-weight: 500;
  color: var(--text);
}

.title h1,
.title i {
  font-size: 2rem;
  color: var(--text);
}

.plant-position {
  display: flex;
  justify-content: center;   
  align-items: center;       
  min-width: 100px;         
  height: 2.5rem;            
  background: var(--primary);
  border-radius: 50px;
  box-sizing: border-box;    
}

.plant-position h1,
.plant-position i {
  font-size: 2rem;       
  font-weight: 600;
  color: var(--text);
  margin: 0;               
  line-height: 1;          
}

.daysToOogst {
  font-size: 1.5rem;
  text-align: center; 
  padding: 0.5rem 0;  
  margin-bottom: 0.5rem; 
  color: var(--text);
}

.plantDate,
.plantOogst {
  display: flex;
  justify-content: space-between; 
  gap: 0.5rem; 
  font-size: 1.2rem;
  margin: 0rem 0.3rem 0rem 0.3rem;
  color: var(--text);
}

.plantDate p,
.plantOogst p {
  margin: 0; 
}

.btnOogst {
  background: var(--primary);
  color: var(--text);
  border-radius: 25px;
  height: 2.5rem;
  border: none;
  width: 90%;
  margin: 1rem 2rem 1rem 1rem;
  font-size: 2rem;
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
}

.harvest-screen h2 {
  color: var(--text);
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating i {
  font-size: 2.5rem;
  cursor: pointer;
}

.rating .full {
  color: var(--primary);
}

.rating .empty {
  color: var(--primary);
}

.harvest-actions {
  display: flex;
  gap: 1rem;
}

.harvest-actions button {
  background: var(--primary);
  color: var(--text);
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
