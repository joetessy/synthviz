import { makeVoice } from './voice.js';
import makeEnvelope from './envelope.js';
import amp from './amp.js';

export default function makeSynth(){
  var context = new AudioContext();
  var compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 12;
  compressor.attack.value = .25;
  compressor.release.value = 0.25;
  var volume = amp({context});

  return {
    context,
    activeVoices: {},
    destination: context.destination,
    volume,
    compressor,
    osc1type: 'sine',
    osc2type: 'sine',
    osc1cutoff: 22,
    osc2cutoff: 22,
    osc1vol: 0.5,
    osc2vol: 0.25,
    osc1oct: 1,
    osc2oct: 2,
    envelope: {attack: 0, decay: 0, sustain: .5, release: .5},
    start(key){
      let n = key.n;
      let frequency = this.calculateFrequency(n);
      let type1 = this.osc1type, type2 = this.osc2type,
          vol1 = this.osc1vol, vol2 = this.osc2vol,
          oct1 = this.osc1oct, oct2 = this.osc2oct,
          cutoff1 = this.osc1cutoff, cutoff2 = this.osc2cutoff,
          res1 = this.osc1res, res2 = this.osc2res;
      this.activeVoices[n] =
        makeVoice({
          context, n, frequency, volume, type1, type2,
          vol1, vol2, oct1, oct2, cutoff1, cutoff2, res1, res2});
      this.activeVoices[n].connect();
      let envelope = this.envelope;
      this.activeVoices[n].start(envelope);
    },

    updateFrequencies(diff){
      let voiceKeys = Object.keys(this.activeVoices);
      for (let i = 0; i < voiceKeys.length; i++){
        let n = this.activeVoices[voiceKeys[i]].n;
        n += diff;
        let freq = this.calculateFrequency(n);
        this.activeVoices[voiceKeys[i]].changeFrequency(freq);
      }

    },

    changeOscVolume(vol, osc){
      let changedOsc;
      if (osc === 1){
        changedOsc = 1;
        this.osc1vol = vol;
      } else {
        changedOsc = 2;
        this.osc2vol = vol;
      }
      let voiceKeys = Object.keys(this.activeVoices);
      for (let i = 0; i < voiceKeys.length; i++){
        if (changedOsc === 1){
          this.activeVoices[voiceKeys[i]].amp1.changeAmplitude(this.osc1vol);
        } else {
          this.activeVoices[voiceKeys[i]].amp2.changeAmplitude(this.osc2vol);
        }
      }
    },

    changeOctave(octave, osc){
      debugger;
      let changedOct;
      if (osc === 1){
        changedOct = 1;
        this.osc1oct = octave;
      } else {
        changedOct = 2;
        this.osc2oct = octave;
      }
      let voiceKeys = Object.keys(this.activeVoices);
      for (let i = 0; i < voiceKeys.length; i++){
        if (changedOct === 1){
          this.activeVoices[voiceKeys[i]].oscillator1.changeOctave(this.osc1oct);
        } else {
          this.activeVoices[voiceKeys[i]].oscillator2.changeOctave(this.osc2oct);
        }
      }
    },

    changeCutoff(freq, res, osc){
      let changedOsc;
      if (osc === 1){
        changedOsc = 1;
        this.osc1cutoff = freq;
      } else {
        changedOsc = 2;
        this.osc2cutoff = freq;
      }

      let voiceKeys = Object.keys(this.activeVoices);
      for (let i = 0; i < voiceKeys.length; i++){
        if (changedOsc === 1){
          this.activeVoices[voiceKeys[i]].filter1.changeFilter(freq);
        } else {
          this.activeVoices[voiceKeys[i]].filter2.changeFilter(freq);
        }
      }
    },

    changeType(type, osc){
      if (osc === '1'){
        this.osc1type = type;
      } else {
        this.osc2type = type;
      }
      let voiceKeys = Object.keys(this.activeVoices);
    },

    stop(n){
      if (!this.activeVoices[n]);
      n = this.handleOctaveChange(n);
      let voice = this.activeVoices[n];
      voice.stop(this.envelope.release);
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
