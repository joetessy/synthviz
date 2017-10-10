import makeSynth from './synth.js';

export const synthView = {
  synth: makeSynth(),
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
  setUpKnobs(){
    $(".attack").knob({
        'release': function(v){
          jQuery.event.trigger('setAttack', v / 100);
        }
    });
    $(".decay").knob({
        'release' : function (v) {
          jQuery.event.trigger('setDecay', v / 100);
        }
    });
    $(".sustain").knob({
        'release' : function (v) {
          jQuery.event.trigger('setSustain', v / 100);
        }
    });
    $(".release").knob({
        'release' : function (v) {
          jQuery.event.trigger('setRelease', v / 100);
        }
    });
  },
  start(){
    let keys = this.keys;
    this.setUpKnobs();


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
        this.synth.stop(n);
      }

    });
    let synth = this.synth;

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
      this.synth.envelope.release = value;
    }.bind(this));

    this.synth.volume.connect(this.synth.context.destination);

  },
};
