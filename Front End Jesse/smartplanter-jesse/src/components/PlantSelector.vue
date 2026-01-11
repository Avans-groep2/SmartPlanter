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
import { ref, onMounted, watch, defineEmits } from "vue";

// ─────────────────────────────────────────────
// Emits
// ─────────────────────────────────────────────

const emit = defineEmits(["change"]);

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────

const open = ref(false);
const selected = ref(null);

// ─────────────────────────────────────────────
// Device options
// ─────────────────────────────────────────────

const options = [
  { label: "Smartplanter 1", deviceId: "device-1" },
  { label: "Smartplanter 2", deviceId: "device-2" },
  { label: "Smartplanter 3", deviceId: "device-3" }
];

// ─────────────────────────────────────────────
// Lifecycle
// ─────────────────────────────────────────────

onMounted(() => {
  const savedDevice = localStorage.getItem("chosenDevice");

  if (savedDevice) {
    const option = options.find(o => o.deviceId === savedDevice);
    if (option) selected.value = option;
  } else {
    // default select first device
    selected.value = options[0];
  }

  emit("change", selected.value.deviceId);
});

// ─────────────────────────────────────────────
// Watchers
// ─────────────────────────────────────────────

watch(selected, (value) => {
  if (!value) return;

  localStorage.setItem("chosenDevice", value.deviceId);
  emit("change", value.deviceId);
});

// ─────────────────────────────────────────────
// Methods
// ─────────────────────────────────────────────

function select(option) {
  selected.value = option;
  open.value = false;
}
</script>

<style>
.dropdown {
  position: relative;
  width: 200px;
  z-index: 999;
}

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

.dropdown-menu {
  position: absolute;
  width: 100%;
  margin-top: 4px;
  padding: 0;
  list-style: none;
  border: 1px solid var(--light);
  background: var(--light);
  overflow: hidden;
}

.dropdown-menu li {
  padding: 8px;
  cursor: pointer;
  background: var(--light);
  color: var(--text);
}

.dropdown-menu li:hover {
  background: var(--primary);
  color: var(--primary-dark);
}

/* 💫 Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
  transform-origin: top;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
