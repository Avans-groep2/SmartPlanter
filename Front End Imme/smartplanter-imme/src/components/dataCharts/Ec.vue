<template>
  <div class="linechart">
    <canvas ref="canvasEl"></canvas>
    <p class="datawaarde-uitleg">EC waarde: <span :class="{ 'loading': latestValue === 'Laden...' }">{{ latestValue }}</span></p>    
    <p class="data-betekenis">Deze EC waarde is: </p>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Chart } from 'chart.js/auto'

const apiURL = "https://smartplanters.dedyn.io:1880/mongoadvanced"

const canvasEl = ref(null)
let chartInstance = null
const latestValue = ref('...')

function renderChart(incomingLabels = [], incomingData = []) {
  if (!canvasEl.value) return; 

  const chartLabels = incomingLabels.length > 0 ? incomingLabels : ['Geen data'];
  const chartData = incomingData.length > 0 ? incomingData : [0];

  if(chartInstance) {
    chartInstance.data.labels = chartLabels
    chartInstance.data.datasets[0].data = chartData
    chartInstance.update()
  } else {
    chartInstance = new Chart(canvasEl.value, {
      type: 'line',
      data: {
        labels: chartLabels,
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
  /*try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error (`Server fout: ${response.status}`);
    
    const json = await response.json()
    console.log("API ontvangen:", json);

    const dataLijst = Array.isArray(json) ? json:json.gegevens;
    
    if (dataLijst && Array.isArray(dataLijst) && dataLijst.length > 0) {
      // Pas hier de keys aan als 'categorie' of 'verkoopbedrag' anders heten in de EC data!
      const labels = dataLijst.map(item => item.categorie || item.tijd || '...');
      const data = dataLijst.map(item => item.verkoopbedrag || item.waarde || 0);

      latestValue.value = data[data.length - 1];
      renderChart(labels, data);
    } else {
      console.warn("Geen gegevens gevonden in de API respons");
      latestValue.value = "Geen data";
      renderChart([], []);
    }
  } catch (err) {
    console.error("Fetch fout:", err);
    latestValue.value = "Fout bij laden";
  }*/
 async function loadAPI() {
  try {
    const response = await fetch(apiURL);
    const json = await response.json();
    
    // We kijken of de data direct in 'json' zit of in 'json.gegevens'
    const dataLijst = Array.isArray(json) ? json : json.gegevens;

    if (dataLijst && dataLijst.length > 0) {
      
      // STAP A: DEBUGGING (Dit helpt je de namen te vinden)
      console.log("--- API INSPECTIE ---");
      console.table(dataLijst[0]); // Dit laat een tabel zien in je browser console (F12)
      
      // STAP B: DATA VERWERKEN ("De rest van de code")
      // Zodra je in de tabel ziet hoe de velden heten (bijv. 'waarde' of 'ec'), 
      // vervang je 'item.verkoopbedrag' door de juiste naam.
      const labels = dataLijst.map(item => item.categorie || item.tijd || '...');
      const data = dataLijst.map(item => item.verkoopbedrag || item.waarde || 0);

      // STAP C: DE UI UPDATEN
      latestValue.value = data[data.length - 1]; // Laatste waarde in de tekst zetten
      renderChart(labels, data);                // De grafiek tekenen met de nieuwe data
      
    } else {
      console.warn("De lijst is leeg of heeft een verkeerde structuur.");
    }
  } catch (err) {
    console.error("Er is iets misgegaan bij het ophalen:", err);
    latestValue.value = "Fout";
  }
}
}

onMounted(async() => {
  await nextTick();
  await loadAPI();
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