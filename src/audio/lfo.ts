import type { LFOWrapper, AudioWrapper } from '../types'

const makeLFO = (context: AudioContext, frequency: number): LFOWrapper => {
  const lfo = context.createOscillator()
  const lfoFrequency = lfo.frequency
  lfo.frequency.value = frequency
  return {
    lfo,
    lfoFrequency,
    input: lfo,
    output: lfo,
    changeFrequency: (newFrequency: number) => { lfoFrequency.value = newFrequency },
    connect: (node: AudioWrapper | AudioNode | AudioParam) => {
      if ('input' in node) lfo.connect(node.input as AudioNode)
      else if (node instanceof AudioParam) lfo.connect(node)
      else lfo.connect(node as AudioNode)
    },
    start: () => { lfo.start() }
  }
}

export default makeLFO
