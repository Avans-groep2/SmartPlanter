<template>

  <div class="inspiratieKnop"> 
    <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white";>? </a>
  </div>

  <div class="moestuinWerk">
    <h1 class="homeH1">U werk nu in, <span style="color: #2d6a4f;">{{ moestuinStore.actieveMoestuin }}</span></h1>
  </div>

  <div v-if="isBeheerder" class="homeDropdownAdmin">
        <div class="moestuinKeuzeDropDown" ref="moestuinDropdown">
            <div class="dropdown-selected" @click="toggleMoestuinDropdown">
                {{ gekozenMoestuin || 'Moestuin' }}
                <span>▼</span>
            </div>
            <div v-if="openMoestuin" class="dropdownKeuzes">
                <div
                    v-for="moestuin in moestuinen"
                    :key="moestuin"
                    class="dropdownKeuze"
                    @click="selecteerMoestuin(moestuin)"
                    >{{ moestuin }}</div>
            </div>
        </div>
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
          <img
              v-if="slot.plant"
              :src="slot.plant.img"
              :alt="slot.plant.naam"
              class="plant-image"
            />
            <span v-else>+</span>
        </button>

        <div
          v-if="openDropdown.buisIndex === buisIndex && openDropdown.slotIndex === slotIndex"
          class="dropdown-menu"
          :class="{'open-up': buis.openUpwards}"
          @click.stop
        >

        <button 
          class="resultaatKnop"
          @click="openOogstModal (buisIndex, slotIndex)">
          Oogsten</button>

          <input
            type="text"
            v-model="searchQuery"
            placeholder="Zoek uw groente of fruit..."
            class="search-input"
          />


          <div class="plant-list">
            <div
              v-for="plant in filteredPlants"
              :key="plant.naam"
              class="plant-item"
              @click="selectPlant(buisIndex, slotIndex, plant)"
            >
              {{ plant.naam }}
            </div>

            <div v-if="filteredPlants.length === 0" class="no-results">
              Geen resultaten gevonden.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="oogstModalOpen" class="modal-overlay">
    <div class="oogst-modal">
      <h2>Hoe was het oogstresultaat?</h2>

      <input
        type="range"
        min="1"
        max="10"
        v-model="oogstScore"/>
      <p>Resultaat: {{ oogstScore }}</p>

      <div class="modal-buttons">
        <button @click="oogstModalOpen = false" class="terugKnop">Terug</button>
        <button @click="bevestigOogst" class="oogstenKnop">Oogsten</button>
      </div>
    </div>
  </div>

</template>

<script>
import { useMoestuinStore } from '../stores/moestuinScherm';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useFooterSpan } from '../stores/footerSpan'

export default {
  name: 'HomePagina',

  setup() {
    const moestuinStore = useMoestuinStore();
    const footerStore = useFooterSpan();

      const isBeheerder = computed(() => {
      if (!footerStore.keycloak) return false;

      return footerStore.keycloak.hasRealmRole('beheerder') ||
        footerStore.keycloak.hasResourceRole('beheerder', 'frontend-imme'); 
    });

    const openMoestuin = ref(false)
    const gekozenMoestuin = ref('')
    const moestuinen = ref(['Moestuin 1', 'Moestuin 2', 'Moestuin 3'])
    const dropdown = ref(null)

    const toggleMoestuinDropdown = () => {
      openMoestuin.value = !openMoestuin.value
    }

    const selecteerMoestuin = (moestuin) => {
      gekozenMoestuin.value = moestuin
      openMoestuin.value = false
    }

    const openDropdown = ref({ buisIndex: null, slotIndex: null });
    const searchQuery = ref('');

    const toggleSlotDropdown = (buisIndex, slotIndex) => {
      const isSame =
        openDropdown.value.buisIndex === buisIndex &&
        openDropdown.value.slotIndex === slotIndex;

      openDropdown.value = isSame
        ? { buisIndex: null, slotIndex: null }
        : { buisIndex, slotIndex };

      searchQuery.value = '';
    };

    const handleClickOutside = (event) => {
      if (moestuinDropdown.value && !moestuinDropdown.value.contains(event.target)) {
        openMoestuin.value = false
    }

    const openSlotEl = document.querySelector('.dropdown-menu.open');
      if (openSlotEl && !openSlotEl.contains(event.target)) {
        openDropdown.value = { buisIndex: null, slotIndex: null };
        searchQuery.value = '';
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside, true)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {toggleMoestuinDropdown, moestuinStore, isBeheerder, 
      openMoestuin, gekozenMoestuin, moestuinen, selecteerMoestuin, 
      openDropdown, searchQuery, toggleSlotDropdown, moestuinDropdown};

  },

  data() {
    return {
      oogstModalOpen: false,
      oogstScore: 5,
      oogstTarget: {
        buisIndex:null,
        slotIndex:null
      },
      allePlanten: [
        { naam: 'Tomaat', img: '/plantenimg/tomaat.png' },
        { naam: 'Paprika', img: '/plantenimg/paprika.png' },
        { naam: 'Peper', img: '/plantenimg/peper.png' },
        { naam: 'Sla', img: '/plantenimg/sla.png' },
        { naam: 'Aubergine', img: '/plantenimg/aubergine.png' },
        { naam: 'Courgette', img: '/plantenimg/courgette.png' },
        { naam: 'Basilicum', img: '/plantenimg/basilicum.png' },
        { naam: 'Munt', img: '/plantenimg/munt.png' },
        { naam: 'Peterselie', img: '/plantenimg/peterselie.png' },
        { naam: 'Rozemarijn', img: '/plantenimg/rozemarijn.png' },
        { naam: 'Spinazie', img: '/plantenimg/spinazie.png' },
        { naam: 'Snijbiet', img: '/plantenimg/snijbiet.png' },
        { naam: 'Boerenkool', img: '/plantenimg/boerenkool.png' },
        { naam: 'Komkommer', img: '/plantenimg/komkommer.png' },
        { naam: 'Aardbei', img: '/plantenimg/aardbei.png' },
        { naam: 'Framboos', img: '/plantenimg/framboos.png' },
        { naam: 'Blauwe Bessen', img: '/plantenimg/blauweBessen.png' },
        { naam: 'Vijgen', img: '/plantenimg/vijgen.png' }
      ]
    };
  },

  computed: {
    moestuinLayout(){
      return this.moestuinStore.huidigeLayout;
    },

    filteredPlants() {
      return this.allePlanten.filter(plant => 
        plant.naam.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },

  methods: {
    selectPlant(buisIndex, slotIndex, plant) {
      this.moestuinStore.setPlant(buisIndex, slotIndex, plant);
      this.openDropdown = { buisIndex: null, slotIndex: null };
      this.searchQuery = '';
    },

    openOogstModal(buisIndex, slotIndex) {
      this.oogstTarget = {buisIndex, slotIndex};
      this.oogstScore = 5;
      this.oogstModalOpen = true;
    },

    bevestigOogst() {
      const {buisIndex, slotIndex} = this.oogstTarget;

      this.moestuinStore.oogstPlant(
        buisIndex,
        slotIndex,
        this.oogstScore
      );

      this.oogstModalOpen = false;
      this.openDropdown = { buisIndex: null, slotIndex: null };
    },  

    toggleDropdown(buisIndex, slotIndex) {
      const isSame =
    this.openDropdown.buisIndex === buisIndex &&
    this.openDropdown.slotIndex === slotIndex;

    this.openDropdown = isSame
      ? { buisIndex: null, slotIndex: null }
      : { buisIndex, slotIndex };

    this.searchQuery = '';
    }
  }
};
</script>

<style scoped>

.dropdown-menu.open {
  display: block;
}

.plant-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.homeDropdownAdmin {
  position: absolute;
  top: 2rem;
  right: 1rem;
  margin-bottom: 5px;
  width: 200px;
  display: flex; 
  z-index: 3000;
} 

.moestuinKeuzeDropDown {
  position: relative;
  width: 180px;
  margin-bottom: 25px;
}

.dropdown-selected {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid #2d6a4f;
  border-radius: 5px;
  padding: 10px;
  font-size: 18px;
  color: #2d6a4f;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdownKeuzes {
  text-align: left;
  position: absolute;
  top: 105%;   
  width: 100%;
  border: 1px solid #2d6a4f;
  border-radius: 5px;
  overflow: hidden;
}

.dropdownKeuze {
  padding: 10px;
  font-size: 18px;
  color: #2d6a4f;
  cursor: pointer;
  background-color: white;
  transition: 0.15s ease;
}

.dropdownKeuze:hover {
  background-color: #2d6a4f;
  color: white;
}

/*------------------*/
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 15px;
}

.resultaatKnop {
  height: 25px;
  width: 100%;
  background-color:#2d6a4f;
  border: none;
  color: white;
  margin-bottom: 2%;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.oogst-modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.modal-buttons {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

.terugKnop, .oogstenKnop{
  background-color: #2d6a4f;
  border-radius: 5px;
  border: 2px black;
  color: white;
  padding: 5px;
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
}

.plant-slot-button {
    width: 60px;
    height: 60px;
    border-radius: 50%; 
    background-color: #3c803c;
    border: 3px solid #2d6a4f;
    color: #b5dea2;
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
    z-index: 2000;
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