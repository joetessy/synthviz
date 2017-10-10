export function makeVoice({context, frequency}){
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
