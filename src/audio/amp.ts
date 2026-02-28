import type { AmpWrapper, AudioWrapper } from '../types'

const makeAmp = (context: AudioContext, vol = 0.1): AmpWrapper => {
  const gain = context.createGain()
  const amplitude = gain.gain
  amplitude.value = vol
  return {
    gain,
    input: gain,
    output: gain,
    amplitude,
    changeAmplitude: (v: number) => { amplitude.value = v },
    connect: (node: AudioWrapper | AudioNode | AudioParam) => {
      if ('input' in node) gain.connect(node.input as AudioNode)
      else if (node instanceof AudioParam) gain.connect(node)
      else gain.connect(node as AudioNode)
    }
  }
}

export default makeAmp
