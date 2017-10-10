export function makeVoice({context, frequency}){
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
