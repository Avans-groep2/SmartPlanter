<template>
  <SidebarNavbar />

  <div class="Data">
    <header>
      <WelcomeMessage />
      <PlantDropdown @change="selectedDeviceId = $event" />
    </header>

    <div class="chartContainer">
      <TemperatureChart :device-id="selectedDeviceId" />
      <FlowBeginChart :device-id="selectedDeviceId" />
      <FlowEndChart :device-id="selectedDeviceId" />
      <PhChart :device-id="selectedDeviceId" />
      <ECChart :device-id="selectedDeviceId" />
      <LuxChart :device-id="selectedDeviceId" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import SidebarNavbar from '@/components/SidebarNavbar.vue'
import WelcomeMessage from '@/components/WelcomeMessage.vue'
import PlantDropdown from '@/components/PlantSelector.vue'

import TemperatureChart from '@/components/charts/TempetureChart.vue'
import FlowBeginChart from '@/components/charts/FlowBeginChart.vue'
import FlowEndChart from '@/components/charts/FlowEndChart.vue'
import PhChart from '@/components/charts/PhChart.vue'
import ECChart from '@/components/charts/ECChart.vue'
import LuxChart from '@/components/charts/LuxChart.vue'

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
  max-width: 90%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
}
</style>
