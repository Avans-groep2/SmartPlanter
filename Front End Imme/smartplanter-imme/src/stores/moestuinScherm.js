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
    let baseState;

    if (saved) {
        baseState = JSON.parse(saved);
    }else {
      baseState = {
        actieveMoestuin: 'Moestuin 1',
        moestuinen: {
            'Moestuin 1': createLayout(),
            'Moestuin 2': createLsayout(),
            'Moestuin 3': createLayout()
        }
      }
    };
    return {
      ...baseState,
      meldingen: [],
      loadingMeldingen: false
    }
  }, 

  getters: {
    huidigeLayout(state) {
        return state.moestuinen[state.actieveMoestuin];
    },
    meldingenCount(state) {
      return state.meldingen.length;
    }
  },

  actions: {
    setMeldingen(data) {
      this.meldingen = Array.isArray(data) ? data : [];
    },
    setLoading(status) {
      this.loadingMeldingen = status;
    },

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
      this.moestuinen[this.actieveMoestuin][buisIndex]
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
