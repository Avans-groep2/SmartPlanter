<template>

  <div class="belangrijke_meldingen">
    <h1 style="color:red;" class="notificatiesH1">Belangrijke meldingen!</h1>
    <p v-if="loading" class="meldingenLaden">Meldingen worden geladen...</p>
  
    <table v-else-if="belangrijkeMeldingen.length > 0" class="meldingen-tabel">
      <thead>
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
          <td>
            <button class="verwijderMeldingKnop" @click="verwijderMelding(melding)">✖</button>
          </td>
        </tr>
      </tbody>
    </table>
      <p v-else-if="!loading" class="geen-meldingen">Geen belangrijke meldingen.</p>    
    </div>

    <div class="overige_meldingen">
      <h1 class="notificatiesH1">Overige meldingen</h1>
      <p v-if="loading" class="meldingenLaden">Meldingen worden geladen...</p>
    
    <table v-else-if="overigeMeldingen.length > 0" class="meldingen-tabel">
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
          <td>
             <button class="verwijderMeldingKnop" @click="verwijderMelding(melding)">✖</button>
          </td>
        </tr>
      </tbody>
    </table>
      <p v-else-if="!loading" class="geen-meldingen">Geen overige meldingen.</p>
    </div>

    <div class="inspiratieKnop"> 
      <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white";>? </a>
    </div>
</template>



<script>
import { computed, onMounted } from 'vue';
import { useFooterSpan } from '../stores/footerSpan';
import { useMoestuinStore } from '../stores/moestuinScherm';

export default {
  name: 'MeldingenPagina',

  setup() {
    const footerStore = useFooterSpan();
    const moestuinStore = useMoestuinStore();

    const meldingen = computed(() => moestuinStore.meldingen);
    const loading = computed(() => moestuinStore.loadingMeldingen);

    const fetchMeldingen = async () => {
      try{
        loading.value = true;
        const response = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Meldingen');
        const data = await response.json();
        moestuinStore.setMeldingen(data);

        meldingen.value = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error(error);
        meldingen.value = [];
      } finally {
        loading.value = false;
      }
    };

    onMounted (() => {
      fetchMeldingen
    });

    const belangrijkeMeldingen = computed(() => {
      if (!meldingen.value) return [];
      return meldingen.value.filter(m => m && m.Prioriteit?.toLowerCase() === 'hoog');
    });

    const overigeMeldingen = computed(() => {
      if(!meldingen.value) return [];
      return meldingen.value.filter(m => m && m.Prioriteit?.toLowerCase() !== 'hoog');
    });

    return { moestuinStore, footerStore, meldingen, 
      loading, belangrijkeMeldingen, overigeMeldingen};
  },

  methods: {
    async verwijderMelding(melding) {
  const meldingID = melding.MeldingID;
  if (!meldingID) return;

  this.moestuinStore.verwijderMeldingLokaal(meldingID);    

  const url = `https://smartplanters.dedyn.io:1880/cleardata?table=Meldingen&meldingID=${meldingID}`;

  try {
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) {
        console.error("Database kon melding niet verwijderen");
        this.moestuinStore.fetchMeldingenAction(); 
      }
    } catch (err) {
      console.error("Netwerkfout");
    }
  }}}
</script>




<style>
.meldingen-tabel {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.meldingen-tabel th {
  text-align: left;
  padding: 8px;
  border-bottom: 2px solid #a7d3bf;
  font-weight: 600;
}

.meldingen-tabel td {
  padding: 10px 8px;
  border-bottom: 1px solid #a2ebbc;
}

.geen-meldingen {
  margin-top: 10px;
  color: #666;
  font-style: italic;
}

.belangrijke_meldingen, .overige_meldingen {
  overflow-y: auto; 
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
    bottom: 80px; 
    z-index: 1000;
    transition: background-color 0.2s;
}

.inspiratieKnop:hover {
  background-color: #3c803c;
}

.verwijderMeldingKnop {
  background-color: #2d6a4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.verwijderMeldingKnop:hover {
  background-color: #66b893;
}

.meldingen-tabel th:last-child, 
.meldingen-tabel td:last-child {
  text-align: right;
  width: 50px;
}

</style>