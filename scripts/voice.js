import oscillator from './oscillator.js';
import amp from './amp.js';
import makeEnvelope from './envelope.js';


export function makeVoice({
  context, frequency, volume, type1, type2, vol1, vol2, oct1, oct2}){
  return {
    frequency,
    context,
    oscillator1: oscillator({context, frequency, oct: oct1, type: type1}),
    oscillator2: oscillator({context, frequency, oct: oct2, type: type2}),
    amp1: amp({context, vol: vol1}),
    amp2: amp({context, vol: vol2}),
    envelope1: makeEnvelope({context}),
    envelope2: makeEnvelope({context}),
    connect(){
      this.oscillator1.connect(this.amp1);
      this.oscillator2.connect(this.amp2);

      this.envelope1.connect(this.amp1.amplitude);
      this.envelope2.connect(this.amp2.amplitude);

      this.amp1.connect(volume);
      this.amp2.connect(volume);
    },
    start(envelope){
      this.envelope1.envOn(envelope.attack, envelope.decay,
          envelope.sustain, this.amp1.amplitude.value);
      this.envelope2.envOn(envelope.attack, envelope.decay,
          envelope.sustain, this.amp2.amplitude.value);

      this.oscillator1.start();
      this.oscillator2.start();

    },
    stop(releaseTime){
      this.envelope1.envOff(releaseTime);
      this.envelope2.envOff(releaseTime);
    }
  };
}
