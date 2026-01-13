<template>
  <div class="inspiratieKnop"> 
    <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white";>? </a>
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
            <span v-if="sensor.latestValue !== null">{{ sensor.latestValue.toFixed(1) }} {{ sensor.unit }}</span>
            <span v-else>...</span>
          </p>
          <p class="data-betekenis">
            Deze {{ sensor.label.toLowerCase() }} is:
            <span :class="{ 'status-te-hoog': sensor.status === 'Slecht, Onderneem Actie' }">
              {{ sensor.status }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="inspiratieKnop"> 
      <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white">?</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Chart } from 'chart.js/auto'

const sensors = ref([
  { label: 'Temperatuur', dataKey: 'temperature', unit: '°C', latestValue: null, status: '...', chart: null, threshold: 30 },
  { label: 'pH', dataKey: 'ph', unit: '', latestValue: null, status: '...', chart: null, threshold: 5.5 },
  { label: 'EC', dataKey: 'ec', unit: 'µS/cm', latestValue: null, status: '...', chart: null, threshold: 14 },
  { label: 'LUX', dataKey: 'lux', unit: 'lx', latestValue: null, status: '...', chart: null, threshold: 1000 },
  { label: 'Waterflow Begin', dataKey: 'flow_start', unit: 'L/m', latestValue: null, status: '...', chart: null, threshold: 40 },
  { label: 'Waterflow Eind', dataKey: 'flow_end', unit: 'L/m', latestValue: null, status: '...', chart: null, threshold: 40 },
])

const canvasRefs = ref([])
const deviceId = 'smartplanter_01' 
let intervalId = null

async function loadSensorData(index) {
  const sensor = sensors.value[index]
  try {
    const url = new URL('https://smartplanters.dedyn.io:1880/mongoadvanced')
    url.search = new URLSearchParams({
      collection: 'smartplanters',
      operation: 'find',
      id: 'device_id',
      value: deviceId,
      limit: 10,
      sortvalue: -1
    })
    
    const res = await fetch(url)
    const data = await res.json()
    
    if (data && data.length > 0) {
      const sorted = data.reverse()
      const labels = sorted.map(d => new Date(d.time).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }))
      const values = sorted.map(d => d.data[sensor.dataKey] || 0)

      sensor.latestValue = values[values.length - 1]

      if (sensor.threshold !== null && sensor.latestValue >= sensor.threshold) {
        sensor.status = 'Slecht, Onderneem Actie'
      } else {
        sensor.status = 'Goed!' 
      }

      renderChart(index, labels, values)
    }
  } catch (e) {
    console.error("Fout bij ophalen:", e)
  }
}


// De grafiek tekenen of updaten
function renderChart(index, labels, values) {
  const sensor = sensors.value[index]
  const ctx = canvasRefs.value[index]

  if (!sensor.chart) {
    sensor.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          tension: 0.4,
          borderColor: '#2d6a4f',
          backgroundColor: '#3c803c33',
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { 
            display: true, 
            text: sensor.label, 
            font: { size: 24, weight: '500' }, 
            color: '#333',
            padding: { bottom: 10 }
          },
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#999' } },
          y: { grid: { color: '#f0f0f0' }, ticks: { color: '#999' } }
        }
      }
    })
  } else {
    sensor.chart.data.labels = labels
    sensor.chart.data.datasets[0].data = values
    sensor.chart.update('none')
  }
}

onMounted(() => {
  sensors.value.forEach((_, i) => loadSensorData(i))
  intervalId = setInterval(() => {
    sensors.value.forEach((_, i) => loadSensorData(i))
  }, 5000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
  sensors.value.forEach(s => { if(s.chart) s.chart.destroy() })
})

</script>

<style>
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

.data-betekenis span {
  font-weight: bold;
  color: #2d6a4f; 
}

.data-betekenis span.status-te-hoog {
  color: #db4434;
}
</style>