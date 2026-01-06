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
  margin-top: 2%;
  margin-bottom: 2%;
  width: 90%;
  height: 30vh;
  background-color: rgb(93, 144, 64);
  border-radius: 8px;
}

.overige_meldingen {
  padding: 1rem;
  margin-left: 5%;
  margin-bottom: 2%;
  width: 90%;
  min-height: 30vh;
  background-color: #5aa85ab5;
  border-radius: 8px;
}

</style>