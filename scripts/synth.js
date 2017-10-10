import { makeVoice } from './voice.js';

export default function makeSynth(){
  var context = new AudioContext();

  return {
    context,
    activeVoices: {},
    start(key){
      let n = key.n;
      let frequency = this.calculateFrequency(n);
      this.activeVoices[n] = makeVoice({context, frequency});
      this.activeVoices[n].setFrequency();
      this.activeVoices[n].connect();
      this.activeVoices[n].start();
    },
    stop(n){
      if (!this.activeVoices[n]);
      n = this.handleOctaveChange(n);
      this.activeVoices[n].stop();
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
