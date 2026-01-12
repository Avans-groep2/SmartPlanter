<template>
  <div class="linechart">
    <canvas ref="canvasEl"></canvas>
    <p class="datawaarde-uitleg">EC waarde: {{ latestValue }}</p>
    <p class="data-betekenis">Deze EC waarde is: </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'

const apiURL = "https://smartplanters.dedyn.io:1880/mongoadvanced"

const canvasEl = ref(null)
let chartInstance = null
const latestValue = ref('Laden...')

function renderChart(labels = [], data = []) {
  if (!canvasEl.value) return; 

  if(chartInstance) {
    chartInstance.data.labels = labels
    chartInstance.data.datasets[0].data = data
    chartInstance.update()
  } else {
    chartInstance = new Chart(canvasEl.value, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'EC Waarde',
            data: data,
            tension: 0.4,
            borderColor: '#3c803c',
            backgroundColor: '#3c803c33',
            fill: true
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'EC',
            font: { 
              size: 32, 
              weight: 300 
            },
            color: 'black'
          },
          legend: { 
            display: false 
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
}


async function loadAPI() {
  try {
    const response = await fetch(apiURL)
    const json = await response.json()
    
    if (json.gegevens && Array.isArray(json.gegevens)) {
      const labels = json.gegevens.map(item => item.categorie || 'Onbekend')
      const data = json.gegevens.map(item => item.verkoopbedrag || 0)

      latestValue.value = data.length > 0 ? data[data.length - 1] : 'Geen data'

      renderChart(labels, data)
    }
  } catch (err) {
    console.error("Fout bij ophalen API data:", err)
    latestValue.value = "Fout bij laden"
  }
}

onMounted(() => {
  loadAPI();
  setInterval(loadAPI, 60000);
})

</script>

<style>
.linechart {
    background-color: #ffffff; 
    border-radius: 22px;
    width: 22rem;
    height: 15rem;
    padding: 1rem;
    overflow: hidden; 
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); 
    margin: 1rem;
}

.datawaarde-uitleg {
  font-size: 0.9rem;
  color: #2d6a4f;
  margin-top: 10px;
}

.data-betekenis {
  font-size: 0.9rem;
  color: #2d6a4f;
}
</style>