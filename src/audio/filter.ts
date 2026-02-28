import type { FilterWrapper, AudioWrapper } from '../types'

const makeFilter = (context: AudioContext, cutoff = 22): FilterWrapper => {
  const filter = context.createBiquadFilter()
  filter.type = 'lowshelf'
  filter.frequency.value = cutoff * 1000
  filter.gain.value = 20
  return {
    filter,
    frequency: filter.frequency,
    input: filter,
    output: filter,
    changeFilter: (newFreq: number) => { filter.frequency.value = newFreq * 1000 },
    connect: (node: AudioWrapper | AudioNode | AudioParam) => {
      if ('input' in node) filter.connect(node.input as AudioNode)
      else if (node instanceof AudioParam) filter.connect(node)
      else filter.connect(node as AudioNode)
    }
  }
}

export default makeFilter
