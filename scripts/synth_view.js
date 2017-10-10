import makeSynth from './synth.js';

export const synthView = {
  synth: makeSynth(),
  keys: {
    65: { down: false, n: 40 },
    87: { down: false, n: 41 },
    83: { down: false, n: 42 },
    69: { down: false, n: 43 },
    68: { down: false, n: 44 },
    70: { down: false, n: 45 },
    84: { down: false, n: 46 },
    71: { down: false, n: 47 },
    89: { down: false, n: 48 },
    72: { down: false, n: 49 },
    85: { down: false, n: 50 },
    74: { down: false, n: 51 },
    75: { down: false, n: 52 },
    79: { down: false, n: 53 },
    76: { down: false, n: 54 },
    80: { down: false, n: 55 },
    90: { down: false, type: 'octave' },
    88: { down: false, type: 'octave' }
  },
  octave(key){
    let codes = Object.keys(this.keys);
    for (let i = 0; i < codes.length; i++){
      if (key === 88){
        this.keys[codes[i]].n += 12;
      } else {
        this.keys[codes[i]].n -= 12;
      }
    }
  },
  start(){
    let keys = this.keys;

    document.addEventListener('keydown', e => {

      if (keys[e.keyCode]) {
        let key = e.keyCode;

      if (keys[key].down) return;
      keys[key].down = true;

      // Change Octave
      if (keys[key].type === 'octave') {
        this.octave(key);
        return;
      }

        let n = keys[key].n;
        this.synth.createVoice(n);
      }

    });

    document.addEventListener('keyup', e => {
      if (keys[e.keyCode]) {
        let key = e.keyCode;
        keys[key].down = false;

        //
        if (keys[key].type === 'octave') return;
        let n = keys[key].n;
        this.synth.stop(n);
      }
    });
  },
};
