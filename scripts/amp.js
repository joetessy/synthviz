export default function makeAmp({context}){
  let gain = context.createGain();
  let input = gain,
      output = gain,
      amplitude = gain.gain;
  gain.gain.value = 0.5;
  return {
    gain,
    input,
    output,
    amplitude,
    connect(node){
      if (node.hasOwnProperty('input')) {
        this.output.connect(node.input);
      } else {
        this.output.connect(node);
      }
    }
  };
}
