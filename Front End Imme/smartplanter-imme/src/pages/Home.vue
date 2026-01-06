<template>

  <div class="accountknop">
      <a href="https://141.148.237.73:8443/realms/smartplanter/account/" class="settingsknop">Account instellingen</a>
      <a href="https://141.148.237.73:8443/realms/smartplanter/protocol/openid-connect/auth?client_id=account-console&redirect_uri=https%3A%2F%2F141.148.237.73%3A8443%2Frealms%2Fsmartplanter%2Faccount%2Faccount-security%2Fsigning-in&state=8c3aac17-1241-4bd4-9de2-d11824f4ed4a&response_mode=query&response_type=code&scope=openid&nonce=898ca48e-a8a8-4ddc-8bf2-39a537423d6e&kc_action=UPDATE_PASSWORD&code_challenge=LnzxFopox0ypY48supME6ceKSjZy8OUotdIRR13--Io&code_challenge_method=S256" class="settingsknop">Wachtwoord bewerken</a>
    </div>
  <div class="inspiratieKnop"> 
    <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white";>? </a>
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
/* Algemene container voor centrering */
.garden-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
}

/* Stijl voor de moestuinbuizen */
.moestuinbuis {
  background-color: #bcbbbb; 
  width: 100%; 
  height: 100px; /* Vaste hoogte voor de buis */
  margin-top: 30px;
  border-radius: 10px;
  display: flex; /* Zorgt ervoor dat de slots naast elkaar staan */
  justify-content: space-around; /* Verdeelt de slots gelijkmatig */
  align-items: center; /* Centreert de slots verticaal in de buis */
  position: relative; /* Belangrijk voor het positioneren van de dropdowns */
  transition: z-index 0s;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}

.buis-dropdown-open {
  z-index: 100;
}

/* Container voor elke knop/slot en zijn dropdown */
.slot-wrapper {
    position: relative;
    z-index: 10; /* Zorgt ervoor dat de dropdown over de andere buizen valt */
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