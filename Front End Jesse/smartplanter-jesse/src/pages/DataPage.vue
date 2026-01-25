<template>
  <SidebarNavbar />

  <div class="Data">
    <header>
      <WelcomeMessage />
      <PlantSelector v-model="selectedDeviceId" />
    </header>

    <div class="chartContainer">
      <!-- Temperatuur -->
      <DataChart
        :device-id="selectedDeviceId"
        data-key="temperatuur"
        label="Temperatuur"
        unit="°C"
        :min-threshold="18"
        :threshold="26"
        threshold-priority="normaal"
        :min-berichtcode="1"
        :max-berichtcode="2"
      />

      <!-- pH -->
      <DataChart
        :device-id="selectedDeviceId"
        data-key="ph"
        label="pH"
        unit="pH"
        :min-threshold="5.5"
        :threshold="6.5"
        threshold-priority="hoog"
        :min-berichtcode="3"
        :max-berichtcode="4"
      />

      <!-- EC -->
      <DataChart
        :device-id="selectedDeviceId"
        data-key="ec"
        label="EC"
        unit="mS/cm"
        :min-threshold="10"
        :threshold="16"
        threshold-priority="normaal"
        :min-berichtcode="5"
        :max-berichtcode="6"
      />

      <!-- Flow Begin -->
      <DataChart
        :device-id="selectedDeviceId"
        data-key="flow_begin"
        label="Flow Begin"
        unit="L/min"
        :min-threshold="0.1"
        :threshold="999"
        threshold-priority="hoog"
        :min-berichtcode="7"
        :max-berichtcode="7"
      />

      <!-- Flow Eind -->
      <DataChart
        :device-id="selectedDeviceId"
        data-key="flow_eind"
        label="Flow Eind"
        unit="L/min"
        :min-threshold="0.1"
        :threshold="999"
        threshold-priority="hoog"
        :min-berichtcode="1"
        :max-berichtcode="7"
      />

      <!-- Lichtweerstand -->
      <DataChart
        :device-id="selectedDeviceId"
        data-key="lichtweerstand"
        label="Lichtweerstand"
        unit="Ω"
        :min-threshold="600"
        :threshold="700"
        threshold-priority="normaal"
        :min-berichtcode="8"
        :max-berichtcode="9"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import SidebarNavbar from "@/components/SidebarNavbar.vue";
import WelcomeMessage from "@/components/WelcomeMessage.vue";
import PlantSelector from "@/components/PlantSelector.vue";
import DataChart from "@/components/DataChart.vue";

// geselecteerd device (default)
const selectedDeviceId = ref("device-1");
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
  grid-template-columns: repeat(
    auto-fit,
    minmax(350px, 1fr)
  ); /* flexibele min-width */
  gap: 1rem;
  box-sizing: border-box;
}
</style>
