<template>

    <div class="plantToevoegen">
        <h2 class="plantInformatie">Informatie van de Plant</h2>

        <div class="inputPlant">
            <input type="number" v-model="idPlantKeuze" placeholder="PlantID" class="adminPlant-input"/>
            <input type="text" v-model="plantSoortKeuze" placeholder="Plant soort" class="adminPlant-input"/> 
            <input type="number" v-model="phMinKeuze" placeholder="pHminimale" class="adminPlant-input"/>
            <input type="number" v-model="phMaxKeuze" placeholder="pHmaximale" class="adminPlant-input"/> 
            <input type="number" v-model="groeitijdKeuze" placeholder="Groeitijd plant" class="adminPlant-input"/> 

            <button class="dataBeheerKnop" @click="insertNieuwePlantInfo">Koppel</button>
            <button class="dataBeheerKnop" @click="updateToegevoegdePlanten">Update</button>
        </div>

        <div class="plantToevoegTabel-container">
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
                    :key="plant.PlantID"
                    @click="idPlantKeuze = plant.PlantID; plantSoortKeuze = plant.Plantsoort
                            phMinKeuze = plant.PhMin; phMaxKeuze = plant.PhMax; groeitijdKeuze = plant.Groeitijd">
                    <td>{{ plant.PlantID }}</td>
                    <td>{{ plant.Plantsoort }}</td>
                    <td>{{ plant.PhMin }}</td>
                    <td>{{ plant.PhMax }}</td>
                    <td>{{ plant.Groeitijd }}</td>
                </tr>
                <tr v-if="!plantInfo || plantInfo.length === 0">
                    <td colspan="5">Laden...</td>
                </tr>
            </tbody> 
        </table>
        </div>
    </div>

</template>

<script>
import { useMoestuinStore } from '../stores/moestuinScherm';
import { computed, ref, onMounted } from 'vue';

export default {
  name: 'PlantToevoegenAdminPagina',

  setup() {
    const moestuinStore = useMoestuinStore();
    const loading = ref(false);

    const idPlantKeuze = ref(null);
    const plantSoortKeuze = ref("");
    const phMinKeuze = ref(null);
    const phMaxKeuze = ref(null);
    const groeitijdKeuze = ref(null);

    const plantInfo = computed(() => moestuinStore.plantInfo || []);

    const fetchPlantInfo = async () => {
      try{
        loading.value = true;
        const response = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planten');
        const data = await response.json();
        moestuinStore.plantInfo = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const insertNieuwePlantInfo = async () => {
    if (!idPlantKeuze.value) return alert("Vul Plant ID in");
  
  const url = `https://smartplanters.dedyn.io:1880/smartplantedit?table=Planten` +
              `&plantID=${idPlantKeuze.value}` +
              `&plantSoort=${encodeURIComponent(plantSoortKeuze.value)}` +
              `&phMin=${phMinKeuze.value}` +
              `&phMax=${phMaxKeuze.value}` +
              `&groeitijd=${groeitijdKeuze.value}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        
        if (data.error) {
            alert("Database Error: " + data.code);
        } else {
            idPlantKeuze.value = null;
            plantSoortKeuze.value = "";
            phMinKeuze.value = null;
            phMaxKeuze.value = null;
            groeitijdKeuze.value = null;
            await fetchPlantInfo(); 
            alert("Plant succesvol toegevoegd!");
        }
    } catch (err) {
        alert("Fout bij toevoegen plant " + err.message);
    }
    };

    const updateToegevoegdePlanten = async () => {
        if (!idPlantKeuze.value) return alert("Deze waarde kan niet geupdate worden");

        const url = `https://smartplanters.dedyn.io:1880/harvest?table=Planten` + 
                    `&plantID=${idPlantKeuze.value}` +
                    `&plantSoort=${encodeURIComponent(plantSoortKeuze.value)}` +
                    `&phMin=${phMinKeuze.value}` +
                    `&phMax=${phMaxKeuze.value}` +
                    `&groeitijd=${groeitijdKeuze.value}`;
        try{
            const res = await fetch(url);
            const data = await res.json();
        
        if (data.error) {
            alert("Database Error: " + data.code);
        } else {
            alert("Plant succesvol bijgewerkt!");
            await fetchPlantInfo();
            idPlantKeuze.value = null;
            plantSoortKeuze.value = "";
            phMinKeuze.value = null;
            phMaxKeuze.value = null;
            groeitijdKeuze.value = null;
            
        }
    } catch (err) {
        alert("Fout bij toevoegen plant " + err.message); 
    }
    };

    onMounted(() => {
        fetchPlantInfo();
    });

    return {plantInfo, loading, insertNieuwePlantInfo, updateToegevoegdePlanten,
        groeitijdKeuze, phMaxKeuze, phMinKeuze, plantSoortKeuze, idPlantKeuze
    };
}
}


</script>

<style>
.inputPlant{
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.plantToevoegTabel-container {
    overflow-y: auto;
    flex-grow: 1;
    border: 1px solid #eee;
}

.adminPlant-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 150px;
}

.dataBeheerKnop {
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
    font-weight: 800;
}

.plantToevoegen {
    background: white;
    padding: 20px;
    width: 90%;
    max-height: 75vh;
    margin: 2rem auto;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
}

</style>