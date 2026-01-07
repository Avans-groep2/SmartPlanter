<template>

  <div class="inspiratieKnop"> 
    <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white";>? </a>
  </div>

  <div class="homeH1">
    <h1>U werk nu in, <span> moestuin 1</span></h1>
  </div>

  <div class="garden-container">
    <div 
      v-for="(buis, buisIndex) in moestuinLayout" 
      :key="buisIndex" 
      class="moestuinbuis"
      :class="{ 'buis-dropdown-open': buisHeeftDropdownOpen(buis) }"
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
          v-if="slot.showDropdown"
          class="dropdown-menu"
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
export default {
  name: 'HomePagina',

  data() {
    const createBuis = () => ({
      slots: Array(4).fill(null).map(() => ({ plant: null, showDropdown: false }))
    });

    return {
      searchQuery: '',
      allePlanten: [
        'Tomaat', 'Wortel', 'Broccoli', 'Sla', 'Aardbei', 
        'Komkommer', 'Paprika', 'Aubergine', 'Courgette', 
        'Appel', 'Radijs', 'Framboos', 'Ui', 'Knoflook', 
        'Bramen', 'Basilicum'
      ],
      moestuinLayout: [
        createBuis(),
        createBuis(),
        createBuis(),
      ]
    };
  },
  computed: {
    filteredPlants() {
      if (!this.searchQuery) {
        return this.allePlanten;
      }
      const searchLower = this.searchQuery.toLowerCase();
      return this.allePlanten.filter(plant => 
        plant.toLowerCase().includes(searchLower)
      );
    }
  },
  methods: {
    buisHeeftDropdownOpen(buis) {
      return buis.slots.some(slot => slot.showDropdown);
    },

    toggleDropdown(buisIndex, slotIndex) {
      this.closeAllDropdowns();

      const slot = this.moestuinLayout[buisIndex].slots[slotIndex];
      slot.showDropdown = !slot.showDropdown;

      if (slot.showDropdown) {
        this.searchQuery = '';
      }
    },

    closeAllDropdowns() {
      this.moestuinLayout.forEach(buis => {
        buis.slots.forEach(slot => {
          slot.showDropdown = false; 
        });
      });
    },

    selectPlant(buisIndex, slotIndex, plantNaam) {
      const slot = this.moestuinLayout[buisIndex].slots[slotIndex];
      slot.plant = plantNaam;
      slot.showDropdown = false;
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

.homeH1{
  color:black;
  font-size: 20px;
  font-weight: 200;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


.garden-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
}

.moestuinbuis {
  background-color: #c1c0c0; 
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
    background-color: #90ee90; 
    border: 3px solid #3c803c;
    color: #333;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s;
}

.plant-slot-button:hover {
    background-color: #a7f7a7;
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