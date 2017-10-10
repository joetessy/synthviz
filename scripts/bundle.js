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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__synth_js__ = __webpack_require__(1);


const synthView = {
  synth: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__synth_js__["a" /* default */])(),
  keys: {
    65: { down: false, n: 40, action: (n) => synthView.synth.start(n) },
    87: { down: false, n: 41, action: (n) => synthView.synth.start(n) },
    83: { down: false, n: 42, action: (n) => synthView.synth.start(n) },
    69: { down: false, n: 43, action: (n) => synthView.synth.start(n) },
    68: { down: false, n: 44, action: (n) => synthView.synth.start(n) },
    70: { down: false, n: 45, action: (n) => synthView.synth.start(n) },
    84: { down: false, n: 46, action: (n) => synthView.synth.start(n) },
    71: { down: false, n: 47, action: (n) => synthView.synth.start(n) },
    89: { down: false, n: 48, action: (n) => synthView.synth.start(n) },
    72: { down: false, n: 49, action: (n) => synthView.synth.start(n) },
    85: { down: false, n: 50, action: (n) => synthView.synth.start(n) },
    74: { down: false, n: 51, action: (n) => synthView.synth.start(n) },
    75: { down: false, n: 52, action: (n) => synthView.synth.start(n) },
    79: { down: false, n: 53, action: (n) => synthView.synth.start(n) },
    76: { down: false, n: 54, action: (n) => synthView.synth.start(n) },
    80: { down: false, n: 55, action: (n) => synthView.synth.start(n) },
    90: { down: false, type: 'octave', dir: 'down',
      action: (n) => synthView.octave(n) },
    88: { down: false, type: 'octave', dir: 'up',
      action: (n) => synthView.octave(n) }
  },
  octave(obj){
    let codes = Object.keys(this.keys);
    for (let i = 0; i < codes.length; i++){
      if (obj.dir === 'up'){
        this.keys[codes[i]].n += 12;
      } else {
        this.keys[codes[i]].n -= 12;
      }
    }
  },
  start(){
    let keys = this.keys;
    document.addEventListener('keydown', e => {
      let keyInfo = keys[e.keyCode];
      if (keyInfo) {
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
        this.synth.stop(n);
      }
    });
  },
};
/* harmony export (immutable) */ __webpack_exports__["a"] = synthView;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = makeSynth;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__voice_js__ = __webpack_require__(3);


function makeSynth(){
  var context = new AudioContext();

  return {
    context,
    activeVoices: {},
    start(key){
      let n = key.n;
      let frequency = this.calculateFrequency(n);
      this.activeVoices[n] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__voice_js__["a" /* makeVoice */])({context, frequency});
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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__synth_view_js__ = __webpack_require__(0);


window.synthView = __WEBPACK_IMPORTED_MODULE_0__synth_view_js__["a" /* synthView */];
document.addEventListener('DOMContentLoaded', function(){
  __WEBPACK_IMPORTED_MODULE_0__synth_view_js__["a" /* synthView */].start();
});


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = makeVoice;
function makeVoice({context, frequency}){
  return {
    frequency,
    context,
    oscillator: context.createOscillator(),
    setFrequency(){
      this.oscillator.frequency.value = this.frequency;
    },
    connect(){
      this.gain = this.context.createGain();
      this.gain.gain.value = 0.3;
      this.oscillator.connect(this.gain);
      this.gain.connect(this.context.destination);
    },
    start(){
      this.oscillator.start();
    },
    stop(){
      this.gain.gain.value = 0;
    }
  };
}


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map