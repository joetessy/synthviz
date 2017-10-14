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
  if (vol === undefined) vol = .1;
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
      console.log('amplitude is ' + amplitude);
      console.log('sustainVal is ' + sustainVal);
      console.log('amp * sustain is ' + amplitude * sustainVal);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = makeLFO;
function makeLFO({context, frequency}){
  let lfo = context.createOscillator(),
      input = lfo,
      output = lfo;
      let lfoFrequency = lfo.frequency;
      lfo.frequency.value = frequency;

  return {
    lfo,
    lfoFrequency,
    input,
    output,
    changeFrequency(newFrequency){
      this.lfoFrequency.value = newFrequency;      
    },
    connect(node){
      if (node.hasOwnProperty('input')) {
        output.connect(node.input);
      } else {
        output.connect(node);
      }
    },
    start(){
      lfo.start();
    }
  };
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__synth_js__ = __webpack_require__(6);

  var synth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__synth_js__["a" /* default */])();

const synthView = {
  synth,
  inc: 0,
  ctx: document.querySelector('#canvas').getContext('2d'),
  lastTime: 0,
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
  animate(time){
    const timeDelta = time - this.lastTime;
    this.synth.draw(this.ctx);
    this.lastTime = time;
    requestAnimationFrame(this.animate.bind(this));
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

  setUpKnobs(){
    let that = this;
    $(".knob").knob({
        'release': function(v){
          switch(this.$[0].dataset.action){
            case 'tremolo-speed':
              that.synth.changeLFO(v, 'speed', 'tremolo');
              break;
            case 'tremolo-depth':
              that.synth.changeLFO(v, 'depth', 'tremolo');
              break;
            case 'vibrato-speed':
              that.synth.changeLFO(v, 'speed', 'vibrato');
              break;
            case 'vibrato-depth':
              that.synth.changeLFO(v, 'depth', 'vibrato');
              break;
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
              jQuery.event.trigger('setSustain', (v / 100));
              break;
            case 'release':
              jQuery.event.trigger('setRelease', 2 * v / 100);
              break;
            case 'oscVolume':
              if (this.$[0].dataset.osc === '1'){
                that.synth.changeOscVolume(v/1000, 1);
              } else {
                that.synth.changeOscVolume(v/1000, 2);
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
  clearActivePreset(){
    let presets = document.querySelectorAll('.preset');
    presets.forEach((preset) => {
      if (Array.from(preset.classList).includes('active')){
        preset.classList.remove('active');
      }
    });
  },

  setUpPresets(){
    let presets = document.querySelectorAll('.preset');
    presets.forEach((preset) => {
      preset.addEventListener('click', function(){
        switch (preset.innerHTML){
          case '1':
            this.setPreset(0,7,55,10,50,1,9.18,18,4,12.91,6,5,0,0,'sine', 'sine');
          break;
          case '2':
            this.setPreset(32,7,55,10,50,1,16.74,88,3,12.89,3.5,6,6,76,'sawtooth', 'triangle');
          break;
          case '3':
            this.setPreset(0,7,55,10,50,1,9.18,88,2,12.91,2,2,8.5,84,'triangle', 'triangle');
          break;
          case '4':
            this.setPreset(0,5,0,10,50,1,9.18,88,3,18.88,0,0,0,0,'sawtooth','triangle');
          break;
          case '5':
            this.setPreset(24,0,100,10,50,1,6.62,88,3,11.83,3.5,2,1.5,45,'square', 'sawtooth');
          break;
        }
        this.clearActivePreset();
        preset.classList.add('active');
      }.bind(this));
    });
  },

  setPreset(attack, decay, sustain, release, osc1vol, osc1oct, osc1cutoff,
    osc2vol, osc2oct, osc2cutoff, vibratoSpeed, vibratoDepth,
     tremoloSpeed, tremoloDepth, osc1type, osc2type){
       $('.knob[data-action="attack"]').val(attack).trigger('change');
       $('.knob[data-action="decay"]').val(decay).trigger('change');
       $('.knob[data-action="sustain"]').val(sustain).trigger('change');
       $('.knob[data-action="release"]').val(release).trigger('change');
       $('.knob[data-action="oscVolume"].knob[data-osc="1"]').val(osc1vol).trigger('change');
       $('.knob[data-action="oscVolume"].knob[data-osc="2"]').val(osc2vol).trigger('change');
       $('.knob[data-action="octave"].knob[data-osc="1"]').val(osc1oct).trigger('change');
       $('.knob[data-action="octave"].knob[data-osc="2"]').val(osc2oct).trigger('change');
       $('.knob[data-action="cutoff"].knob[data-osc="1"]').val(osc1cutoff).trigger('change');
       $('.knob[data-action="cutoff"].knob[data-osc="1"]').val(osc2cutoff).trigger('change');
       $('.knob[data-action="tremolo-speed"]').val(tremoloSpeed).trigger('change');
       $('.knob[data-action="tremolo-depth"]').val(tremoloDepth).trigger('change');
       $('.knob[data-action="vibrato-speed"]').val(vibratoSpeed).trigger('change');
       $('.knob[data-action="vibrato-depth"]').val(vibratoDepth).trigger('change');
       document.querySelector(`.osctype[data-type=${osc1type}].osctype[data-osc="1"]`).click();
       document.querySelector(`.osctype[data-type=${osc2type}].osctype[data-osc="2"]`).click();
  },
  start(){
    let keys = this.keys;
    this.setUpPresets();
    this.setUpKnobs();
    this.setUpOscillatorTypes();
    this.animate();
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


    this.synth.tremoloLfo.connect(this.synth.tremoloAmp);
    this.synth.tremoloAmp.connect(this.synth.volume.gain.gain);


    this.synth.volume.connect(this.synth.context.destination);

    // this.synth.volume.connect(this.synth.compressor);
    // this.synth.compressor.connect(this.synth.context.destination);
    this.synth.tremoloLfo.start();

  },
};
/* harmony export (immutable) */ __webpack_exports__["a"] = synthView;



/***/ }),
/* 4 */
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lfo_js__ = __webpack_require__(2);




let WIDTH = document.querySelector('#canvas').width;
let HEIGHT = document.querySelector('#canvas').height;

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
    tremoloAmp: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__amp_js__["a" /* default */])({context, vol: 0}),
    tremoloLfo: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lfo_js__["a" /* default */])({context, frequency: 0}),
    vibratoSpeed: 0,
    vibratoDepth: 0,
    tremoloSpeed: 0,
    tremoloDepth: 0,
    osc1type: 'sine',
    osc2type: 'sine',
    osc1cutoff: 22,
    osc2cutoff: 22,
    osc1vol: 0.05,
    osc2vol: 0.025,
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__voice_js__["a" /* makeVoice */])({
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


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__synth_view_js__ = __webpack_require__(3);


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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__biquadfilter_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lfo_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__waveform_js__ = __webpack_require__(9);








function makeVoice({
  context, n, frequency, volume, type1, type2, vol1, vol2, oct1, oct2,
    cutoff1, cutoff2, res1, res2, vibratoSpeed, vibratoDepth}){
  return {
    frequency,
    context,
    n,
    lfoVibrato: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lfo_js__["a" /* default */])({context, frequency: vibratoSpeed}),
    analyser: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__waveform_js__["a" /* default */])({context, frequency}),
    lfoVibratoAmp: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__amp_js__["a" /* default */])({context, vol: vibratoDepth}),
    oscillator1: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__oscillator_js__["a" /* default */])({context, n, frequency, oct: oct1, type: type1}),
    oscillator2: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__oscillator_js__["a" /* default */])({context, n, frequency, oct: oct2, type: type2}),
    amp1: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__amp_js__["a" /* default */])({context, vol: vol1}),
    amp2: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__amp_js__["a" /* default */])({context, vol: vol2}),
    envelope1: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__envelope_js__["a" /* default */])({context}),
    envelope2: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__envelope_js__["a" /* default */])({context}),
    filter1: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__biquadfilter_js__["a" /* default */])({context, cutoff: cutoff1, res: res1}),
    filter2: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__biquadfilter_js__["a" /* default */])({context, cutoff: cutoff2, res: res2}),
    connect(){
      this.lfoVibrato.connect(this.lfoVibratoAmp);

      this.lfoVibratoAmp.connect(this.oscillator1.oscillator.frequency);
      this.lfoVibratoAmp.connect(this.oscillator2.oscillator.frequency);

      this.envelope1.connect(this.amp1.amplitude);
      this.envelope2.connect(this.amp2.amplitude);

      this.oscillator1.connect(this.amp1);
      this.oscillator2.connect(this.amp2);

      this.amp1.connect(this.filter1);
      this.amp2.connect(this.filter2);

      this.filter1.connect(this.analyser);
      this.filter2.connect(this.analyser);
      this.analyser.connect(volume);
      this.analyser.connect(volume);
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

      this.oscillator1.start();
      this.oscillator2.start();
      this.lfoVibrato.start();

    },
    stop(releaseTime){
      this.envelope1.envOff(releaseTime);
      this.envelope2.envOff(releaseTime);
      setTimeout(() => {
        this.lfoVibrato.lfo.disconnect(this.lfoVibratoAmp.gain);

        this.lfoVibratoAmp.gain.disconnect(this.oscillator1.oscillator.frequency);
        this.lfoVibratoAmp.gain.disconnect(this.oscillator2.oscillator.frequency);

        this.oscillator1.oscillator.disconnect(this.amp1.gain);
        this.oscillator2.oscillator.disconnect(this.amp2.gain);

        this.amp1.gain.disconnect(this.filter1.filter);
        this.amp2.gain.disconnect(this.filter2.filter);

        this.filter1.filter.disconnect(this.analyser.analyser);
        this.filter2.filter.disconnect(this.analyser.analyser);

        this.analyser.analyser.disconnect(volume);
        this.analyser.analyser.disconnect(volume);

      }, releaseTime * 1000);
    }
  };
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = makeWaveForm;
function makeWaveForm({context, frequency}){
  let drawVisual;
  let canvas = document.querySelector('#canvas');
  let analyser = context.createAnalyser();
    analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  let WIDTH = canvas.width;
  let HEIGHT = canvas.height;

  let input = analyser,
      output = analyser;

  function draw(ctx, freq){
    let color = 'blue';
    if (freq < 270){
      color = '#ff00f7';
    }else if (freq >= 270 && freq <= 300 ){
      color = '#ff00f7';
    } else if (freq > 300 && freq < 350){
      color = '#24ff00';
    } else if (freq >= 350 && freq <= 400){
      color = '#24ff00';
    } else if (freq > 400 && freq <= 500){
      color = '#f8ff00';
    } else if (freq > 500){
      color = '#f8ff00';
    }

    analyser.getByteTimeDomainData(dataArray);
    ctx.lineWidth = 1.8;

    ctx.strokeStyle = color;
    ctx.beginPath();
    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;
    for(var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT / 2;
      if(i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();
  }

  return {
    analyser,
    input,
    output,
    draw,

    connect(node){
      if (node.hasOwnProperty('input')) {
        this.output.connect(node.input);
      } else {
        this.output.connect(node);
      }
    }
  };
}


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map