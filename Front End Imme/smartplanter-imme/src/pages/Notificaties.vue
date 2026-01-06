<template>

  <div class="belangrijke_meldingen">
    <h1 style="color:red;">Belangrijke meldingen!</h1></div>
  <div class="overige_meldingen">
    <h1>Overige meldingen</h1></div>

    <div class="accountknop">
      <a href="https://141.148.237.73:8443/realms/smartplanter/account/" class="settingsknop">Account instellingen</a>
      <a href="https://141.148.237.73:8443/realms/smartplanter/protocol/openid-connect/auth?client_id=account-console&redirect_uri=https%3A%2F%2F141.148.237.73%3A8443%2Frealms%2Fsmartplanter%2Faccount%2Faccount-security%2Fsigning-in&state=8c3aac17-1241-4bd4-9de2-d11824f4ed4a&response_mode=query&response_type=code&scope=openid&nonce=898ca48e-a8a8-4ddc-8bf2-39a537423d6e&kc_action=UPDATE_PASSWORD&code_challenge=LnzxFopox0ypY48supME6ceKSjZy8OUotdIRR13--Io&code_challenge_method=S256" class="settingsknop">Wachtwoord bewerken</a>
    </div>

</template>



<script>
export default {
  name: 'MeldingenPagina',
  components: {}
}
</script>




<style>

#h1 {
  font-size: 17px;
  font-weight: 200; 
  color: #2d6a4f;
}

.belangrijke_meldingen {
  padding: 0.5rem;
  margin-left: 5%;
  margin-top: 2%;
  margin-bottom: 2%;
  width: 90%;
  height: 35vh;
  background-color: #ffffff9e;
  border-radius: 8px;
  border: 3px solid #2d6a4f;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); 
}

.overige_meldingen {
  padding: 0.5rem;
  margin-left: 5%;
  margin-bottom: 2%;
  width: 90%;
  min-height: 35vh;
  background-color: #ffffff9e;
  border-radius: 8px;
  border: 3px solid #2d6a4f;
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