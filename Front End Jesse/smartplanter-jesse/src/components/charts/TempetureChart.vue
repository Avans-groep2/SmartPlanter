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

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

// Sorteer veilig op ISO-string (werkt ook met nano-seconden)
function sortByIsoTime(a, b) {
  return a.time.localeCompare(b.time)
}

// Knip nano-seconden af → JS Date-safe
function parseIsoToDate(isoString) {
  // 2025-12-01T09:27:40.435148506Z
  // → 2025-12-01T09:27:40.435Z
  return new Date(isoString.replace(/(\.\d{3})\d+Z$/, '$1Z'))
}

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────

async function fetchTemperatureData() {
  const url = new URL('https://smartplanters.dedyn.io:1880/mongoadvanced')

  url.search = new URLSearchParams({
    collection: 'smartplanters',
    operation: 'find',
    id: 'device_id',
    value: 'device-1',
    limit: 10,
    sortvalue: 1
  })

  const res = await fetch(url)
  return await res.json()
}

// ─────────────────────────────────────────────
// Chart
// ─────────────────────────────────────────────

onMounted(async () => {
  const apiData = await fetchTemperatureData()

  const sortedData = apiData
    .slice()
    .sort(sortByIsoTime)

  const labels = sortedData.map(item =>
    parseIsoToDate(item.time).toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  )

  const temperatures = sortedData.map(
    item => item.data.temperatuur
  )

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
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: { color: textColor }
        },
        y: {
          ticks: { color: textColor }
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