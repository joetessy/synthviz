export default function makeLFO({context, frequency, gain}){
  let lfo = context.createOscillator(),
      input = lfo,
      output = lfo,
      lfoFrequency = lfo.frequency;
      lfoFrequency.value = frequency;
  return {
    lfo,
    lfoFrequency,
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
