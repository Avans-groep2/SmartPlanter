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

const STORAGE_KEY = 'moestuin-data';


export const useMoestuinStore = defineStore('moestuin', {
  state: () =>  {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        return JSON.parse(saved);
    }

    return {
        actieveMoestuin: 'Moestuin 1',
        moestuinen: {
            'Moestuin 1': createLayout(),
            'Moestuin 2': createLayout(),
            'Moestuin 3': createLayout()
    }
    };
  },

  getters: {
    huidigeLayout(state) {
        return state.moestuinen[state.actieveMoestuin];
    }
  },

  actions: {
    setMoestuin(moestuin) {
      this.actieveMoestuin = moestuin;
      this.save();
    },

  setPlant(buisIndex, slotIndex, plantNaam) {
    this.moestuinen[this.actieveMoestuin][buisIndex]
        .slots[slotIndex].plant = plantNaam;
        this.save();
  },

  oogstPlant(buisIndex, slotIndex, score) {
    this.moestuin[this.actieveMoestuin][buisIndex]
    .slots[slotIndex].plant = null;

    console.log('Oogstscore:', score);

    this.save();
  },

  save() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            actieveMoestuin: this.actieveMoestuin,
            moestuinen: this.moestuinen
        })
    );
  }
}
});
