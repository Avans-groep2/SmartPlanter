<template>
  <SidebarNavbar />

  <div class="Dashboard">
    <header>
      <WelcomeMessage />
      <PlantSelector v-model="selectedDeviceId"/>
    </header>

    <div class="plants-container">
      <PlantCard
        v-for="plant in filteredPlants"
        :key="plant.Plantpositie"
        :name="plant.Plantsoort"
        :position="plant.Plantpositie"
        :plant-date="plant.PlantDatum"
        :harvest-date="plant.OogstDatum"
        @plant-harvested="removePlant"
      />

      <AddPlantCard
        v-if="selectedDeviceId"
        :deviceID="selectedDeviceId"
        @plant-added="reloadPlantPositions"/>
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

/* --------------------
   State
-------------------- */
const selectedDeviceId = ref(null)
const planters = ref([])
const plants = ref([])
const plantPositions = ref([])

/* --------------------
   Lifecycle
-------------------- */
onMounted(async () => {
  await fetchAllData()
})

/* --------------------
   Fetch functies
-------------------- */
async function fetchAllData() {
  await Promise.all([fetchPlanters(), fetchPlants(), fetchPlantPositions()])
}

async function fetchPlanters() {
  const res = await fetch(
    'https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter'
  )
  planters.value = await res.json()
}

async function fetchPlants() {
  const res = await fetch(
    'https://smartplanters.dedyn.io:1880/smartplantdata?table=Planten'
  )
  plants.value = await res.json()
}

async function fetchPlantPositions() {
  const res = await fetch(
    'https://smartplanters.dedyn.io:1880/smartplantdata?table=PlantPositie'
  )
  plantPositions.value = await res.json()
}

/* --------------------
   Herladen na toevoegen
-------------------- */
async function reloadPlantPositions() {
  console.log('🔄 Herladen plantposities...')
  await fetchPlantPositions()
}

function removePlant(position) {
  // Filter de plantpositie uit de lijst
  plantPositions.value = plantPositions.value.filter(
    p => p.Plantpositie !== position
  )
}

/* --------------------
   Computed properties
-------------------- */
const filteredPlants = computed(() => {
  if (!selectedDeviceId.value) return []

  // Filter plantposities op DeviceID en dat er een Plantpositie is
  const positions = plantPositions.value.filter(
    p =>
      p.DeviceID === selectedDeviceId.value &&
      p.Plantpositie !== null &&
      p.Plantpositie !== ''
  )

  // Voeg plantgegevens toe
  return positions.map(p => {
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
  margin-left: 5rem;
}

.plants-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 325px));
  gap: 20px;
  padding: 20px;
}
</style>
