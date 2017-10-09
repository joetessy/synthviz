import makeSynth from './synth.js';

export const synthView = {
  synth: makeSynth(),

  keys: {
    65: { n: 40 },
    87: { n: 41 },
    83: { n: 42 },
    69: { n: 43 },
    68: { n: 44 },
    70: { n: 45 },
    84: { n: 46 },
    71: { n: 47 },
    89: { n: 48 },
    72: { n: 49 },
    85: { n: 50 },
    74: { n: 51 },
    75: { n: 52 },
    79: { n: 53 },
    76: { n: 54 },
    80: { n: 55 },
  },

  start(){
    document.addEventListener('keydown', e => {
      if (this.keys[e.keyCode]) {
        let key = e.keyCode;
        let n = this.keys[key].n;
        this.synth.createVoice(n);
      }
    });

    document.addEventListener('keyup', e => {
      if (this.keys[e.keyCode]) {
        let key = e.keyCode;
        let n = this.keys[key].n;
        this.synth.activeVoices[n].stop();
        delete this.synth.activeVoices[n];
      }
    });

  },
};
