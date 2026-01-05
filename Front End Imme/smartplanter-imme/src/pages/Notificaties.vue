<template>

  <div class="belangrijke_meldingen">
    <h1 style="color:red;">Belangrijke meldingen!</h1></div>
  <div class="overige_meldingen">
    <h1>Overige meldingen</h1></div>

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
  padding: 1rem;
  margin-left: 5%;
  width: 90%;
  height: auto;
  background-color: rgba(94, 144, 64, 0.63);
  border-radius: 8px;
}

.overige_meldingen {
  padding: 1rem;
  margin-top: 40%;
  margin-left: 10%;
  width: 80% ;
  height: auto;
  background-color: rgba(94, 144, 64, 0.63);
  border-radius: 8px;
}

</style>