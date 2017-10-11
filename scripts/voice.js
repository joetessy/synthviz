import oscillator from './oscillator.js';
import amp from './amp.js';
import makeEnvelope from './envelope.js';


export function makeVoice({context, frequency, volume, type}){
  return {
    frequency,
    context,
    oscillator: oscillator({context, frequency, type}),
    amp: amp({context}),
    envelope: makeEnvelope({context}),
    connect(){
      this.oscillator.connect(this.amp);
      this.envelope.connect(this.amp.amplitude);
      this.amp.connect(volume);
    },
    start(envelope){
      this.envelope.envOn(envelope.attack, envelope.decay, envelope.sustain);
      this.oscillator.start();
    },
    stop(releaseTime){
      this.envelope.envOff(releaseTime);
    }
  };
}
