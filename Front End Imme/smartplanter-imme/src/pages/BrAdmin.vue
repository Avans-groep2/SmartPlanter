<template>
  <div class="deviceId">
    <h1 class="adminH1">Device Id kiezen:</h1>
    <div class="deviceKeuze">
        <input
        type="text"
        v-model="deviceIdKeuze"
        placeholder="Vul de device Id in..."
        />
        <button class="deviceKeuzenKnop" @click="bevestigNaam">Kies</button>
    </div>

    </div>
    <div class="accountKoppelen"></div>
</template>

<script>

export default {
  name: 'AccountBeheerder',
  components: {},
  data() {
    return {
        deviceIdKeuze: ""
    };
  },
  methods: {
    bevestigDeviceId(){
      this.deviceIdKeuze = ""
    }
  }
}

</script>

<style>

.deviceId {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  max-width: 350px;
  min-height: 255px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}

.adminH1 {
    font-size: 30px;
    font-weight: 450;
}

.accountKoppelen {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  max-width: 350px;
  min-height: 255px;

  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:0 2px 8px rgba(0,0,0,0.25);
}

.deviceKeuzenKnop {
  background-color: #2d6a4f;
  color: white;
  font-size: 15px;
  padding: 8px 15px; 
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
  width: auto; 
  height: 3rem;
  box-shadow:0 2px 8px rgba(0,0,0,0.25)  ;
}

.deviceKeuzenKnop:hover{
  filter: brightness(0.5);
  background-color: #2d6a4f;
}



</style>