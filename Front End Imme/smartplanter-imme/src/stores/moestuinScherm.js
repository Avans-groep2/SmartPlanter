import { defineStore } from 'pinia';

function createBuis({ openUpwards = false } = {}) {
  return {
    openUpwards,
    slots: Array(4).fill(null).map(() => ({
      plant: null
    }))
  };
}

function createLayout() {
  return [
    createBuis(),
    createBuis(),
    createBuis({ openUpwards: true })
  ];
}


export const useMoestuinStore = defineStore('moestuin', {
  state: () => ({
    actieveMoestuin: 'Moestuin 1',

    moestuinen: {
        'Moestuin 1': createLayout(),
        'Moestuin 2': createLayout(),
        'Moestuin 3': createLayout()
    }
  }),

  getters: {
    huidigeLayout(state) {
        return state.moestuinen[state.actieveMoestuin];
    }
  },

  actions: {
    setMoestuin(moestuin) {
      this.actieveMoestuin = moestuin;
    },
/*test opslaan*/
  setPlant(buisIndex, slotIndex, plantNaam) {
    this.moestuinen[this.actieveMoestuin][buisIndex]
        .slots[slotIndex].plant = plantNaam;
  }
}
});
