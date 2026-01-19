<template>
  <SidebarNavbar />

  <div class="Data">
    <header>
      <WelcomeMessage />
      <PlantDropdown @change="selectedDeviceId = $event" />
    </header>

    <div class="chartContainer">
      <!-- Temperatuur -->
    <DataChart 
      :device-id="selectedDeviceId" 
      data-key="temperatuur" 
      label="Temperatuur" 
      unit="°C" 
      :threshold="30" 
    />

    <!-- pH -->
    <DataChart 
      :device-id="selectedDeviceId" 
      data-key="ph" 
      label="pH" 
      unit="pH" 
      :threshold="6.5" 
    />

    <!-- EC -->
    <DataChart 
      :device-id="selectedDeviceId" 
      data-key="ec" 
      label="EC" 
      unit="mS/cm" 
      :threshold="2.5" 
    />

    <!-- Flow Begin -->
    <DataChart 
      :device-id="selectedDeviceId" 
      data-key="flow_begin" 
      label="Flow Begin" 
      unit="L/min" 
    />

    <!-- Flow Eind -->
    <DataChart 
      :device-id="selectedDeviceId" 
      data-key="flow_eind" 
      label="Flow Eind" 
      unit="L/min" 
    />

    <!-- Lichtweerstand -->
    <DataChart 
      :device-id="selectedDeviceId" 
      data-key="lichtweerstand" 
      label="Lichtweerstand" 
      unit="Ω" 
    />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import SidebarNavbar from '@/components/SidebarNavbar.vue'
import WelcomeMessage from '@/components/WelcomeMessage.vue'
import PlantDropdown from '@/components/PlantSelector.vue'
import DataChart from '@/components/DataChart.vue'

// geselecteerd device (default)
const selectedDeviceId = ref('device-1')
</script>

<style>
.Data {
  min-height: 100vh;
  width: auto;
  margin-left: 5rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chartContainer {
  width: 100%;
  max-width: 90%; 
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); /* flexibele min-width */
  gap: 1rem;
  box-sizing: border-box;
}
</style>
