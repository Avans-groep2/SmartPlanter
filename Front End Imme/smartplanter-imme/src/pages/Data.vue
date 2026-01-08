<template>
<div class="inspiratieKnop"> 
    <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white";>? </a>
  </div>

    <div class="dataCharts">
      <Temperatuur />
      <Ph />
      <Ec />
      <Licht />
      <WaterflowBegin />
      <WaterflowEind />
    </div>
<section>
</section>
</template>



<script>
import Temperatuur from '../components/dataCharts/Temperatuur.vue'
import Ph from '../components/dataCharts/Ph.vue'
import Ec from '../components/dataCharts/Ec.vue'
import Licht from '../components/dataCharts/Licht.vue'
import WaterflowBegin from '../components/dataCharts/WaterflowBegin.vue'
import WaterflowEind from '../components/dataCharts/WaterflowEind.vue'

export default {
  name: 'DataPagina',
  components: {
    Temperatuur,
    Ph,
    Ec,
    Licht,
    WaterflowBegin,
    WaterflowEind
  }
}
</script>



<style>
.dataCharts{
  margin-top: 2%;
  margin-left: 8%;
  margin-bottom: 1rem;
  display: grid;
  max-width: 90%;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
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

</style>