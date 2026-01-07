<template>

  <div class="belangrijke_meldingen">
    <h1 style="color:red;" class="notificatiesH1">Belangrijke meldingen!</h1></div>
  <div class="overige_meldingen">
    <h1 class="notificatiesH1">Overige meldingen</h1></div>

    <div class="inspiratieKnop"> 
    <a href="https://www.keukenliefde.nl/kook-koelkast-leeg/" class="inspiraiteWebsite" style="color:white";>? </a>
  </div>

</template>



<script>
export default {
  name: 'MeldingenPagina',
  components: {}
}
</script>




<style>

.notificatiesH1 {
  font-size: 25px;
  font-weight: 400; 
  font-style: bold;
}

.belangrijke_meldingen {
  padding: 0.5rem;
  margin-left: 5%;
  margin-top: 2%;
  margin-bottom: 2%;
  width: 90%;
  height: 35vh;
  background-color: #ffffff; 
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); 
}

.overige_meldingen {
  padding: 0.5rem;
  margin-left: 5%;
  margin-bottom: 2%;
  width: 90%;
  min-height: 35vh;
  background-color: #ffffff;  
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); 
}

.inspiratieKnop {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #2d6a4f;
    border: 3px solid #2d6a4f;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    right: 20px;
    bottom: 80px; /* ruimte boven footer */
    z-index: 1000;
    transition: background-color 0.2s;
}

.inspiratieKnop:hover {
  background-color: #3c803c;
}

</style>