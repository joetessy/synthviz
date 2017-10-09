export default function makeSynth(){
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
