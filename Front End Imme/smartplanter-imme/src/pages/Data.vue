<template>
  <div class="inspiratieKnop"> 
    <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white";>? </a>
  </div>

  <div v-if="isBeheerder" class="dataDropdownAdmin">
        <div class="moestuinKeuzeDropDown" ref="dropdown">
            <div class="dropdown-selected" @click.stop="toggleDropdown">
                {{ gekozenMoestuin || 'Moestuin' }}
                <span>▼</span>
            </div>
            <div v-if="open" class="dropdownKeuzes">
                <div
                    v-for="moestuin in moestuinen"
                    :key="moestuin"
                    class="dropdownKeuze"
                    @click="selecteerMoestuin(moestuin)"
                    >{{ moestuin }}</div>
            </div>
        </div>
    </div>

  <div class="data-pagina-container">
    <div class="chart-grid">
      <div v-for="(sensor, index) in sensors" :key="index" class="linechart">
        <div class="chart-wrapper">
          <canvas :ref="el => { if (el) canvasRefs[index] = el }"></canvas>
        </div>
        
        <div class="info-sectie">
          <p class="datawaarde-uitleg">
            {{ sensor.label }} waarde: 
            <span v-if="sensor.latestValue !== null">
              {{ formatValue(sensor.latestValue, sensor.decimals) }} {{ sensor.unit }}</span>
            <span v-else>...</span>
          </p>
          <p class="data-betekenis">
            Deze {{ sensor.label.toLowerCase() }} is:
            <span :class="['status', `status--${sensor.status}`]" >
              {{ statusTekst(sensor.status)}}
            </span>
          </p>
        </div>
      </div>
    </div>
    </div>

    <div class="inspiratieKnop"> 
      <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white">?</a>
    </div>
  
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, markRaw } from 'vue'
import { Chart } from 'chart.js/auto'
import { useFooterSpan } from '../stores/footerSpan';
import { useMoestuinStore } from '../stores/moestuinScherm';

export default {
  name:"dataPagina",
  setup(){
    const moestuinStore = useMoestuinStore();
    const footerStore = useFooterSpan()

    const sensors = ref([
      { label: 'Temperatuur', dataKey: 'temperature', unit: '°C', decimals: 1, latestValue: null, status: 'unknown', chart: null, 
      threshold: { warning: {min: 15, max: 25}, critical: {min: 10, max: 30} } },
      { label: 'pH', dataKey: 'ph', unit: '', decimals: 2, latestValue: null, status: 'unknown', chart: null, 
      threshold: { warning: {min: 14, max: 14}, critical: {min: 15, max: 15} } },
      { label: 'EC', dataKey: 'ec', unit: 'µS/cm', decimals: 2, latestValue: null, status: 'unknown', chart: null, 
      threshold: { warning: {min: 1.5, max: 3.5}, critical: {min: 0.8, max: 4} } },
      { label: 'LUX', dataKey: 'lux', unit: 'lx', decimals: 1, latestValue: null, status: 'unknown', chart: null, 
      threshold: { warning: {min: 1000, max: 3000}, critical: {min: 500, max: 3500} } },
      { label: 'Waterflow Begin', dataKey: 'flow_start', unit: 'L/m', decimals: 1, latestValue: null, status: 'unknown', chart: null, 
      threshold: { warning: {min: 20, max: 60}, critical: {min: 15, max: 70} } },
      { label: 'Waterflow Eind', dataKey: 'flow_end', unit: 'L/m', decimals: 1, latestValue: null, status: 'unknown', chart: null, 
      threshold: { warning: {min: 20, max: 40 }, critical: {min: 15, max: 80} } },
    ]);

    const canvasRefs = ref([])
    const deviceId = 'smartplanter_01' 
    let intervalId = null

    const isBeheerder = computed(() => {
      if (!footerStore.keycloak) return false;
      return footerStore.keycloak.hasRealmRole('beheerder')||
          footerStore.keycloak.hasResourceRole('beheerder', 'frontend-imme')
    });

    return { moestuinStore, sensors, canvasRefs, isBeheerder, deviceId, intervalId};
  },

    data(){
      return {
        open: false, 
        moestuinen: ['Moestuin 1', 'Moestuin 2', 'Moestuin 3'],
      };
    },

      computed: {
        gekozenMoestuin(){
          return this.moestuinStore.actieveMoestuin;
        }
      },

      methods: {
        toggleDropdown() {
         this.open = !this.open;
      },

        selecteerMoestuin(moestuin) {
          this.moestuinStore.setMoestuin(moestuin);
          this.open = false; 
      },

        handleClickOutside(event) {
          if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
            this.open = false;
      }
    },
    formatValue(value, decimals = 1){
      if(value == null) return '...'
      return Number(value).toFixed(decimals)
    },
    statusTekst(status){
      switch (status) {
        case 'good': return 'Goed'
        case 'warning': return 'Slecht'
        case 'critical': return 'Kritisch' 
        default: return 'Onbekend'
      }
  },
    bepaalStatus(value, threshold){
      if(value == null) return 'unknown'

      const { warning, critical } = threshold

      if (value < critical.min || value > critical.max) {
        return 'critical'
      }

      if (value < warning.min || value > warning.max){
        return 'warning'
      }

      return 'good'
    },

    renderChart(index, labels, values){
      const sensor = this.sensors[index];
      const ctx = this.canvasRefs[index];
      if (!ctx) return;

    if (!sensor.chart) {
    sensor.chart = markRaw(new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          tension: 0.4,
          borderColor: '#2d6a4f',
          backgroundColor: '#3c803c33',
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          title: { 
            display: true, 
            text: sensor.label, 
            font: { size: 24, weight: '500' }, 
            color: '#333',
            padding: { bottom: 10 }
          },
          legend: { display: false }, 
          tooltip: {
                enabled: true,
                callbacks: {
                  label: (context) => `${context.raw.toFixed(sensor.decimals)} ${sensor.unit}`
                }
            }
          }
        }
        })); 
  } else {
    sensor.chart.data.labels = labels
    sensor.chart.data.datasets[0].data = values
    sensor.chart.update('none')
  }
},
  async loadSensorData(index) {
      const sensor = this.sensors[index]
      try {
        const url = new URL('https://smartplanters.dedyn.io:1880/mongoadvanced')
        url.search = new URLSearchParams({
          collection: 'smartplanters',
          operation: 'find',
          id: 'device_id',
          value: this.deviceId,
          limit: 10,
          sortvalue: -1
        });
      
    const res = await fetch(url)
    const data = await res.json()
    
      if (data?.length) {
          const sorted = data.reverse();
          const values = sorted.map(d => d.data[sensor.dataKey] ?? 0);
          const labels = sorted.map(d => new Date(d.time).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }));
          sensor.latestValue = values.at(-1);
          sensor.status = this.bepaalStatus(sensor.latestValue, sensor.threshold);
          this.renderChart(index, labels, values);
        }
      } catch (e) { console.error(e); }
    }
  },

  mounted() {
    this.sensors.forEach((_, i) => this.loadSensorData(i))
    this.intervalId = setInterval(() => {
      this.sensors.forEach((_, i) => this.loadSensorData(i))
    }, 5000)

    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    clearInterval(this.intervalId)
    this.sensors.forEach(s => { if(s.chart) s.chart.destroy() })
    document.removeEventListener('click', this.handleClickOutside);
  }
}

</script>

<style scoped>

.dataDropdownAdmin {
  margin-bottom: 5px;
  width: 200px;
  display: flex; 
  position: absolute;
  right: 1px;
  top: 75px;
}

.moestuinKeuzeDropDown {
  position: relative;
  width: 180px;
  margin-bottom: 25px;
}

.dropdown-selected {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid #2d6a4f;
  border-radius: 5px;
  padding: 10px;
  font-size: 18px;
  color: #2d6a4f;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdownKeuzes {
  text-align: left;
  position: absolute;
  top: 105%;   
  width: 100%;
  border: 1px solid #2d6a4f;
  border-radius: 5px;
  overflow: hidden;
}

.dropdownKeuze {
  padding: 10px;
  font-size: 18px;
  color: #2d6a4f;
  cursor: pointer;
  background-color: white;
  transition: 0.15s ease;
}

.dropdownKeuze:hover {
  background-color: #2d6a4f;
  color: white;
}

.data-pagina-container {
  display: flex;
  justify-content: center;
}

.chart-grid {
  margin-top: 1rem;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem; 
  max-width: 1400px;
}

.linechart {
  background-color: #ffffff; 
  border-radius: 15px;
  width: 22rem;
  height: 16rem; 
  padding: 1rem;
  overflow: hidden; 
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); 
  display: flex;
  flex-direction: column;
    margin-bottom: 5px;
}

.chart-wrapper {
  flex-grow: 1;
  position: relative;
  min-height: 0;
}

.info-sectie {
  margin-top: 15px;
}

.datawaarde-uitleg, .data-betekenis {
  font-size: 0.9rem;
  color: #2d6a4f;
  margin: 2px 0;
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
  text-decoration: none;
}

.inspiratieKnop:hover {
  background-color: #3c803c;
}

/*-------statusTekstKleur-----------*/

.status {
  font-weight: bold;
}

.status--good {
  color: #2d6a4f;
}

.status--warning {
  color: #e29f32;
}

.status--critical {
  color: #db4434;
}
</style>