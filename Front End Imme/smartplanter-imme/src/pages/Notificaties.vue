<template>

  <div class="belangrijke_meldingen">
    <h1 style="color:red;" class="notificatiesH1">Belangrijke meldingen!</h1>
    <p class="meldingenLaden">Hier worden meldingen geladen...</p></div>
  <div class="overige_meldingen">
    <h1 class="notificatiesH1">Overige meldingen</h1>
    <p class="meldingenLaden">Hier worden meldingen geladen...</p></div>
    
    <div v-if="isBeheerder" class="meldingenDropdownAdmin">
        <div class="moestuinKeuzeDropDown" ref="dropdown">
            <div class="dropdown-selected" @click="toggleDropdown">
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
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useFooterSpan } from '../stores/footerSpan';

export default {
  name: 'MeldingenPagina',

  setup() {
    const footerStore = useFooterSpan();

      const isBeheerder = computed(() => {
      if (!footerStore.keycloak) return false;

      return footerStore.keycloak.hasRealmRole('beheerder') ||
        footerStore.keycloak.hasResourceRole('beheerder', 'frontend-imme'); 
    });

    const open=ref(false)
    const gekozenMoestuin = ref('')
    const moestuinen = ref(['Moestuin 1', 'Moestuin 2', 'Moestuin 3'])
    const dropdown = ref(null)

    const toggleDropdown = () => {
      open.value = !open.value
    }

    const selecteerMoestuin = (moestuin) => {
      gekozenMoestuin.value = moestuin
      open.value = false
    }

    const handleClickOutside = (event) => {
      if (dropdown.value && !dropdown.value.contains(event.target)) {
        open.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside, true)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return { isBeheerder, open, gekozenMoestuin, moestuinen, toggleDropdown, selecteerMoestuin, dropdown};
  },

}
</script>




<style>

.meldingenDropdownAdmin {
  margin-bottom: 5px;
  width: 200px;
  display: flex; 
  position: absolute;
  right: 10%;
  top: 10%;
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
  width: 90%;
  height: 35vh;
  background-color: #ffffff; 
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); 
}

.overige_meldingen {
  padding: 0.5rem;
  margin-left: 5%;
  margin-bottom: 2%;
  width: 90%;
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