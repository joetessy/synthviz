import type { VCFWrapper, AudioWrapper } from '../types'

const makeVCF = (context: AudioContext, cutoff = 20000, resonance = 1): VCFWrapper => {
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = cutoff
  filter.Q.value = resonance
  return {
    filter,
    cutoffParam: filter.frequency,
    input: filter,
    output: filter,
    changeCutoff: (freqHz: number) => { filter.frequency.value = freqHz },
    changeResonance: (q: number) => { filter.Q.value = q },
    connect: (node: AudioWrapper | AudioNode | AudioParam) => {
      if ('input' in node) filter.connect(node.input as AudioNode)
      else if (node instanceof AudioParam) filter.connect(node)
      else filter.connect(node as AudioNode)
    }
  }
}

export default makeVCF
