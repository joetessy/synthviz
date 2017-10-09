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
    65: { n: 40 },
    87: { n: 41 },
    83: { n: 42 },
    69: { n: 43 },
    68: { n: 44 },
    70: { n: 45 },
    84: { n: 46 },
    71: { n: 47 },
    89: { n: 48 },
    72: { n: 49 },
    85: { n: 50 },
    74: { n: 51 },
    75: { n: 52 },
    79: { n: 53 },
    76: { n: 54 },
    80: { n: 55 },
  },

  start(){
    document.addEventListener('keydown', e => {
      if (this.keys[e.keyCode]) {
        let key = e.keyCode;
        let n = this.keys[key].n;
        this.synth.createVoice(n);
      }
    });

    document.addEventListener('keyup', e => {
      if (this.keys[e.keyCode]) {
        let key = e.keyCode;
        let n = this.keys[key].n;
        this.synth.activeVoices[n].stop();
        delete this.synth.activeVoices[n];
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
function makeSynth(){
  var context = new AudioContext();

  return {
    context,
    activeVoices: {},
    createVoice(n){
      this.activeVoices[n] = this.context.createOscillator();
      this.activeVoices[n].frequency.value = this.calculateFrequency(n);
      this.activeVoices[n].connect(this.context.destination);
      this.start(n);
    },
    start(n){
      this.activeVoices[n].start();
    },
    stop(n){
      this.activeVoices[n].stop(this.context.currentTime + 1);
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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map