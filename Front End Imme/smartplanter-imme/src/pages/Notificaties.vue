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
  margin-top: 1,5%;
  margin-bottom: 1,5%;
  width: 90%;
  height: 35vh;
  background-color: #62be62be;
  border-radius: 8px;
}

.overige_meldingen {
  padding: 1rem;
  margin-left: 5%;
  margin-bottom: 1,5%;
  width: 90%;
  min-height: 35vh;
  background-color: #62be62be;
  border-radius: 8px;
}

</style>