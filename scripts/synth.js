import { makeVoice } from './voice.js';

export default function makeSynth(){
  var context = new AudioContext();

  return {
    context,
    activeVoices: {},
    createVoice(n){
      let frequency = this.calculateFrequency(n);
      this.activeVoices[n] = makeVoice({context, frequency});
      this.activeVoices[n].setFrequency();
      this.activeVoices[n].connect();
      this.start(n);
    },
    start(n){
      this.activeVoices[n].start();
    },
    stop(n){
      if (!this.activeVoices[n]) {
        n += 12;
        if (!this.activeVoices[n]){
          n -= 24;
        }
      }
      this.activeVoices[n].stop();
      delete this.activeVoices[n];
    },
    calculateFrequency(n){
      return Math.pow(2, (n-49)/12) * 440;
    }
  };
}
