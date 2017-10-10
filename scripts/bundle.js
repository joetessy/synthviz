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
    90: { down: false },
    88: { down: false }
  },

  octave(direction){
    let codes = Object.keys(this.keys);
    for (let i = 0; i < codes.length; i++){
      if (direction === 'up'){
        this.keys[codes[i]].n += 12;
      } else {
        this.keys[codes[i]].n -= 12;
      }
    }
  },

  start(){
    document.addEventListener('keydown', e => {
      let key = e.keyCode;

      if (this.keys[key].down) return;
      this.keys[key].down = true;

      // Change Octave
      if (key === 90){
        this.octave('down');
        return;
      } else if (key === 88){
        this.octave('up');
        return;
      }


      if (this.keys[e.keyCode]) {
        let n = this.keys[key].n;
        this.synth.createVoice(n);
      }

    });

    document.addEventListener('keyup', e => {
      if (this.keys[e.keyCode]) {
        let key = e.keyCode;
        this.keys[key].down = false;
        if (key === 90 || key === 88){
          return;
        }

        let n = this.keys[key].n;
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
    createVoice(n){
      let frequency = this.calculateFrequency(n);
      this.activeVoices[n] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__voice_js__["a" /* makeVoice */])({context, frequency});
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
      this.oscillator.connect(this.context.destination);
    },
    start(){
      this.oscillator.start();
    },
    stop(){
      this.oscillator.stop();
    }
  };
}


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map