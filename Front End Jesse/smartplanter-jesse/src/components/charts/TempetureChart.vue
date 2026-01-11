<template>
  <div class="linechart">
    <canvas ref="canvasEl"></canvas>

    <p>
      Laatste waarde:
      <span>{{ latestValue }} °C</span>
    </p>

    <p>
      Status:
      <span>{{ latestValue > 30 ? 'Te warm' : 'OK' }}</span>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps } from 'vue'
import { Chart } from 'chart.js/auto'

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
const props = defineProps({
  deviceId: {
    type: String,
    required: true
  }
})

// ─────────────────────────────────────────────
// Refs
// ─────────────────────────────────────────────
const canvasEl = ref(null)
const latestValue = ref(null)

// Chart en interval
let chartInstance = null
let intervalId = null

// Theme kleuren
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary')
  .trim()
const textColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--text')
  .trim()

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function sortByIsoTime(a, b) {
  return a.time.localeCompare(b.time)
}

function parseIsoToDate(isoString) {
  return new Date(isoString.replace(/(\.\d{3})\d+Z$/, '$1Z'))
}

// ─────────────────────────────────────────────
// API call
// ─────────────────────────────────────────────
async function fetchTemperatureData(deviceId) {
  const url = new URL('https://smartplanters.dedyn.io:1880/mongoadvanced')

  url.search = new URLSearchParams({
    collection: 'smartplanters',
    operation: 'find',
    id: 'device_id',
    value: deviceId,
    limit: 5,
    sortvalue: -1 // nieuwste eerst
  })

  const res = await fetch(url)
  return await res.json()
}

// ─────────────────────────────────────────────
// Chart management
// ─────────────────────────────────────────────
function buildChart(labels, data) {
  chartInstance = new Chart(canvasEl.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          data,
          borderColor: primaryColor,
          backgroundColor: primaryColor,
          tension: 0.3,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Temperatuur °C',
          font: { size: 32 },
          color: textColor
        },
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: textColor } },
        y: { ticks: { color: textColor } }
      }
    }
  })
}

function updateChart(labels, data) {
  if (!chartInstance) return
  chartInstance.data.labels = labels
  chartInstance.data.datasets[0].data = data
  chartInstance.update('none')
}

function cleanupChart() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

function startPolling(deviceId) {
  intervalId = setInterval(() => {
    loadData(deviceId, false)
  }, 5000)
}

// ─────────────────────────────────────────────
// Data loading
// ─────────────────────────────────────────────
async function loadData(deviceId, rebuild = false) {
  const apiData = await fetchTemperatureData(deviceId)

  const sortedData = apiData
    .slice()
    .sort(sortByIsoTime)
    .slice(-5)

  const labels = sortedData.map(item =>
    parseIsoToDate(item.time).toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  )

  const temperatures = sortedData.map(item => item.data.temperatuur)
  latestValue.value = temperatures.at(-1)

  if (rebuild) {
    cleanupChart()
    buildChart(labels, temperatures)
    startPolling(deviceId)
  } else {
    updateChart(labels, temperatures)
  }
}

// ─────────────────────────────────────────────
// Lifecycle
// ─────────────────────────────────────────────
onMounted(() => {
  loadData(props.deviceId, true)
})

watch(
  () => props.deviceId,
  newDeviceId => {
    loadData(newDeviceId, true)
  }
)

onBeforeUnmount(() => {
  cleanupChart()
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