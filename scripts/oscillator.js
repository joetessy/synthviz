export default function makeOscillator({context, frequency}){
  var oscillator = context.createOscillator();
  let input = oscillator,
      output = oscillator;
  return {
    oscillator,
    frequency,
    start(){
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
