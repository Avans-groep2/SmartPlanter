<template>

  <div class="belangrijke_meldingen">
    <h1 style="color:red;" class="notificatiesH1">Belangrijke meldingen!</h1>
    <p v-if="loading" class="meldingenLaden">Meldingen wordeen geladen...</p>
  
    <table v-else-if="belangrijkeMeldingen.length" class="meldingen-tabel">
      <thead>>
        <tr>
          <th>Moestuin</th>
          <th>Melding</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="melding in belangrijkeMeldingen" 
        :key="melding.MeldingID"
        class="prioriteit-hoog">
          <td>{{ melding.DeviceID }}</td>
          <td>{{ melding.Bericht }}</td>
          <td class="verwijder-cel">
            <button class="verwijderKnop">Verwijderen</button></td>
        </tr>
      </tbody>
    </table>
      <p v-else class="geen-meldingen">Geen belangrijke meldingen.</p>    
    </div>

    <div class="overige_meldingen">
      <h1 class="notificatiesH1">Overige meldingen</h1>
      <p v-if="loading" class="meldingenLaden">Meldingen worden geladen...</p>
    
    <table v-else-if="overigeMeldingen.length" class="meldingen-tabel">
      <thead>
        <tr>
          <th>Moestuin</th>
          <th>Melding</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="melding in overigeMeldingen"
        :key="melding.MeldingID">
          <td>{{ melding.DeviceID }}</td>
          <td>{{ melding.Bericht }}</td>
          <td class="verwijder-cel">
            <button class="verwijderKnop">Verwijderen</button></td>
        </tr>
      </tbody>
    </table>
      <p v-else class="geen-meldingen">Geen overige meldingen.</p>
    </div>
    
    <div v-if="isBeheerder" class="meldingenDropdownAdmin">
        <div class="moestuinKeuzeDropDown" ref="dropdown">
            <div class="dropdown-selected" @click.stop="toggleDropdown">
                {{ gekozenMoestuin || 'Moestuin' }}
                <span class="dropDown">▼</span>
            </div>
            <div v-if="open" class="dropdownKeuzes">
                <div
                    v-for="moestuin in moestuinen"
                    :key="moestuin"
                    class="dropdownKeuze"
                    @click="selecteerMoestuin(moestuin)"
                    >{{ moestuin }}</div>
            </div>
        </div>
    </div>

    <div class="inspiratieKnop"> 
      <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white";>? </a>
    </div>
</template>



<script>
import { ref, onMounted, computed } from 'vue';
import { useFooterSpan } from '../stores/footerSpan';
import { useMoestuinStore } from '../stores/moestuinScherm';

export default {
  name: 'MeldingenPagina',

  setup() {
    const footerStore = useFooterSpan();
    const moestuinStore = useMoestuinStore();

    const meldingen = ref([]);
    const loading = ref(true);

    const isBeheerder = computed(() => {
      if (!footerStore.keycloak) return false;
      return footerStore.keycloak.hasRealmRole('beheerder') ||
        footerStore.keycloak.hasResourceRole('beheerder', 'frontend-imme'); 
    });

    const fetchMeldingen = async () => {
      try{
        loading.value = true;
        const response = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata');
        const data = await response.json();
        meldingen.value = data;
      } catch (error) {
        console.error("Er konden geen meldingen opgehaald worden:", error);
      } finally {
        loading.value = false;
      }
    };

    const belangrijkeMeldingen = computed(() => {
      return meldingen.value.filter(m => m.Prioriteit === 'hoog');
    });

    const overigeMeldingen = computed(() => {
      return meldingen.value.filter(m => m.Prioriteit !== 'hoog');
    });

    onMounted(() => {
      fetchMeldingen();
      setInterval(fetchMeldingen, 60000);
    })


    return { moestuinStore, isBeheerder, footerStore, meldingen, 
      loading, belangrijkeMeldingen, overigeMeldingen};
  },

  data(){
    return {
      open: false,
      moestuinen: ['Moestuin 1', 'Moestuin 2', 'Moestuin 3']
    }
  },

  computed: {
    gekozenMoestuin() {
      return this.moestuinStore.actieveMoestuin;
    }
  },

  methods: {
    toggleDropdown() {
      this.open = !this.open;
    },

    selecteerMoestuin(moestuin) {
      this.moestuinStore.setMoestuin(moestuin);
      this.open = false; 
    },

     handleClickOutside(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.open = false;
      }
    },
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }
}
</script>




<style>
/* Tabel styling om te lijken op de foto */
.meldingen-tabel {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.meldingen-tabel th {
  text-align: left;
  padding: 8px;
  border-bottom: 2px solid #ddd;
  font-weight: 600;
}

.meldingen-tabel td {
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
}

/* Groene rij voor belangrijke meldingen zoals op foto */
.prioriteit-hoog {
  background-color: #2d6a4f;
  color: white;
}

.verwijder-cel {
  text-align: right;
  width: 40px;
}

.verwijder-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.geen-meldingen {
  margin-top: 10px;
  color: #666;
  font-style: italic;
}

/* Behoud je bestaande styles voor de containers... */
.belangrijke_meldingen, .overige_meldingen {
  overflow-y: auto; /* Zorg dat je kunt scrollen als er veel meldingen zijn */
}






.meldingenDropdownAdmin {
  margin-bottom: 5px;
  width: 200px;
  display: flex; 
  position: absolute;
  right: 0.5rem;
  top: 75px;
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

.notificatiesH1 {
  font-size: 28px;
  font-weight: 550; 
  margin-bottom: 3px;
}

.meldingenLaden {
  font-weight: 200;
  font-size: 15px;
  font-style: italic;
}

.belangrijke_meldingen {
  padding: 0.5rem;
  margin-left: 5%;
  margin-top: 2%;
  margin-bottom: 2%;
  width: 80%;
  height: 35vh;
  background-color: #ffffff; 
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); 
}

.overige_meldingen {
  padding: 0.5rem;
  margin-left: 5%;
  margin-bottom: 2%;
  width: 80%;
  min-height: 35vh;
  background-color: #ffffff;  
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); 
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