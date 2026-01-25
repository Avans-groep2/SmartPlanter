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
            'Moestuin 2': createLayout(),
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

    async fetchMeldingenAction() {
      this.setLoading(true);
      try {
        const response = await fetch('https://smartplanters.dedyn.io:1880/smartplantdata?table=Meldingen');
        const data = await response.json();
        this.setMeldingen(data);
      } catch (error) {
        console.error("Fout bij ophalen meldingen in store:", error);
        this.setMeldingen([]);
      } finally {
        this.setLoading(false);
      }
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
