<template>
  <div class="dropdown">
    <button @click="toggleDropdown" class="dropdown-btn">
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

<script>
export default {
  name: "PlantSelector",
  props: {
    modelValue: {
      type: [Number, String, null],
      default: null
    },
    includeAllOption: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      open: false,
      selected: null,
      options: []
    }
  },

  computed: {
    user() {
      return this.$auth.user
    },
    currentUserID() {
      return this.user?.id
    }
  },

  watch: {
    modelValue(value) {
      // sync v-model met selected
      if (!value || !this.options.length) return
      this.selected = this.options.find(o => o.deviceId === value) || this.selected
    },
    user(u) {
      if (u) this.loadPlanters()
    }
  },

  mounted() {
    if (this.user) this.loadPlanters()
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {
    toggleDropdown() {
      this.open = !this.open
    },

    async loadPlanters() {
  if (!this.user) return

  try {
    const res = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter')
    const data = await res.json()

    // check of de gebruiker beheerder is via roles-array
    const isBeheerder = this.user?.roles?.includes('beheerder')

    let plantersToShow = []

    if (isBeheerder) {
      plantersToShow = data // alle planten voor beheerder
    } else {
      plantersToShow = data.filter(p => String(p.UserID) === String(this.currentUserID))
    }

    this.options = plantersToShow.map(p => ({
      label: p.DeviceNaam,
      deviceId: p.DeviceID
    }))

    if (this.includeAllOption) {
      this.options.unshift({
        label: 'Alle planters',
        deviceId: null
      })
    }

    // Bepaal de selectie
    const savedId = localStorage.getItem('chosenDeviceId')
    if (savedId) {
      this.selected = this.options.find(o => String(o.deviceId) === savedId) || this.options[0]
    } else if (this.options.length) {
      this.selected = this.options[0]
      localStorage.setItem('chosenDeviceId', this.selected.deviceId)
      localStorage.setItem('chosenDeviceName', this.selected.label)
    }

    // Sync v-model
    if (this.selected) {
      this.$emit('update:modelValue', this.selected.deviceId)
      this.$emit('update:planterName', this.selected.label)
    }

    this.$emit('loaded', this.selected)

  } catch (err) {
    console.error('Fout bij ophalen van planters:', err)
  }
},

    select(option) {
      this.selected = option
      this.open = false

      localStorage.setItem('chosenDeviceId', option.deviceId)
      localStorage.setItem('chosenDeviceName', option.label)

      // Emit v-model update
      this.$emit('update:modelValue', option.deviceId)
      // Emit naam update
      this.$emit('update:planterName', option.label)
    },

    updateOptionName(deviceId, newName) {
      const option = this.options.find(o => String(o.deviceId) === String(deviceId))
      if (option) {
        option.label = newName
        if (this.selected && String(this.selected.deviceId) === String(deviceId)) {
          this.selected.label = newName
        }
      }
    },

    handleClickOutside(e) {
      const dropdown = this.$el
      if (dropdown && !dropdown.contains(e.target)) {
        this.open = false
      }
    }
  }
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
  top: 100%;
  left: 0;
  max-width: 165px;
  width: 165px;
  margin-top: 0.5rem;
  padding: 0;
  list-style: none;
  border: 1px solid var(--light);
  background: var(--light);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.dropdown-menu li {
  padding: 8px;
  cursor: pointer;
  color: var(--text);
  
  /* tekst laten wrappen */
  white-space: normal;      /* in plaats van nowrap */
  word-break: break-word;   /* lange woorden afbreken als nodig */
  overflow-wrap: anywhere;  /* extra zekerheid voor lange woorden */
}

.dropdown-menu li:hover {
  background: var(--primary);
  font-weight: 600;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
