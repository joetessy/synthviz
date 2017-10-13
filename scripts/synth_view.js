import makeSynth from './synth.js';
  var synth = makeSynth();

export const synthView = {
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
              that.synth.changeLFO(v, 'dpeth', 'vibrato');
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




      // this.synth.envelope.attack = attack * 2 / 100;
      // this.synth.envelope.decay = decay * 3 / 100;
      // this.synth.envelope.sustain = sustain / 100;
      // this.synth.envelope.relase = release * 2 / 100;
      // this.synth.osc1vol = osc1vol / 200;
      // this.synth.osc2vol = osc2vol / 200;
      // this.synth.osc1oct = osc1oct;
      // this.synth.osc2oct = osc2oct;
      // this.synth.osc1cutoff = osc1cutoff;
      // this.synth.osc2cutoff = osc1cutoff;
      // this.synth.tremoloDepth = tremoloDepth;
      // this.synth.tremoloSpeed = tremoloSpeed;
      // this.synth.vibratoDepth = vibratoDepth;
      // this.synth.vibratoSpeed = vibratoSpeed;
      // this.synth.osc1type = osc1type;
      // this.synth.osc2type = osc2type;
  },
  start(){
    let keys = this.keys;
    this.setUpPresets();
    this.setUpKnobs();
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


    this.synth.tremoloLfo.connect(this.synth.tremoloAmp);
    this.synth.tremoloAmp.connect(this.synth.volume.gain.gain);

    this.synth.volume.connect(this.synth.compressor);
    this.synth.compressor.connect(this.synth.context.destination);
    this.synth.tremoloLfo.start();

  },
};
