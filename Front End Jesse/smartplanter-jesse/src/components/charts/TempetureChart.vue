<template>
<div class="linechart">
    <canvas ref="canvasEl"></canvas>
    <p>Laatste Waarde: <span>30</span></p>
  <p>Waarde status:<span>OK</span></p>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'

const canvasEl = ref(null)
const latestValue = ref(null)

const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary')
  .trim()

const textColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--text')
  .trim()

async function fetchTemperatureData() {
  const url = new URL('https://smartplanters.dedyn.io:1880/mongoadvanced')

  url.search = new URLSearchParams({
    collection: 'smartplanters',
    operation: 'find',
    id: 'device_id',
    value: 'device-1',
    limit: 10,
    sortvalue: 1 // oud → nieuw (handig voor grafiek)
  })

  const res = await fetch(url)
  const data = await res.json()

  return data
}

onMounted(async () => {
  const apiData = await fetchTemperatureData()

  const labels = apiData.map(item =>
    new Date(item.time).toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit'
    })
  )

  const temperatures = apiData.map(item => item.data.temperatuur)

  latestValue.value = temperatures.at(-1)

  new Chart(canvasEl.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperatuur',
          data: temperatures,
          borderColor: primaryColor,
          backgroundColor: primaryColor,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Temperatuur °C',
          font: {
            size: 32
          },
          color: textColor
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          ticks: {
            color: textColor
          }
        },
        x: {
          ticks: {
            color: textColor
          }
        }
      }
    }
  })
})
</script>


<style>

.linechart {
    background-color: var(--light);
    
    width: 25rem;
    height: 15rem;
    border-radius: 15px;
}

.linechart p {
  color: var(--text);
}

</style>