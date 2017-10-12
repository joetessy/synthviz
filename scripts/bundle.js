/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = makeAmp;
function makeAmp({context, vol}){
  let gain = context.createGain();
  if (vol === undefined) vol = .01;
  let input = gain,
      output = gain,
      amplitude = gain.gain;
      amplitude.value = vol;

  return {
    gain,
    input,
    output,
    amplitude,
    changeAmplitude(newAmplitude){
      this.amplitude.value = newAmplitude;
    },
    connect(node){
      if (node.hasOwnProperty('input')) {
        this.output.connect(node.input);
      } else {
        this.output.connect(node);
      }
    }
  };
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = makeEnvelope;
function makeEnvelope({context}){
  let envelope = {

    envOn(attackTime, decayTime, sustainVal, amplitude){
      let now = context.currentTime;
      this.param.cancelScheduledValues(now);
      this.param.setValueAtTime(0, now);
      this.param.linearRampToValueAtTime(amplitude, now + attackTime);
      this.param.linearRampToValueAtTime(
        (amplitude * sustainVal), now + attackTime + decayTime);
    },

    envOff(releaseTime){
      let now = context.currentTime;
      this.param.cancelScheduledValues(0);
      this.param.setValueAtTime(this.param.value, now);
      this.param.linearRampToValueAtTime(0, now + releaseTime);
    },
    connect(param){
      this.param = param;
    }
  };
  return envelope;
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__synth_js__ = __webpack_require__(6);

  var synth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__synth_js__["a" /* default */])();

const synthView = {
  synth,
  inc: 0,
  keys: {
    65: { down: false, n: 40, action: (n) => synthView.startSynth(n) },
    87: { down: false, n: 41, action: (n) => synthView.startSynth(n) },
    83: { down: false, n: 42, action: (n) => synthView.startSynth(n) },
    69: { down: false, n: 43, action: (n) => synthView.startSynth(n) },
    68: { down: false, n: 44, action: (n) => synthView.startSynth(n) },
    70: { down: false, n: 45, action: (n) => synthView.startSynth(n) },
    84: { down: false, n: 46, action: (n) => synthView.startSynth(n) },
    71: { down: false, n: 47, action: (n) => synthView.startSynth(n) },
    89: { down: false, n: 48, action: (n) => synthView.startSynth(n) },
    72: { down: false, n: 49, action: (n) => synthView.startSynth(n) },
    85: { down: false, n: 50, action: (n) => synthView.startSynth(n) },
    74: { down: false, n: 51, action: (n) => synthView.startSynth(n) },
    75: { down: false, n: 52, action: (n) => synthView.startSynth(n) },
    79: { down: false, n: 53, action: (n) => synthView.startSynth(n) },
    76: { down: false, n: 54, action: (n) => synthView.startSynth(n) },
    80: { down: false, n: 55, action: (n) => synthView.startSynth(n) },
    90: { down: false, type: 'octave', dir: 'down',
      action: (n) => synthView.octave(n) },
    88: { down: false, type: 'octave', dir: 'up',
      action: (n) => synthView.octave(n) }
  },
  octave(obj){
    let oct1, oct2;
    if (obj.dir === 'up'){
      oct1 = this.synth.osc1oct + 1;
      oct2 = this.synth.osc2oct + 1;
    } else {
      oct1 = this.synth.osc1oct - 1;
      oct2 = this.synth.osc2oct - 1;
    }
    this.synth.changeOctave(oct1, 1);
    this.synth.changeOctave(oct2, 2);
  },
  increment(val){
    let keys = Object.keys(this.keys);
    let diff = Math.abs(this.inc - val);
    if (this.inc > val) diff *= -1;

    for (let i = 0; i < keys.length; i++){
      let currKey = keys[i];
      if (!this.keys[currKey].incremented){
        this.keys[currKey].origin = this.keys[currKey].n;
      }
      if (this.synth.activeVoices[this.keys[currKey].n]){
        this.keys[currKey].incremented = true;
      }
      let n = this.keys[currKey].n += diff;
      if (n) this.keys[currKey].n = n;
    }
    this.synth.updateFrequencies(diff);
    this.inc = val;
    this.updateKeyLettering();
  },
  updateKeyLettering(){
    let keyLetters = ["A","W","S","E","D","F","T","G",
                      "Y","H","U","J","K","O","L","P"];
    let keyValues = Object.keys(this.keys);
    let firstKey = this.keys[keyValues[0]].n;
    let keyDivs = document.querySelectorAll('div[data-keynum]');

    for (let i = 0; i < keyDivs.length; i++){
      keyDivs[i].innerHTML = ("");
    }
    for (let i = 0; i < keyLetters.length; i++){
      let keyString = `div[data-keynum="${i + firstKey}"]`;
      let keyDiv = document.querySelector(keyString);
      keyDiv.innerHTML = (keyLetters[i]);
    }
  },
  startSynth(n){
    this.synth.start(n);
    this.pushKey(n.n);
  },
  pushKey(n){
    let keyString = `div[data-key="${n}"]`;
    let key = document.querySelector(keyString);
    if (key !== null){
      if (Array.from(key.classList).includes('black')){
        key.classList.add('playblack');
      } else {
        key.classList.add('playwhite');
      }
    }
  },

  releaseKey(n){
    let keyString = `div[data-key="${n}"]`;
    let key = document.querySelector(keyString);
    if (key !== null){
      if (Array.from(key.classList).includes('black')){
        key.classList.remove('playblack');
      } else {
        key.classList.remove('playwhite');
      }
    }
  },

  setUpLFO(){
    document.querySelector('.lfo-on-off').addEventListener('click', function(e){
      if (Array.from(e.currentTarget.classList).includes('off')){
        e.currentTarget.classList.remove('off');
        e.currentTarget.classList.add('on');
        e.currentTarget.innerHTML = 'ON';
      } else {
        e.currentTarget.classList.add('off');
        e.currentTarget.classList.remove('on');
        e.currentTarget.innerHTML = 'OFF';
      }
    });
  },

  setUpKnobs(){
    let that = this;
    $(".knob").knob({
        'release': function(v){
          switch(this.$[0].dataset.action){
            case 'tune':
              that.increment(v);
              break;
            case 'attack':
              jQuery.event.trigger('setAttack', 2 * v / 100);
              break;
            case 'decay':
              jQuery.event.trigger('setDecay', 3 * v / 100);
              break;
            case 'sustain':
              jQuery.event.trigger('setSustain', (v / 100 * .5));
              break;
            case 'release':
              jQuery.event.trigger('setRelease', 2 * v / 100);
              break;
            case 'oscVolume':
              if (this.$[0].dataset.osc === '1'){
                that.synth.changeOscVolume(v/200, 1);
              } else {
                that.synth.changeOscVolume(v/200, 2);
              }
              break;
            case 'octave':
              if (this.$[0].dataset.osc === '1'){
                that.synth.changeOctave(v, 1);
              } else {
                that.synth.changeOctave(v, 2);
              }
              break;
            case 'cutoff':
              if (this.$[0].dataset.osc === '1'){
                that.synth.changeCutoff(v, that.synth.osc1res, 1);
              } else {
                that.synth.changeCutoff(v, that.synth.osc2res, 2);
              }
              break;
          }
        }
    });
  },
  setUpOscillatorTypes(){
    var oscSettings = document.querySelectorAll('.osctype');
    oscSettings.forEach((osc) => {
      osc.addEventListener('click', function(e){
        let type = e.currentTarget.getAttribute('data-type');
        let num = e.currentTarget.getAttribute('data-osc');
        let currSet = document.querySelectorAll(`div[data-osc="${num}"]`);
        currSet.forEach(osci => {
          osci.classList.remove('active');
        });
        this.synth.changeType(type, num);
        e.currentTarget.classList.add('active');
      }.bind(this));
    });
  },

  start(){
    let keys = this.keys;
    this.setUpKnobs();
    this.setUpLFO();
    this.setUpOscillatorTypes();
    document.addEventListener('keydown', e => {
      let keyInfo = keys[e.keyCode];
      if (keyInfo) {
        jQuery.event.trigger('gateOn');
        if (keyInfo.down) return;
        keyInfo.down = true;
        keyInfo.action(keyInfo);
      }
    });

    document.addEventListener('keyup', e => {
      let keyInfo = keys[e.keyCode];
      if (keyInfo) {
        keyInfo.down = false;
        // If octave key, return before stopping synth
        if (keyInfo.type === 'octave' ) return;

        let n = keyInfo.n;
        if (keyInfo.incremented){
          this.synth.stop(keyInfo.origin);
          this.releaseKey(keyInfo.origin);
          keyInfo.incremented = false;
        } else {
          this.synth.stop(n);
          this.releaseKey(n);
        }
      }

    });

    $(document).bind('setAttack', function (_, value) {
      this.synth.envelope.attack = value;
    }.bind(this));

    $(document).bind('setDecay', function (_, value) {
      this.synth.envelope.decay = value;
    }.bind(this));

    $(document).bind('setSustain', function (_, value) {
      this.synth.envelope.sustain = value;
    }.bind(this));

    $(document).bind('setRelease', function (_, value) {
      this.synth.envelope.release = value + .01;
    }.bind(this));


    this.synth.volume.connect(this.synth.compressor);
    this.synth.compressor.connect(this.synth.context.destination);

  },
};
/* harmony export (immutable) */ __webpack_exports__["a"] = synthView;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = makeBiquadFilter;
function makeBiquadFilter({context, cutoff}){
  if (cutoff === undefined) cutoff = 22;
  let filter = context.createBiquadFilter();
  filter.type = 'lowshelf';
  let input = filter,
      output = filter,
      frequency = filter.frequency;
      filter.frequency.value = cutoff * 1000;
      filter.gain.value = 20;

  return {
    filter,
    frequency,
    input,
    output,
    changeFilter(newFreq){
      this.filter.frequency.value = newFreq;
    },
    connect(node){
      if (node.hasOwnProperty('input')) {
        this.output.connect(node.input);
      } else {
        this.output.connect(node);
      }
    }
  };
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = makeLFO;
function makeLFO({context, frequency, gain}){
  let lfo = context.createOscillator(),
      input = lfo,
      output = lfo,
      lfoFrequency = lfo.frequency;
      lfoFrequency.value = frequency;
  return {
    lfo,
    lfoFrequency,
    input,
    output,
    connect(node){
      if (node.hasOwnProperty('input')) {
        output.connect(node.input);
      } else {
        output.connect(node);
      }
    }
  };
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = makeOscillator;
function makeOscillator({context, n, frequency, type, oct}){
  var oscillator = context.createOscillator();
  let input = oscillator,
      output = oscillator;
  return {
    oct,
    n,
    oscillator,
    frequency,
    type,
    start(){
      oscillator.type = this.type;
      oscillator.frequency.value = this.frequency * Math.pow(2, oct - 1);
      oscillator.start();
    },
    changeType(newType){
      oscillator.type = newType;
    },
    changeFrequency(freq){
      oscillator.frequency.value = freq;
    },
    changeOctave(octave){
      this.frequency = this.frequency * Math.pow(2, oct - 1);
    },

    input,
    output,
    connect(node){
      if (node.hasOwnProperty('input')) {
        output.connect(node.input);
      } else {
        output.connect(node);
      }
    }
  };
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = makeSynth;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__voice_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__envelope_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__amp_js__ = __webpack_require__(0);




function makeSynth(){
  var context = new AudioContext();
  var compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 12;
  compressor.attack.value = .25;
  compressor.release.value = 0.25;
  var volume = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__amp_js__["a" /* default */])({context});

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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__voice_js__["a" /* makeVoice */])({
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


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__synth_view_js__ = __webpack_require__(2);


window.synthView = __WEBPACK_IMPORTED_MODULE_0__synth_view_js__["a" /* synthView */];
window.synth = __WEBPACK_IMPORTED_MODULE_0__synth_view_js__["a" /* synthView */].synth;
window.envelope = window.synth.envelope;
document.addEventListener('DOMContentLoaded', function(){
  __WEBPACK_IMPORTED_MODULE_0__synth_view_js__["a" /* synthView */].start();
});


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = makeVoice;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__oscillator_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__amp_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__envelope_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__biquadfilter_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lfo_js__ = __webpack_require__(4);








function makeVoice({
  context, n, frequency, volume, type1, type2, vol1, vol2, oct1, oct2,
    cutoff1, cutoff2, res1, res2}){
  return {
    frequency,
    context,
    lfo: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lfo_js__["a" /* default */])({context, frequency: 20}),
    lfoGain: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__amp_js__["a" /* default */])({context, vol: 20}),
    oscillator1: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__oscillator_js__["a" /* default */])({context, n, frequency, oct: oct1, type: type1}),
    oscillator2: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__oscillator_js__["a" /* default */])({context, n, frequency, oct: oct2, type: type2}),
    amp1: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__amp_js__["a" /* default */])({context, vol: vol1}),
    amp2: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__amp_js__["a" /* default */])({context, vol: vol2}),
    envelope1: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__envelope_js__["a" /* default */])({context}),
    envelope2: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__envelope_js__["a" /* default */])({context}),
    filter1: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__biquadfilter_js__["a" /* default */])({context, cutoff: cutoff1, res: res1}),
    filter2: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__biquadfilter_js__["a" /* default */])({context, cutoff: cutoff2, res: res2}),
    connect(){
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.oscillator1.oscillator.frequency);
      this.lfoGain.connect(this.oscillator2.oscillator.frequency);

      this.envelope1.connect(this.amp1.amplitude);
      this.envelope2.connect(this.amp2.amplitude);

      this.oscillator1.connect(this.amp1);
      this.oscillator2.connect(this.amp2);

      this.amp1.connect(this.filter1);
      this.amp2.connect(this.filter2);

      this.filter1.connect(volume);
      this.filter2.connect(volume);

    },

    changeFrequency(freq){
      this.oscillator1.changeFrequency(freq);
      this.oscillator2.changeFrequency(freq);
    },

    start(envelope){
      this.envelope1.envOn(envelope.attack, envelope.decay,
          envelope.sustain, this.amp1.amplitude.value);
      this.envelope2.envOn(envelope.attack, envelope.decay,
          envelope.sustain, this.amp2.amplitude.value);

      this.lfo.lfo.start();
      this.oscillator1.start();
      this.oscillator2.start();

    },
    stop(releaseTime){
      this.envelope1.envOff(releaseTime);
      this.envelope2.envOff(releaseTime);
      setTimeout(() => {
        this.oscillator1.oscillator.disconnect(this.amp1.gain);
        this.oscillator2.oscillator.disconnect(this.amp2.gain);

        this.amp1.gain.disconnect(this.filter1.filter);
        this.amp2.gain.disconnect(this.filter2.filter);

        this.filter1.filter.disconnect(volume.gain);
        this.filter2.filter.disconnect(volume.gain);
      }, releaseTime * 1000);
    }
  };
}


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map