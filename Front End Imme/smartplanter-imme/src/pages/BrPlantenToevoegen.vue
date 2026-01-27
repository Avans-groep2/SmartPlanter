<template>

    <div class="plantToevoegen">
        <p class="testPlant">Test scherm</p>
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
                    <td>{{ plant.PlantSoort }}</td>
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
import { useFooterSpan } from '@/stores/footerSpan';
import { useMoestuinStore } from '@/stores/moestuinScherm';
import { computed, ref, onMounted } from 'vue';

export default {
  name: 'PlantToevoegenAdminPagina',

  setup() {
    const footerStore = useFooterSpan();
    const moestuinStore = useMoestuinStore();
    const loading = ref(false);

    const plantInfo = computed (() => moestuinStore.plantInfo);

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

    onMounted(() => {
        fetchPlantInfo();
    });

    return {moestuinStore, footerStore, plantInfo, loading};
}
}


</script>

<style>
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

.testPlant {
    color:black;
}

.plantToevoegen {
    background: white;
    padding: 20px;
    width: 90%;
    margin-top: 2rem;
    margin-left: 5%;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    overflow-y: auto;
}

</style>