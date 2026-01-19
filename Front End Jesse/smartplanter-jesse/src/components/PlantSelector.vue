<template>
  <div class="dropdown">
    <button @click="open = !open" class="dropdown-btn">
      {{ selected?.label || 'Selecteer een plant' }}
    </button>

    <transition name="fade-slide">
      <ul v-if="open" class="dropdown-menu">
        <li
          v-for="option in options"
          :key="option.deviceId"
          @click="select(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineEmits } from "vue";

const emit = defineEmits(["change"]);

const open = ref(false);
const selected = ref(null);
const options = ref([]);

const currentUserFirstName = "tester";

// Fetch planters met .then/.catch
function loadPlanters() {
  fetch("http://smartplanters.dedyn.io:1880/smartplantdata?table=Planter")
    .then(response => {
      if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
      return response.json();
    })
    .then(data => {
      const userPlanters = data.filter(item => item.UserID === currentUserFirstName);
      options.value = userPlanters.map(p => ({
        label: p.DeviceNaam,
        deviceId: p.DeviceID
      }));

      if (options.value.length > 0) {
        const savedDevice = localStorage.getItem("chosenDevice");
        selected.value = savedDevice 
          ? options.value.find(o => o.deviceId === savedDevice) || options.value[0] 
          : options.value[0];

        emit("change", selected.value.deviceId);
      }
    })
    .catch(err => {
      console.error("Fout bij ophalen van planters:", err);
    });
}

function handleClickOutside(event) {
  const dropdown = document.querySelector(".dropdown");
  if (dropdown && !dropdown.contains(event.target)) open.value = false;
}

function select(option) {
  selected.value = option;
  open.value = false;
}

onMounted(() => {
  loadPlanters();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

watch(selected, value => {
  if (!value) return;
  localStorage.setItem("chosenDevice", value.deviceId);
  emit("change", value.deviceId);
});
</script>

<style>
/* Dropdown container */
.dropdown {
  position: relative;  
  width: 200px;
  z-index: 999;
}

/* Button styling */
.dropdown-btn {
  width: 100%;
  padding: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  background: var(--primary);
  border: 1px solid var(--light);
  color: var(--text);
  border-radius: 15px;
}

/* Dropdown menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin: 0.5rem 0 0 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--light);
  background: var(--light);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  transform-origin: top center;
}

/* Menu items */
.dropdown-menu li {
  padding: 8px;
  cursor: pointer;
  background: var(--light);
  color: var(--text);
  transition: background 0.2s, color 0.2s;
}

.dropdown-menu li:hover {
  background: var(--primary);
  font-weight: 600;
}

/* Fade + slide animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
