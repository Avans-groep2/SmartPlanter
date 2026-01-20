<template>
  <SidebarNavbar/>
  <div class="Dashboard">
    <header>
      <WelcomeMessage/>
      <PlantSelector/>
    </header>

    <div class="plants-container">
<PlantCard
  name="Wortel"
  position="01"
  plant-date="2025-11-26"
  harvest-date="2026-01-18"  
/>

<PlantCard
  name="Aardbei"
  position="02"
  plant-date="2025-11-26"
  harvest-date="2026-01-19"  
/>

<PlantCard
  name="Komkommer"
  position="03"
  plant-date="2025-11-26"
  harvest-date="2026-01-22"
/>

<PlantCard
  name="Courgette"
  position="04"
  plant-date="2025-11-26"
  harvest-date="2026-01-24"
/>

<PlantCard
  name="Sla"
  position="05"
  plant-date="2025-11-26"
  harvest-date="2026-01-25"
/>

<PlantCard
  name="Basilicum"
  position="06"
  plant-date="2025-11-26"
  harvest-date="2026-01-26"
/>

<PlantCard
  name="Aardbei"
  position="07"
  plant-date="2025-11-26"
  harvest-date="2026-01-28"
/>

<PlantCard
  name="Cilantro"
  position="08"
  plant-date="2025-11-26"
  harvest-date="2026-01-30"
/>

<PlantCard
  name="Wortel"
  position="09"
  plant-date="2025-11-26"
  harvest-date="2026-02-01"
/>

<PlantCard
  name="Komkommer"
  position="10"
  plant-date="2025-11-26"
  harvest-date="2026-02-03"
/>

<PlantCard
  name="Courgette"
  position="11"
  plant-date="2025-11-26"
  harvest-date="2026-02-05"
/>

<PlantCard
  name="Sla"
  position="12"
  plant-date="2025-11-26"
  harvest-date="2026-02-07"
/>

<PlantCard
  name="Basilicum"
  position="13"
  plant-date="2025-11-26"
  harvest-date="2026-02-09"
/>

<PlantCard
  name="Aardbei"
  position="14"
  plant-date="2025-11-26"
  harvest-date="2026-02-11"
/>

<PlantCard
  name="Cilantro"
  position="15"
  plant-date="2025-11-26"
  harvest-date="2026-02-13"
/>
    
    
    </div>
  </div>
  
  
</template>

<script>
import WelcomeMessage from '@/components/WelcomeMessage.vue';
import SidebarNavbar from '../components/SidebarNavbar.vue';
import PlantCard from '@/components/PlantCard.vue';
import PlantSelector from '@/components/PlantSelector.vue';





export default {
  name: 'DashboardPage',
  components: {
    SidebarNavbar,
    WelcomeMessage,
    PlantCard,
    PlantSelector
  }
}
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

</style>
