<template>
  <SidebarNavbar />

  <div class="Admin">
    <WelcomeMessage />

    <!-- Devices -->
    <div class="adminContainer">
      <div class="adminTitle">
        <input
          v-model="newDeviceId"
          placeholder="Device ID"
          @keyup.enter="addDevice"
        />
        <button @click="addDevice">Aanmaken</button>
      </div>

      <table class="deviceTable planterTable">
        <thead>
          <tr>
            <th>Device ID</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(device, index) in devices"
            :key="index"
            class="hoverRow"
          >
            <td>{{ device.TtnDeviceID }}</td>
            <td class="actieKolom">
              <i
                class="fa-solid fa-trash-can trashIcon"
                @click="softDeleteDevice(device)"
              ></i>
            </td>
          </tr>

          <tr v-if="devices.length === 0">
            <td colspan="2" class="emptyRow">Geen devices gevonden</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Planters -->
    <div class="adminContainer">
      <div class="adminTitle">
        <select v-model="selectedUserID">
          <option
            v-for="user in sortedUsers"
            :key="user.UserID"
            :value="user.UserID"
          >
            {{ user.Username }}
          </option>
        </select>

        <select v-model="selectedDeviceID">
          <option
            v-for="device in devices"
            :key="device.TtnDeviceID"
            :value="device.TtnDeviceID"
          >
            {{ device.TtnDeviceID }}
          </option>
        </select>

        <input
          v-model="selectedPlantenTeller"
          placeholder="PlantenTeller"
          type="number"
        />
        <input
          v-model="selectedDeviceNaam"
          placeholder="Device Naam"
        />

        <button @click="koppel">Koppelen</button>
      </div>

      <table class="deviceTable planterTable">
        <thead>
          <tr>
            <th>Username</th>
            <th>DeviceID</th>
            <th>PlantenTeller</th>
            <th>DeviceNaam</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(planter, index) in planters"
            :key="index"
            class="hoverRow"
          >
            <td>{{ getUsername(planter.UserID) }}</td>
            <td>{{ planter.DeviceID }}</td>
            <td>{{ planter.PlantenTeller }}</td>
            <td>{{ planter.DeviceNaam }}</td>
            <td class="actieKolom">
              <i
                class="fa-solid fa-trash-can trashIcon"
                @click="softDeletePlanter(planter)"
              ></i>
            </td>
          </tr>

          <tr v-if="planters.length === 0">
            <td colspan="5" class="emptyRow">Geen planters gevonden</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import WelcomeMessage from "@/components/WelcomeMessage.vue";
import SidebarNavbar from "@/components/SidebarNavbar.vue";

export default {
  name: "AdminPage",
  components: { SidebarNavbar, WelcomeMessage },

  data() {
    return {
      devices: [],
      newDeviceId: "",
      planters: [],
      users: [],
      selectedUserID: "",
      selectedDeviceID: "",
      selectedPlantenTeller: "",
      selectedDeviceNaam: "",
    };
  },

  mounted() {
    this.loadDevices();
    this.loadPlanters();
    this.loadUsers();
  },

  computed: {
    sortedUsers() {
      return [...this.users].sort((a, b) =>
        a.Username.localeCompare(b.Username)
      );
    },
  },

  methods: {
    // --- Load Data ---
    loadDevices() {
      fetch("https://smartplanters.dedyn.io:1880/smartplantdata?table=Devices")
        .then((res) => res.json())
        .then((data) => {
          this.devices = data;
          if (!this.selectedDeviceID && data.length) {
            this.selectedDeviceID = data[data.length - 1].TtnDeviceID;
          }
        })
        .catch((err) => console.error("Fout bij ophalen devices:", err));
    },

    loadPlanters() {
      fetch("https://smartplanters.dedyn.io:1880/smartplantdata?table=Planter")
        .then((res) => res.json())
        .then((data) => (this.planters = data))
        .catch((err) => console.error("Fout bij ophalen planters:", err));
    },

    loadUsers() {
      fetch("https://smartplanters.dedyn.io:1880/smartplantdata?table=Users")
        .then((res) => res.json())
        .then((data) => {
          this.users = data;
          if (!this.selectedUserID && data.length) {
            this.selectedUserID = data[0].UserID;
          }
        })
        .catch((err) => console.error("Fout bij ophalen users:", err));
    },

    // --- Add / Koppel ---
    addDevice() {
      if (!this.newDeviceId.trim()) return;

      fetch(
        `https://smartplanters.dedyn.io:1880/smartplantedit?table=Devices&ttnDeviceID=${this.newDeviceId}`
      )
        .then(() => {
          this.newDeviceId = "";
          this.loadDevices();
        })
        .catch((err) => {
          console.error(err);
          this.$toast("Device kon niet worden toegevoegd", "error");
        });
    },

    koppel() {
      if (!this.selectedUserID || !this.selectedDeviceID) return;

      fetch(
        `https://smartplanters.dedyn.io:1880/smartplantedit?table=Planter` +
          `&userID=${this.selectedUserID}` +
          `&deviceID=${this.selectedDeviceID}` +
          `&plantenTeller=${this.selectedPlantenTeller}` +
          `&deviceNaam=${this.selectedDeviceNaam}`
      )
        .then(() => {
          this.selectedPlantenTeller = "";
          this.selectedDeviceNaam = "";
          this.loadPlanters();
        })
        .catch((err) => {
          console.error(err);
          this.$toast("Planter kon niet worden toegevoegd", "error");
        });
    },

    // --- Soft Delete Planter ---
    softDeletePlanter(planter) {
      if (!planter?.UserID || !planter?.DeviceID) {
        this.$toast("Verwijderen mislukt", "error");
        return;
      }

      this.planters = this.planters.filter(
        (p) =>
          !(p.UserID === planter.UserID && p.DeviceID === planter.DeviceID)
      );

      fetch(
        `https://smartplanters.dedyn.io:1880/cleardata?table=Planter&userID=${planter.UserID}&deviceID=${planter.DeviceID}`
      );

      this.$toast("Planter succesvol verwijderd", "success");
    },

    // --- Soft Delete Device ---
    softDeleteDevice(device) {
      const deviceID = device?.TtnDeviceID;
      if (!deviceID) {
        this.$toast("Verwijderen mislukt", "error");
        return;
      }

      this.devices = this.devices.filter((d) => d.TtnDeviceID !== deviceID);

      fetch(
        `https://smartplanters.dedyn.io:1880/cleardata?table=Devices&ttnDeviceID=${deviceID}`
      );

      this.$toast("Device succesvol verwijderd", "success");
    },

    getUsername(userID) {
      const user = this.users.find((u) => u.UserID === userID);
      return user ? user.Username : userID;
    },
  },
};
</script>


<style scoped>
.Admin {
  margin-left: 5rem;
  color: var(--text);
}

.adminContainer {
  background: var(--light);
  width: 90%;
  border-radius: 15px;
  margin: 2rem 0 0 3rem;
  padding: 1rem;
}

.adminTitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input,
select {
  padding: 0.5rem;
  border-radius: 10px;
  border: 2px solid var(--icon);
  background: var(--light);
  color: var(--text);
}

button {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
}

.deviceTable {
  width: 100%;
  border-collapse: collapse;
}

.deviceTable thead {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.deviceTable thead th {
  padding: 0.6rem;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid var(--icon);
}

.deviceTable tbody {
  display: block;
  min-height: 11rem;
  max-height: 11rem;
  overflow-y: auto;
}

.deviceTable tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.deviceTable tbody td {
  padding: 0.6rem;
  border: none;
}

.emptyRow {
  text-align: center;
  color: var(--icon);
  font-style: italic;
}

.actieKolom {
  width: 40px;
  text-align: center;
}

.trashIcon {
  opacity: 0;
  cursor: pointer;
  color: var(--danger);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.hoverRow:hover .trashIcon {
  opacity: 1;
  transform: scale(1.1);
}

.deviceTable tbody tr:hover{
  color: var(--danger);
}
</style>
