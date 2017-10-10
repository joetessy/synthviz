import { makeVoice } from './voice.js';
import makeEnvelope from './envelope.js';
import amp from './amp.js';

export default function makeSynth(){
  var context = new AudioContext();
  var volume = amp({context});

  return {
    context,
    activeVoices: {},
    destination: context.destination,
    volume,
    envelope: {attack: 0, decay: 0, sustain: 1, release: 0},
    start(key){
      let n = key.n;
      let frequency = this.calculateFrequency(n);
      this.activeVoices[n] = makeVoice({context, frequency, volume});
      this.activeVoices[n].connect();
      let envelope = this.envelope;
      this.activeVoices[n].start(envelope);
    },

    stop(n){
      if (!this.activeVoices[n]);
      n = this.handleOctaveChange(n);
      this.activeVoices[n].stop(this.envelope.release);
      delete this.activeVoices[n];
    },

    handleOctaveChange(n){
      let order = 1;
      while (!this.activeVoices[n]){
        let inc = 12;
        if (this.activeVoices[n + (inc * order)]){
          n = n + (inc * order);
        } else if (this.activeVoices[ n - (inc * order)]){
          n = n - (inc * order);
        }
        order += 1;
      }
      return n;
    },

    calculateFrequency(n){
      return Math.pow(2, (n-49)/12) * 440;
    }
  };
}
