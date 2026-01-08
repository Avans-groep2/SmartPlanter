<template>
  <button @click="loadAPI">Laad data</button>

  <div class="linechart">
    <canvas ref="canvasEl"></canvas>
    <p class="datawaarde-uitleg">EC waarde:</p>
    <p class="data-betekenis">Deze EC waarde is:...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'

const apiURL = "https://smartplanters.dedyn.io:1880/mongoadvanced"

// Referentie naar het canvas
const canvasEl = ref(null)

// Chart instantie
let chartInstance = null

// Functie om chart te maken of te updaten
function renderChart(labels = [], data = []) {
  if (chartInstance) {
    // Update bestaande chart
    chartInstance.data.labels = labels
    chartInstance.data.datasets[0].data = data
    chartInstance.update()
  } else {
    // Maak nieuwe chart
    chartInstance = new Chart(canvasEl.value, {
      type: 'line',
      data: {
        labels: labels.length ? labels : ['09u', '10u', '11u', '12u'],
        datasets: [
          {
            label: 'EC',
            data: data.length ? data : [10, 20, 15, 30],
            tension: 0.4,
            borderColor: '#3c803c',
            backgroundColor: '#3c803c33', // iets transparant
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
        maintainAspectRatio: false
      }
    })
  }
}

// Functie om data van API te halen
async function loadAPI() {
  try {
    const response = await fetch(apiURL)
    const json = await response.json()

    const labels = json.gegevens.map(item => item.categorie)
    const data = json.gegevens.map(item => item.verkoopbedrag)

    renderChart(labels, data)
  } catch (err) {
    console.error("Fout bij ophalen API data:", err)
  }
}

// Chart direct bij mount renderen met default data
onMounted(() => {
  renderChart()
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
}

.chart-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem; 
}

.datawaarde-uitleg{
  font-size: 0.9rem;
  color: #2d6a4f;
}

.data-betekenis{
  font-size: 0.9rem;
  color: #2d6a4f;
}
</style>
