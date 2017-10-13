export default function makeLFO({context, frequency}){
  let lfo = context.createOscillator(),
      input = lfo,
      output = lfo;
      let lfoFrequency = lfo.frequency;
      lfo.frequency.value = frequency;

  return {
    lfo,
    lfoFrequency,
    input,
    output,
    changeFrequency(newFrequency){
      this.lfoFrequency.value = newFrequency;      
    },
    connect(node){
      if (node.hasOwnProperty('input')) {
        output.connect(node.input);
      } else {
        output.connect(node);
      }
    },
    start(){
      lfo.start();
    }
  };
}
