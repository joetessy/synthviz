import oscillator from './oscillator.js';
import amp from './amp.js';


export function makeVoice({context, frequency, volume}){
  return {
    frequency,
    context,
    oscillator: oscillator({context, frequency}),
    amp: amp({context}),
    connect(){
      this.oscillator.connect(this.amp);
      this.amp.connect(volume);
    },
    start(){
      this.oscillator.start();
    },
    stop(){
      this.amp.amplitude.value = 0;
    }
  };
}
