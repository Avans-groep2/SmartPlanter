<template>
  <div class="linechart">
    <canvas ref="canvasEl"></canvas>

    <p>
      Laatste waarde:
      <span>{{
        latestValue !== null
          ? latestValue.toFixed(props.decimals) + " " + props.unit
          : "-"
      }}</span>
    </p>

    <p v-if="latestValue !== null">
      Status:
      <span>{{ statusText }}</span>
    </p>
    <p v-else>Geen data</p>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  defineProps,
  computed,
  nextTick,
} from "vue";
import { Chart } from "chart.js/auto";
import { getCurrentInstance } from "vue";

const internalInstance = getCurrentInstance();
const $auth = internalInstance.appContext.config.globalProperties.$auth;

const props = defineProps({
  deviceId: { type: String, required: true },
  dataKey: { type: String, default: "" },
  label: { type: String, default: "Meetwaarde" },
  unit: { type: String, default: "" },
  decimals: { type: Number, default: 2 },
  minThreshold: { type: Number, default: null },
  maxThreshold: { type: Number, default: null },
  minBerichtcode: { type: Number, default: 2 },
  maxBerichtcode: { type: Number, default: 3 },
  thresholdPriority: { type: String, default: "normaal" },
});

// Refs
const canvasEl = ref(null);
const latestValue = ref(null);
let chartInstance = null;
let intervalId = null;

// Alerts die al verstuurd zijn
const sentAlerts = ref({});

// Kleuren
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--primary")
  .trim();
const textColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--text")
  .trim();

// Status tekst
const statusText = computed(() => {
  if (latestValue.value === null) return "OK";
  if (props.minThreshold !== null && latestValue.value < props.minThreshold)
    return "Te laag";
  if (props.maxThreshold !== null && latestValue.value > props.maxThreshold)
    return "Te hoog";
  return "OK";
});

// ISO → Date
const parseIsoToDate = (iso) => new Date(iso.replace(/(\.\d{3})\d+Z$/, "$1Z"));

// ────────────── API calls ──────────────
async function fetchDeviceData(deviceId) {
  const url = new URL("https://smartplanters.dedyn.io:1880/mongoadvanced");
  url.search = new URLSearchParams({
    collection: "smartplanters",
    operation: "find",
    id: "device_id",
    idvalue: deviceId,
    limit: 5,
    sortvalue: -1,
  });

  const res = await fetch(url);
  return (await res.json()) || [];
}

async function fetchAllMeldingen() {
  try {
    const res = await fetch(
      "https://smartplanters.dedyn.io:1880/smartplantdata?table=Meldingen",
    );
    const data = await res.json();
    return data || [];
  } catch (err) {
    return [];
  }
}

// ────────────── Chart logic ──────────────
function buildChart(labels = [], data = []) {
  if (!canvasEl.value) {
    return;
  }

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(canvasEl.value, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          data,
          borderColor: primaryColor,
          backgroundColor: primaryColor,
          tension: 0.3,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: props.label + (props.unit ? ` (${props.unit})` : ""),
          font: { size: 28 },
          color: textColor,
        },
        legend: { display: false },
      },
      scales: {
        x: { ticks: { color: textColor } },
        y: { ticks: { color: textColor } },
      },
    },
  });
}

function updateChart(labels, data) {
  if (!chartInstance) return;
  chartInstance.data.labels = labels;
  chartInstance.data.datasets[0].data = data;
  chartInstance.update("none");
}

function cleanupChart() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}

// ────────────── Alerts ──────────────
async function sendThresholdAlert(deviceId, status) {
  const userID = $auth.user?.id;
  if (!userID) return;

  const berichtcode =
    status === "onder" ? props.minBerichtcode : props.maxBerichtcode;

  const meldingen = await fetchAllMeldingen();

  const bestaat = meldingen.some(
    (m) =>
      m.DeviceID === deviceId &&
      Number(m.Berichtcode) === berichtcode &&
      m.Prioriteit === props.thresholdPriority,
  );

  if (bestaat) {
    return;
  }

  const hoogsteID = meldingen.length
    ? Math.max(...meldingen.map((m) => Number(m.MeldingID || 0)))
    : 0;

  const meldingID = hoogsteID + 1;

  if (!sentAlerts.value[deviceId]) sentAlerts.value[deviceId] = {};
  sentAlerts.value[deviceId][status] = true;

  const url =
    `https://smartplanters.dedyn.io:1880/smartplantedit` +
    `?userID=${userID}` +
    `&meldingID=${meldingID}` +
    `&table=Meldingen` +
    `&deviceID=${deviceId}` +
    `&prioriteit=${props.thresholdPriority}` +
    `&berichtcode=${berichtcode}`;

  fetch(url);
}

async function loadData(deviceId) {
  const apiData = await fetchDeviceData(deviceId);
  const validData = apiData.filter(
    (item) => item.data?.[props.dataKey] != null,
  );

  if (!validData.length) {
    latestValue.value = null;
    buildChart([], []);
    return;
  }

  const sorted = validData
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(-5);
  const labels = sorted.map((item) =>
    parseIsoToDate(item.time).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  );
  const values = sorted.map((item) =>
    Number(item.data[props.dataKey].toFixed(props.decimals)),
  );

  latestValue.value = values.at(-1);

  if (props.minThreshold !== null && latestValue.value < props.minThreshold) {
    sendThresholdAlert(deviceId, "onder");
  } else if (
    props.maxThreshold !== null &&
    latestValue.value > props.maxThreshold
  ) {
    sendThresholdAlert(deviceId, "boven");
  } else {
    if (sentAlerts.value[deviceId]) sentAlerts.value[deviceId] = {};
  }

  chartInstance ? updateChart(labels, values) : buildChart(labels, values);
}

function startPolling(deviceId) {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => loadData(deviceId), 5000);
}

// ────────────── Lifecycle ──────────────
onMounted(async () => {
  await nextTick();
  loadData(props.deviceId);
  startPolling(props.deviceId);
});

watch(
  () => props.deviceId,
  async (newId) => {
    cleanupChart();
    await nextTick();
    loadData(newId);
    startPolling(newId);
  },
);

onBeforeUnmount(() => cleanupChart());
</script>

<style>
.linechart {
  background-color: var(--light);
  width: 100%;
  max-width: 25rem;
  height: 17rem;
  border-radius: 15px;
  padding: 1rem;
  box-sizing: border-box;
}

.linechart p {
  color: var(--text);
  margin: 0.5rem 0;
}
</style>
