<template>

    <div class="plantToevoegen">
        <h class="plantInformatie">Informatie van de Plant</h>

        <input type="number" v-model="idPlantKeuze" placeholder="PlantID" class="adminPlant-input"/>
        <input type="text" v-model="plantSoortKeuze" placeholder="Plant soort" class="adminPlant-input"/> 
        <input type="number" v-model="phMinKeuze" placeholder="pHminimale plant" class="adminPlant-input"/>
        <input type="number" v-model="phMaxKeuze" placeholder="pHmaximale plant" class="adminPlant-input"/> 
        <input type="number" v-model="groeitijdKeuze" placeholder="Groeitijd plant" class="adminPlant-input"/> 

        <button class="plantInfoInsert" @click="insertNieuwePlantInfo">Koppel</button>

        <table class="plantToevoegTabel">
            <thead>
                <tr>
                    <th>PlantID</th>
                    <th>PlantSoort</th>
                    <th>PhMin</th>
                    <th>PhMax</th>
                    <th>Groeitijd</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="plant in plantInfo"
                    :key="plant.PlantID">
                    <td>{{ plant.PlantID }}</td>
                    <td>{{ plant.Plantsoort }}</td>
                    <td>{{ plant.PhMin }}</td>
                    <td>{{ plant.PhMax }}</td>
                    <td>{{ plant.Groeitijd }}</td>
                </tr>
                <tr v-if="plantInfo.length === 0">
                    <td colspan="5">Laden...</td>
                </tr>
            </tbody> 
        </table>
    </div>

</template>

<script>
import { useFooterSpan } from '../stores/footerSpan';
import { useMoestuinStore } from '../stores/moestuinScherm';
import { computed, ref, onMounted } from 'vue';

export default {
  name: 'PlantToevoegenAdminPagina',

  setup() {
    const footerStore = useFooterSpan();
    const moestuinStore = useMoestuinStore();
    const loading = ref(false);

    const idPlantKeuze = ref(0);
    const plantSoortKeuze = ref("");
    const phMinKeuze = ref(0);
    const phMaxKeuze = ref(0);
    const groeitijdKeuze = ref(0);

    const plantInfo = computed(() => moestuinStore.plantInfo || []);

    const fetchPlantInfo = async () => {
      try{
        loading.value = true;
        const response = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planten');
        const data = await response.json();
        
        moestuinStore.plantInfo = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error(error);
        plantInfo.value = [];
      } finally {
        loading.value = false;
      }
    };

    const insertNieuwePlantInfo = async () => {
    if (!plantIDKeuze.value.trim()) return alert("Vul een Device ID in");
  
  const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Planten` +
              `&plantID=${encodeURIComponent(idPlantKeuze.value)}` +
              `&plantsoort=${encodeURIComponent(plantSoortKeuze.value)}` +
              `&phMin=${encodeURIComponent(phMinKeuze.value)}` +
              `&phMax=${encodeURIComponent(phMaxKeuze.value)}` +
              `&groeitijd=${encodeURIComponent(groeitijdKeuze.value)}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.error) {
        alert("Database Error: " + data.code);
        } else {
        idPlantKeuze.value = 0;
        plantSoortKeuze = "";
        phMinKeuze = 0;
        phMaxKeuze = 0;
        groeitijdKeuze = 0;
        await fetchPlantInfo(); 
        alert("Device succesvol toegevoegd!");
        }
    } catch (err) {
        alert("Fout bij device aanmaken: " + err.message);
    }
    };

    onMounted(() => {
        fetchPlantInfo();
    });

    return {moestuinStore, footerStore, plantInfo, loading, insertNieuwePlantInfo,
        groeitijdKeuze, phMaxKeuze, phMinKeuze, plantSoortKeuze, idPlantKeuze
    };
}
}


</script>

<style>
.adminPlant-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 250px;
}

.plantInfoInsert {
  background-color: #2d6a4f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.plantToevoegTabel{
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.plantToevoegTabel th {
  text-align: left;
  padding: 12px 8px;
  border-bottom: 2px solid #a7d3bf;
}

.plantToevoegTabel td {
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
}

.plantInformatie {
    color:black;
    font-weight: 500;
}

.plantToevoegen {
    background: white;
    padding: 20px;
    width: 90%;
    max-height: 80%;
    margin-top: 2rem;
    margin-left: 5%;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    overflow-y: auto;
}

</style>