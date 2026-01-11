<template>
  <div class="linechart">
    <canvas ref="canvasEl"></canvas>

    <p>
      Laatste waarde:
      <span>{{ latestValue !== null ? latestValue.toFixed(props.decimals) + ' ' + unit : '-' }}</span>
    </p>

    <p v-if="latestValue !== null">
      Status:
      <span>{{ statusText }}</span>
    </p>
    <p v-else>Geen data</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps, computed } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  deviceId: { type: String, required: true },
  dataKey: { type: String, default: '' },
  label: { type: String, default: 'Meetwaarde' },
  unit: { type: String, default: '' },
  decimals: { type: Number, default: null }, // aantal cijfers achter de komma
  threshold: { type: Number, default: null } // optioneel
})

const canvasEl = ref(null)
const latestValue = ref(null)
let chartInstance = null
let intervalId = null

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()

// Status tekst berekenen op basis van threshold
const statusText = computed(() => {
  if (latestValue.value === null || props.threshold === null) return 'OK'
  return latestValue.value > props.threshold ? 'Te hoog' : 'OK'
})

const parseIsoToDate = iso => new Date(iso.replace(/(\.\d{3})\d+Z$/, '$1Z'))

// ────────────── API call ──────────────
async function fetchDeviceData(deviceId) {
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

// ────────────── Chart functies ──────────────
function buildChart(labels = [], data = []) {
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(canvasEl.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { data, borderColor: primaryColor, backgroundColor: primaryColor, tension: 0.3, pointRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: props.label + (props.unit ? ` (${props.unit})` : ''), font: { size: 28 }, color: textColor },
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

// ────────────── Data laden ──────────────
async function loadData(deviceId) {
  const apiData = await fetchDeviceData(deviceId)
  const validData = apiData.filter(item => item.data?.[props.dataKey] != null)

  if (!validData.length) {
    latestValue.value = null
    buildChart([], [])
    return
  }

  const sorted = validData.sort((a, b) => a.time.localeCompare(b.time)).slice(-5)
  const labels = sorted.map(item =>
    parseIsoToDate(item.time).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  )

  // Rond af op het aantal decimalen
  const values = sorted.map(item => Number(item.data[props.dataKey].toFixed(props.decimals)))

  latestValue.value = values.at(-1)

  chartInstance ? updateChart(labels, values) : buildChart(labels, values)
}

// ────────────── Polling ──────────────
function startPolling(deviceId) {
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(() => loadData(deviceId), 5000)
}

// ────────────── Lifecycle ──────────────
onMounted(() => { loadData(props.deviceId); startPolling(props.deviceId) })
watch(() => props.deviceId, newId => { cleanupChart(); loadData(newId); startPolling(newId) })
onBeforeUnmount(() => cleanupChart())
</script>

<style>
.linechart {
  background-color: var(--light);
  width: 25rem;
  height: 15rem;
  border-radius: 15px;
  padding: 1rem;
}

.linechart p { color: var(--text); margin: 0.5rem 0; }
</style>
