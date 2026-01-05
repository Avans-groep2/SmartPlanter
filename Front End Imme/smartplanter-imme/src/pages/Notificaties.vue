<template>

  <div class="belangrijke_meldingen"></div>
    <h1 style="color:red;">Belangrijke meldingen!</h1>
  <div class="overige_meldingen"></div>
    <h1>Overige meldingen</h1>

</template>



<script>
export default {
  name: 'MeldingenPagina',
  components: {}
}
</script>




<style>

#h1 {
  font-size: 20px;
  font-weight: 200%; 
}

.belangrijke_meldingen {
  margin-left: 10%;
  width: 80% ;
  height: auto;
  background-color: rgba(169, 255, 115, 0.63);
}

.overige_meldingen {
  margin-left: 10%;
  max-width: 80% ;
  max-height: auto;
  background-color: rgba(169, 255, 115, 0.63);
}

</style>