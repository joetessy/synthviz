export default function makeAmp({context, vol}){
  let gain = context.createGain();
  if (vol === undefined) vol = 0.5;
  let input = gain,
      output = gain,
      amplitude = gain.gain;
      amplitude.value = vol;

  return {
    gain,
    input,
    output,
    amplitude,
    changeAmplitude(newAmplitude){
      this.amplitude.value = newAmplitude;
    },
    connect(node){
      if (node.hasOwnProperty('input')) {
        this.output.connect(node.input);
      } else {
        this.output.connect(node);
      }
    }
  };
}
