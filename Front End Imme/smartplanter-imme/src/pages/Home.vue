<template>

  <div class="inspiratieKnop"> 
    <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white";>? </a>
  </div>

  <div class="moestuinWerk">
    <h1 class="homeH1">U werk nu in, <span>{{ moestuinStore.actieveMoestuin }}</span></h1>
  </div>

  <div class="garden-container">
    <div 
      v-for="(buis, buisIndex) in moestuinLayout" 
      :key="buisIndex" 
      class="moestuinbuis"
    >
      <div
        v-for="(slot, slotIndex) in buis.slots"
        :key="slotIndex"
        class="slot-wrapper"
      >
        <button
          class="plant-slot-button"
          @click.stop="toggleDropdown(buisIndex, slotIndex)"
        >
          {{ slot.plant ? slot.plant : '+' }}
        </button>

        <div
          v-if="openDropdown.buisIndex === buisIndex && openDropdown.slotIndex === slotIndex"
          class="dropdown-menu"
          :class="{'open-up': buis.openUpwards}"
          @click.stop
        >
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Zoek groente/fruit..."
            class="search-input"
          />

          <div class="plant-list">
            <div
              v-for="plant in filteredPlants"
              :key="plant"
              class="plant-item"
              @click="selectPlant(buisIndex, slotIndex, plant)"
            >
              {{ plant }}
            </div>

            <div v-if="filteredPlants.length === 0" class="no-results">
              Geen resultaten gevonden.
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import { useMoestuinStore } from '@/stores/moestuinScherm';

export default {
  name: 'HomePagina',

  setup() {
    const moestuinStore = useMoestuinStore();
    return {moestuinStore};
  },

  data() {
    return {
      searchQuery: '',
      openDropdown: {
        buisIndex: null,
        slotIndex: null
      },
      allePlanten: [
        'Tomaat', 'Wortel', 'Broccoli', 'Sla', 'Aardbei', 
        'Komkommer', 'Paprika', 'Aubergine', 'Courgette', 
        'Appel', 'Radijs', 'Framboos', 'Ui', 'Knoflook', 
        'Bramen', 'Basilicum'
      ]
    };
  },

  computed: {
    moestuinLayout(){
      return this.moestuinStore.huidigeLayout;
    },

    filteredPlants() {
      return this.allePlanten.filter(plant => 
        plant.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },

  methods: {
    selectPlant(buisIndex, slotIndex, plantNaam) {
      this.moestuinStore.setPlant(buisIndex, slotIndex, plantNaam);
      this.closeAllDropdowns();
    },

    toggleDropdown(buisIndex, slotIndex) {
      const isSame =
    this.openDropdown.buisIndex === buisIndex &&
    this.openDropdown.slotIndex === slotIndex;

    this.openDropdown = isSame
      ? { buisIndex: null, slotIndex: null }
      : { buisIndex, slotIndex };

    this.searchQuery = '';
    },

    closeAllDropdowns() {
      this.openDropdown = {buisIndex: null, slotIndex:null};
    },

  handleClickOutside() {
      this.closeAllDropdowns();
    }
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style>

.moestuinWerk{
  margin-left: 1rem;
  margin-top: 0.5rem;
}

.homeH1{
  color:black;
  font-size: 40px;
  font-weight: 700;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


.garden-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
}

.moestuinbuis {
  background-color: #ffffff; 
  width: 100%; 
  height: 100px; 
  margin-top: 30px;
  border-radius: 10px;
  display: flex; 
  justify-content: space-around; 
  align-items: center; 
  position: relative; 
  transition: z-index 0s;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}

.buis-dropdown-open {
  z-index: 100;
}

.slot-wrapper {
    position: relative;
    z-index: 10; 
}

.plant-slot-button {
    width: 60px;
    height: 60px;
    border-radius: 50%; 
    background-color: #3c803c;
    border: 3px solid #2d6a4f;
    color: #95c87e;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s;
}

.plant-slot-button:hover {
    background-color: rgb(99, 169, 99);
}

.dropdown-menu {
    background-color: white;
    position: absolute;
    top: 70px; 
    left: 50%;
    transform: translateX(-50%); 
    width: 250px;
    color: #2d6a4f;
    border: 1px solid #2d6a4f;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    max-height: 300px;
    overflow-y: auto;
    cursor: pointer;
    z-index: 1000;
}

.dropdown-menu.open-up {
  top: auto;
  bottom: 70px;
}

.search-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.plant-item {
    padding: 8px 10px;
    cursor: pointer;
    border-radius: 4px;
}

.plant-item:hover {
    background-color: #f0f0f0;
    color: #3c803c;
}

.no-results {
    color: #999;
    padding: 10px;
    text-align: center;
}

.inspiratieKnop {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #2d6a4f;
    border: 3px solid #2d6a4f;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    right: 20px;
    bottom: 80px; /* ruimte boven footer */
    z-index: 1000;
    transition: background-color 0.2s;
}

.inspiratieKnop:hover {
  background-color: #3c803c;
}

</style>