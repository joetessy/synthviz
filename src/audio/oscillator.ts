import type { OscillatorWrapper, AudioWrapper } from '../types'

const makeOscillator = (
  context: AudioContext,
  n: number,
  frequency: number,
  type: OscillatorType,
  oct: number
): OscillatorWrapper => {
  const oscillator = context.createOscillator()
  const wrapper: OscillatorWrapper = {
    oct,
    n,
    oscillator,
    frequency,
    type,
    input: oscillator,
    output: oscillator,
    start: () => {
      oscillator.type = type
      oscillator.frequency.value = wrapper.frequency * Math.pow(2, oct - 1)
      oscillator.start()
    },
    changeType: (newType: OscillatorType) => { oscillator.type = newType },
    changeFrequency: (freq: number) => { oscillator.frequency.value = freq },
    changeOctave: (octave: number) => {
      wrapper.oct = octave
      oscillator.frequency.value = wrapper.frequency * Math.pow(2, octave - 1)
    },
    connect: (node: AudioWrapper | AudioNode | AudioParam) => {
      if ('input' in node) oscillator.connect(node.input as AudioNode)
      else if (node instanceof AudioParam) oscillator.connect(node)
      else oscillator.connect(node as AudioNode)
    }
  }
  return wrapper
}

export default makeOscillator
