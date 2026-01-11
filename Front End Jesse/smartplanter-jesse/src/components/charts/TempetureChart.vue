<template>
  <div class="linechart">
    <canvas ref="canvasEl"></canvas>

    <p>
      Laatste waarde:
      <span>{{ latestValue !== null ? latestValue + ' °C' : '-' }}</span>
    </p>

    <p>
      Status:
      <span v-if="latestValue !== null">{{ latestValue > 30 ? 'Te warm' : 'OK' }}</span>
      <span v-else>Geen data</span>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  deviceId: { type: String, required: true }
})

const canvasEl = ref(null)
const latestValue = ref(null)

let chartInstance = null
let intervalId = null

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()

// ────────────── Helpers ──────────────
const parseIsoToDate = iso => new Date(iso.replace(/(\.\d{3})\d+Z$/, '$1Z'))

// ────────────── API Call ──────────────
async function fetchTemperatureData(deviceId) {
  const url = new URL('https://smartplanters.dedyn.io:1880/mongoadvanced')
  url.search = new URLSearchParams({
    collection: 'smartplanters',
    operation: 'find',
    id: 'device_id',
    value: deviceId,
    limit: 5,
    sortvalue: -1
  })

  const res = await fetch(url)
  const data = await res.json()
  return data || []
}

// ────────────── Chart management ──────────────
function buildChart(labels = [], data = []) {
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(canvasEl.value, {
    type: 'line',
    data: { labels, datasets: [{ data, borderColor: primaryColor, backgroundColor: primaryColor, tension: 0.3, pointRadius: 4 }] },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Temperatuur °C', font: { size: 32 }, color: textColor },
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
  if (intervalId) { clearInterval(intervalId); intervalId = null }
  if (chartInstance) { chartInstance.destroy(); chartInstance = null }
}

// ────────────── Load & Poll Data ──────────────
async function loadData(deviceId) {
  const apiData = await fetchTemperatureData(deviceId)
  const validData = apiData.filter(item => item.data?.temperatuur != null)

  if (!validData.length) {
    latestValue.value = null
    buildChart([], [])
    return
  }

  const sorted = validData.sort((a, b) => a.time.localeCompare(b.time)).slice(-5)
  const labels = sorted.map(item => parseIsoToDate(item.time).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  const temps = sorted.map(item => item.data.temperatuur)
  latestValue.value = temps.at(-1)

  if (!chartInstance) {
    buildChart(labels, temps)
  } else {
    updateChart(labels, temps)
  }
}

function startPolling(deviceId) {
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(() => loadData(deviceId), 5000)
}

// ────────────── Lifecycle ──────────────
onMounted(() => {
  loadData(props.deviceId)
  startPolling(props.deviceId)
})

watch(() => props.deviceId, newId => {
  cleanupChart()
  loadData(newId)
  startPolling(newId)
})

onBeforeUnmount(() => cleanupChart())
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