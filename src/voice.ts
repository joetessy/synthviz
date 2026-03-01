import makeOscillator from './audio/oscillator'
import makeAmp from './audio/amp'
import makeEnvelope from './audio/envelope'
import makeFilter from './audio/filter'
import makeLFO from './audio/lfo'
import makeAnalyser from './audio/analyser'
import type { Voice, Envelope, AmpWrapper } from './types'

const makeVoice = (
  context: AudioContext,
  n: number,
  frequency: number,
  volume: AmpWrapper,
  type1: OscillatorType,
  type2: OscillatorType,
  vol1: number,
  vol2: number,
  oct1: number,
  oct2: number,
  cutoff1: number,
  cutoff2: number,
  vibratoSpeed: number,
  vibratoDepth: number,
  glideFrom: number,
  glideTime: number
): Voice => {
  const lfoVibrato = makeLFO(context, vibratoSpeed)
  const analyser = makeAnalyser(context, frequency)
  const lfoVibratoAmp = makeAmp(context, vibratoDepth)
  const oscillator1 = makeOscillator(context, n, frequency, type1, oct1)
  const oscillator2 = makeOscillator(context, n, frequency, type2, oct2)
  const amp1 = makeAmp(context, vol1)
  const amp2 = makeAmp(context, vol2)
  const envelope1 = makeEnvelope(context)
  const envelope2 = makeEnvelope(context)
  const filter1 = makeFilter(context, cutoff1)
  const filter2 = makeFilter(context, cutoff2)

  return {
    id: Math.random(),
    frequency,
    context,
    n,
    volume,
    lfoVibrato,
    analyser,
    lfoVibratoAmp,
    oscillator1,
    oscillator2,
    amp1,
    amp2,
    envelope1,
    envelope2,
    filter1,
    filter2,
    connect: () => {
      lfoVibrato.connect(lfoVibratoAmp)
      lfoVibratoAmp.connect(oscillator1.oscillator.frequency)
      lfoVibratoAmp.connect(oscillator2.oscillator.frequency)
      envelope1.connect(amp1.amplitude)
      envelope2.connect(amp2.amplitude)
      oscillator1.connect(amp1)
      oscillator2.connect(amp2)
      amp1.connect(filter1)
      amp2.connect(filter2)
      filter1.connect(analyser)
      filter2.connect(analyser)
      analyser.connect(volume)
    },
    changeFrequency: (freq: number) => {
      oscillator1.changeFrequency(freq)
      oscillator2.changeFrequency(freq)
    },
    start: (envelope: Envelope) => {
      amp1.amplitude.value = 0
      amp2.amplitude.value = 0
      envelope1.envOn(envelope.attack, envelope.decay, envelope.sustain, vol1)
      envelope2.envOn(envelope.attack, envelope.decay, envelope.sustain, vol2)
      oscillator1.start()
      oscillator2.start()
      lfoVibrato.start()
      if (glideTime > 0 && glideFrom > 0) {
        const now = context.currentTime
        const target1 = frequency * Math.pow(2, oscillator1.oct - 1)
        const from1 = glideFrom * Math.pow(2, oscillator1.oct - 1)
        oscillator1.oscillator.frequency.cancelScheduledValues(now)
        oscillator1.oscillator.frequency.setValueAtTime(from1, now)
        oscillator1.oscillator.frequency.exponentialRampToValueAtTime(target1, now + glideTime)
        const target2 = frequency * Math.pow(2, oscillator2.oct - 1)
        const from2 = glideFrom * Math.pow(2, oscillator2.oct - 1)
        oscillator2.oscillator.frequency.cancelScheduledValues(now)
        oscillator2.oscillator.frequency.setValueAtTime(from2, now)
        oscillator2.oscillator.frequency.exponentialRampToValueAtTime(target2, now + glideTime)
      }
    },
    retrigger: (frequency: number, glideTime: number, envelope: Envelope) => {
      const now = context.currentTime
      const target1 = frequency * Math.pow(2, oscillator1.oct - 1)
      const target2 = frequency * Math.pow(2, oscillator2.oct - 1)
      if (glideTime > 0) {
        oscillator1.oscillator.frequency.cancelScheduledValues(now)
        oscillator1.oscillator.frequency.setValueAtTime(oscillator1.oscillator.frequency.value, now)
        oscillator1.oscillator.frequency.exponentialRampToValueAtTime(target1, now + glideTime)
        oscillator2.oscillator.frequency.cancelScheduledValues(now)
        oscillator2.oscillator.frequency.setValueAtTime(oscillator2.oscillator.frequency.value, now)
        oscillator2.oscillator.frequency.exponentialRampToValueAtTime(target2, now + glideTime)
      } else {
        oscillator1.oscillator.frequency.cancelScheduledValues(now)
        oscillator1.oscillator.frequency.setValueAtTime(target1, now)
        oscillator2.oscillator.frequency.cancelScheduledValues(now)
        oscillator2.oscillator.frequency.setValueAtTime(target2, now)
        envelope1.envOn(envelope.attack, envelope.decay, envelope.sustain, vol1)
        envelope2.envOn(envelope.attack, envelope.decay, envelope.sustain, vol2)
      }
    },
    stop: (releaseTime: number) => {
      envelope1.envOff(releaseTime)
      envelope2.envOff(releaseTime)
      setTimeout(() => {
        oscillator1.oscillator.stop()
        oscillator2.oscillator.stop()
        lfoVibrato.lfo.disconnect(lfoVibratoAmp.gain)
        lfoVibratoAmp.gain.disconnect(oscillator1.oscillator.frequency)
        lfoVibratoAmp.gain.disconnect(oscillator2.oscillator.frequency)
        oscillator1.oscillator.disconnect(amp1.gain)
        oscillator2.oscillator.disconnect(amp2.gain)
        amp1.gain.disconnect(filter1.filter)
        amp2.gain.disconnect(filter2.filter)
        filter1.filter.disconnect(analyser.analyser)
        filter2.filter.disconnect(analyser.analyser)
        analyser.analyser.disconnect(volume.gain)
      }, releaseTime * 1000)
    }
  }
}

export default makeVoice
