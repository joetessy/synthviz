export default function makeOscillator({context, frequency, type}){
  var oscillator = context.createOscillator();
  let input = oscillator,
      output = oscillator;
  return {
    oscillator,
    frequency,
    type,
    start(){
      oscillator.type = this.type;
      oscillator.frequency.value = this.frequency;
      oscillator.start();
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
