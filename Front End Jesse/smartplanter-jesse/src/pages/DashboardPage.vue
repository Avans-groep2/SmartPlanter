  <template>
    <SidebarNavbar/>
    <div class="Dashboard">
      <header>
        <WelcomeMessage/>
        <PlantSelector @change="selectedDeviceId = $event" />
      </header>

      <div class="plants-container">
  <PlantCard
          v-for="plant in filteredPlants" 
          :key="plant.PlantenTeller"
          :name="plant.Plantsoort"
          :position="plant.Plantpositie"
          :plant-date="plant.PlantDatum"
          :harvest-date="plant.OogstDatum"
        />
      <AddPlantCard/>
      </div>
    </div>
    
    
  </template>

  <script setup>
  import { ref, computed, onMounted } from 'vue'

  import SidebarNavbar from '@/components/SidebarNavbar.vue'
  import WelcomeMessage from '@/components/WelcomeMessage.vue'
  import PlantCard from '@/components/PlantCard.vue'
  import PlantSelector from '@/components/PlantSelector.vue'
  import AddPlantCard from '@/components/AddPlantCard.vue'

  // state
  const selectedDeviceId = ref(null) // huidige geselecteerde device
  const plants = ref([])             // Plantgegevens
  const plantPositions = ref([])     // Posities van planten
  const planters = ref([])           // Devices/planters

  // fetch data bij mount
  onMounted(async () => {
    await fetchPlanters()
    await fetchPlants()
    await fetchPlantPositions()
  })

  // fetch functies
  async function fetchPlanters() {
    const res = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter')
    planters.value = await res.json()
  }

  async function fetchPlants() {
    const res = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planten')
    plants.value = await res.json()
  }

  async function fetchPlantPositions() {
    const res = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=PlantPositie')
    plantPositions.value = await res.json()
  }

  // gefilterde planten per geselecteerd device
  const filteredPlants = computed(() => {
    if (!selectedDeviceId.value) return []

    // selecteer posities van het geselecteerde device
    const devicePositions = planters.value
      .filter(d => d.DeviceID === selectedDeviceId.value)
      .flatMap(d => plantPositions.value.filter(p => p.PlantenTeller === d.PlantenTeller))

    // voeg plantgegevens toe aan posities
    return devicePositions.map(p => {
      const plantData = plants.value.find(pl => pl.PlantID === p.PlantID)
      return {
        ...p,
        Plantsoort: plantData ? plantData.Plantsoort : 'Onbekend'
      }
    })
  })
  </script>

  <style>

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 1rem;
    }

    .Dashboard {
      min-height: 100vh;
      width: auto;
      margin-left: 5rem;
      overflow-y: hidden;
      overflow-x: hidden;
    }

.plants-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 400px)); /* minimaal 250px breed, groei tot 1fr */
  gap: 16px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}


  </style>