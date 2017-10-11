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
    osc1type: 'sine',
    osc2type: 'sine',
    osc1vol: 0.5,
    osc2vol: 0,
    osc1oct: 1,
    osc2oct: 2,
    envelope: {attack: 0, decay: 0, sustain: .5, release: .5},
    start(key){
      let n = key.n;
      let frequency = this.calculateFrequency(n);
      let type1 = this.osc1type, type2 = this.osc2type,
          vol1 = this.osc1vol, vol2 = this.osc2vol,
          oct1 = this.osc1oct, oct2 = this.osc2oct;
      this.activeVoices[n] =
        makeVoice({context, frequency, volume, type1, type2, vol1, vol2, oct1, oct2});
      this.activeVoices[n].connect();
      let envelope = this.envelope;
      this.activeVoices[n].start(envelope);
    },

    changeOscVolume(vol, osc){
      if (osc === 1){
        this.osc1vol = vol;
      } else {
        this.osc2vol = vol;
      }
      let voiceKeys = Object.keys(this.activeVoices);
      for (let i = 0; i < voiceKeys.length; i++){
        this.activeVoices[voiceKeys[i]].amp1.changeAmplitude(this.osc1vol);
        this.activeVoices[voiceKeys[i]].amp2.changeAmplitude(this.osc2vol);
      }
    },
    //
    // changeOscProp(prop, val){
    //   let voiceKeys = Object.keys(this.activeVoices);
    //   for (let i = 0; i < voiceKeys.length; i++){
    //     this.activeVoices[voiceKeys[i]][prop] = val;
    //     this.activeVoices[voiceKeys[i]][prop] = val;
    //   }
    // },
    changeOctave(octave, osc){
      if (osc === 1){
        this.osc1oct = octave;
      } else {
        this.osc2oct = octave;
      }

      let voiceKeys = Object.keys(this.activeVoices);
      for (let i = 0; i < voiceKeys.length; i++){
          this.activeVoices[voiceKeys[i]].oscillator1.changeOctave(this.osc1oct);
          this.activeVoices[voiceKeys[i]].oscillator2.changeOctave(this.osc2oct);

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
