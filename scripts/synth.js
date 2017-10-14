import { makeVoice } from './voice.js';
import makeEnvelope from './envelope.js';
import amp from './amp.js';
import lfo from './lfo.js';
let WIDTH = document.querySelector('#canvas').width;
let HEIGHT = document.querySelector('#canvas').height;

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
    tremoloAmp: amp({context, vol: 0}),
    tremoloLfo: lfo({context, frequency: 0}),
    vibratoSpeed: 0,
    vibratoDepth: 0,
    tremoloSpeed: 0,
    tremoloDepth: 0,
    osc1type: 'sine',
    osc2type: 'sine',
    osc1cutoff: 22,
    osc2cutoff: 22,
    osc1vol: 0.0416,
    osc2vol: 0.0208,
    osc1oct: 1,
    osc2oct: 2,
    envelope: {attack: 0, decay: 0, sustain: 1, release: .5},
    start(key){
      let n = key.n;
      let frequency = this.calculateFrequency(n);
      let type1 = this.osc1type, type2 = this.osc2type,
          vol1 = this.osc1vol, vol2 = this.osc2vol,
          oct1 = this.osc1oct, oct2 = this.osc2oct,
          cutoff1 = this.osc1cutoff, cutoff2 = this.osc2cutoff,
          res1 = this.osc1res, res2 = this.osc2res,
          vibratoSpeed = this.vibratoSpeed, vibratoDepth = this.vibratoDepth,
          tremoloSpeed = this.tremoloSpeed, tremoloDepth = this.tremoloDepth;
      this.activeVoices[n] =
        makeVoice({
          context, n, frequency, volume, type1, type2,
          vol1, vol2, oct1, oct2, cutoff1, cutoff2, res1, res2,
          vibratoSpeed, vibratoDepth, tremoloSpeed, tremoloDepth});
      this.activeVoices[n].connect();
      let envelope = this.envelope;
      this.activeVoices[n].start(envelope);
    },
    draw(ctx){

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      let voiceKeys = Object.keys(this.activeVoices);
      voiceKeys.forEach((key) => {
        this.activeVoices[key].analyser.draw(ctx, this.activeVoices[key].frequency);
      });
    },

    updateFrequencies(diff){
      let voiceKeys = Object.keys(this.activeVoices);
      for (let i = 0; i < voiceKeys.length; i++){
        let n = this.activeVoices[voiceKeys[i]].n;
        n += diff;
        this.activeVoices[voiceKeys[i]].n = n;
        let freq = this.calculateFrequency(n);
        this.activeVoices[voiceKeys[i]].changeFrequency(freq);
      }
    },

    changeLFO(value, control, type){
      if (type === 'vibrato'){
        if ( control === 'speed') {
          this.vibratoSpeed = value;
        } else {
          this.vibratoDepth = value;
        }
      } else {
        if (type === 'tremolo') {
          if (control === 'speed'){
            this.tremoloSpeed = value;
            this.tremoloLfo.lfoFrequency.value = value;
          } else {
            value /= 1000;
            this.tremoloDepth = value;
            this.tremoloAmp.gain.gain.value = value;
          }
        }
      }
      let voiceKeys = Object.keys(this.activeVoices);
      for (let i = 0; i < voiceKeys.length; i++){
        if (type === 'vibrato'){
          if (control === 'speed'){
            this.activeVoices[voiceKeys[i]].lfoVibrato.changeFrequency(this.vibratoSpeed);
          } else {
            this.activeVoices[voiceKeys[i]].lfoVibratoAmp.changeAmplitude(this.vibratoDepth);
          }
        }
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
