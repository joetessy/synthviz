export interface Envelope {
  attack: number
  decay: number
  sustain: number
  release: number
}

export interface AudioWrapper {
  input: AudioNode
  output: AudioNode
  connect: (node: AudioWrapper | AudioNode | AudioParam) => void
}

export interface AmpWrapper extends AudioWrapper {
  gain: GainNode
  amplitude: AudioParam
  changeAmplitude: (v: number) => void
}

export interface LFOWrapper extends AudioWrapper {
  lfo: OscillatorNode
  lfoFrequency: AudioParam
  changeFrequency: (v: number) => void
  start: () => void
}

export interface OscillatorWrapper extends AudioWrapper {
  oct: number
  n: number
  oscillator: OscillatorNode
  frequency: number
  type: OscillatorType
  start: () => void
  changeType: (type: OscillatorType) => void
  changeFrequency: (freq: number) => void
  changeOctave: (octave: number) => void
}

export interface FilterWrapper extends AudioWrapper {
  filter: BiquadFilterNode
  frequency: AudioParam
  changeFilter: (freq: number) => void
}

export interface EnvelopeController {
  envOn: (attack: number, decay: number, sustain: number, amplitude: number) => void
  envOff: (releaseTime: number) => void
  connect: (param: AudioParam) => void
}

export interface AnalyserWrapper extends AudioWrapper {
  analyser: AnalyserNode
  draw: (ctx: CanvasRenderingContext2D, freq: number) => void
}

export interface Voice {
  frequency: number
  context: AudioContext
  n: number
  volume: AmpWrapper
  lfoVibrato: LFOWrapper
  analyser: AnalyserWrapper
  lfoVibratoAmp: AmpWrapper
  oscillator1: OscillatorWrapper
  oscillator2: OscillatorWrapper
  amp1: AmpWrapper
  amp2: AmpWrapper
  envelope1: EnvelopeController
  envelope2: EnvelopeController
  filter1: FilterWrapper
  filter2: FilterWrapper
  connect: () => void
  changeFrequency: (freq: number) => void
  start: (envelope: Envelope) => void
  stop: (releaseTime: number) => void
}

export interface Synth {
  context: AudioContext
  activeVoices: Record<number, Voice>
  destination: AudioDestinationNode
  volume: AmpWrapper
  compressor: DynamicsCompressorNode
  tremoloAmp: AmpWrapper
  tremoloLfo: LFOWrapper
  vibratoSpeed: number
  vibratoDepth: number
  tremoloSpeed: number
  tremoloDepth: number
  osc1type: OscillatorType
  osc2type: OscillatorType
  osc1cutoff: number
  osc2cutoff: number
  osc1vol: number
  osc2vol: number
  osc1oct: number
  osc2oct: number
  osc1res?: number
  osc2res?: number
  envelope: Envelope
  start: (key: KeyInfo) => void
  draw: (ctx: CanvasRenderingContext2D) => void
  updateFrequencies: (diff: number) => void
  changeLFO: (value: number, control: string, type: string) => void
  changeOscVolume: (vol: number, osc: number) => void
  changeOctave: (octave: number, osc: number) => void
  changeCutoff: (freq: number, res: number | undefined, osc: number) => void
  changeType: (type: OscillatorType, osc: string) => void
  stop: (n: number) => void
  handleOctaveChange: (n: number) => number
  calculateFrequency: (n: number) => number
}

export interface KeyInfo {
  down: boolean
  n: number
  type?: string
  dir?: string
  incremented?: boolean
  origin?: number
  action: (info: KeyInfo) => void
}

export interface PresetParams {
  attack: number; decay: number; sustain: number; release: number
  osc1vol: number; osc1oct: number; osc1cutoff: number
  osc2vol: number; osc2oct: number; osc2cutoff: number
  vibratoSpeed: number; vibratoDepth: number
  tremoloSpeed: number; tremoloDepth: number
  osc1type: OscillatorType; osc2type: OscillatorType
}

export interface PresetData {
  id: string
  name: string
  isBuiltIn: boolean
  params: PresetParams
}
