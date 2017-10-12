export default function makeBiquadFilter({context, cutoff}){
  if (cutoff === undefined) cutoff = 22;
  let filter = context.createBiquadFilter();
  filter.type = 'lowshelf';
  let input = filter,
      output = filter,
      frequency = filter.frequency;
      filter.frequency.value = cutoff * 1000;
      filter.gain.value = 20;

  return {
    filter,
    frequency,
    input,
    output,
    changeFilter(newFreq){
      this.filter.frequency.value = newFreq;
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
