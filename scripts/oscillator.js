export default function makeOscillator({context, n, frequency, type, oct}){
  var oscillator = context.createOscillator();
  let input = oscillator,
      output = oscillator;
  return {
    oct,
    n,
    oscillator,
    frequency,
    type,
    start(){
      oscillator.type = this.type;
      oscillator.frequency.value = this.frequency * Math.pow(2, oct - 1);
      oscillator.start();
    },
    changeType(newType){
      oscillator.type = newType;
    },
    changeFrequency(freq){
      oscillator.frequency.value = freq;
    },
    changeOctave(octave){
      this.frequency = this.frequency * Math.pow(2, oct - 1);
    },

    input,
    output,
    connect(node){
      if (node.hasOwnProperty('input')) {
        output.connect(node.input);
      } else {
        output.connect(node);
      }
    }
  };
}
