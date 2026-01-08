import { defineStore } from 'pinia';

export const useMoestuinStore = defineStore('moestuin', {
  state: () => ({
    actieveMoestuin: 'Moestuin 1'
  }),
  actions: {
    setMoestuin(moestuin) {
      this.actieveMoestuin = moestuin;
    }
  }
});
