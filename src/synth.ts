import makeVoice from './voice'
import makeAmp from './audio/amp'
import makeLFO from './audio/lfo'
import type { Synth, KeyInfo } from './types'

const makeSynth = (): Synth => {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement
  const context = new AudioContext()
  const compressor = context.createDynamicsCompressor()
  compressor.threshold.value = -45
  compressor.knee.value = 40
  compressor.ratio.value = 12
  compressor.attack.value = 0.25
  compressor.release.value = 0.25
  const volume = makeAmp(context)

  const synth: Synth = {
    context,
    activeVoices: {},
    destination: context.destination,
    volume,
    compressor,
    tremoloAmp: makeAmp(context, 0),
    tremoloLfo: makeLFO(context, 0),
    vibratoSpeed: 0,
    vibratoDepth: 0,
    tremoloSpeed: 0,
    tremoloDepth: 0,
    osc1type: 'sine',
    osc2type: 'sine',
    osc1cutoff: 22,
    osc2cutoff: 22,
    osc1vol: 0.0416,
    osc2vol: 0.0208,
    osc1oct: 1,
    osc2oct: 2,
    envelope: { attack: 0, decay: 0, sustain: 1, release: 0.5 },

    start: (key: KeyInfo) => {
      const n = key.n
      const frequency = synth.calculateFrequency(n)
      synth.activeVoices[n] = makeVoice(
        context, n, frequency, volume,
        synth.osc1type, synth.osc2type,
        synth.osc1vol, synth.osc2vol,
        synth.osc1oct, synth.osc2oct,
        synth.osc1cutoff, synth.osc2cutoff,
        synth.vibratoSpeed, synth.vibratoDepth
      )
      synth.activeVoices[n].connect()
      synth.activeVoices[n].start(synth.envelope)
    },

    draw: (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const voiceKeys = Object.keys(synth.activeVoices)
      voiceKeys.forEach((key) => {
        const voice = synth.activeVoices[Number(key)]
        voice.analyser.draw(ctx, voice.frequency)
      })
    },

    updateFrequencies: (diff: number) => {
      const voiceKeys = Object.keys(synth.activeVoices)
      for (let i = 0; i < voiceKeys.length; i++) {
        const voice = synth.activeVoices[Number(voiceKeys[i])]
        voice.n += diff
        const freq = synth.calculateFrequency(voice.n)
        voice.changeFrequency(freq)
      }
    },

    changeLFO: (value: number, control: string, type: string) => {
      if (type === 'vibrato') {
        if (control === 'speed') {
          synth.vibratoSpeed = value
        } else {
          synth.vibratoDepth = value
        }
      } else if (type === 'tremolo') {
        if (control === 'speed') {
          synth.tremoloSpeed = value
          synth.tremoloLfo.lfoFrequency.value = value
        } else {
          const v = value / 1000
          synth.tremoloDepth = v
          synth.tremoloAmp.gain.gain.value = v
        }
      }
      const voiceKeys = Object.keys(synth.activeVoices)
      for (let i = 0; i < voiceKeys.length; i++) {
        if (type === 'vibrato') {
          if (control === 'speed') {
            synth.activeVoices[Number(voiceKeys[i])].lfoVibrato.changeFrequency(synth.vibratoSpeed)
          } else {
            synth.activeVoices[Number(voiceKeys[i])].lfoVibratoAmp.changeAmplitude(synth.vibratoDepth)
          }
        }
      }
    },

    changeOscVolume: (vol: number, osc: number) => {
      if (osc === 1) {
        synth.osc1vol = vol
      } else {
        synth.osc2vol = vol
      }
      const voiceKeys = Object.keys(synth.activeVoices)
      for (let i = 0; i < voiceKeys.length; i++) {
        if (osc === 1) {
          synth.activeVoices[Number(voiceKeys[i])].amp1.changeAmplitude(synth.osc1vol)
        } else {
          synth.activeVoices[Number(voiceKeys[i])].amp2.changeAmplitude(synth.osc2vol)
        }
      }
    },

    changeOctave: (octave: number, osc: number) => {
      if (osc === 1) {
        synth.osc1oct = octave
      } else {
        synth.osc2oct = octave
      }
      const voiceKeys = Object.keys(synth.activeVoices)
      for (let i = 0; i < voiceKeys.length; i++) {
        if (osc === 1) {
          synth.activeVoices[Number(voiceKeys[i])].oscillator1.changeOctave(synth.osc1oct)
        } else {
          synth.activeVoices[Number(voiceKeys[i])].oscillator2.changeOctave(synth.osc2oct)
        }
      }
    },

    changeCutoff: (freq: number, _res: number | undefined, osc: number) => {
      if (osc === 1) {
        synth.osc1cutoff = freq
      } else {
        synth.osc2cutoff = freq
      }
      const voiceKeys = Object.keys(synth.activeVoices)
      for (let i = 0; i < voiceKeys.length; i++) {
        if (osc === 1) {
          synth.activeVoices[Number(voiceKeys[i])].filter1.changeFilter(freq)
        } else {
          synth.activeVoices[Number(voiceKeys[i])].filter2.changeFilter(freq)
        }
      }
    },

    changeType: (type: OscillatorType, osc: string) => {
      if (osc === '1') {
        synth.osc1type = type
      } else {
        synth.osc2type = type
      }
    },

    stop: (n: number) => {
      n = synth.handleOctaveChange(n)
      const voice = synth.activeVoices[n]
      voice.stop(synth.envelope.release)
      delete synth.activeVoices[n]
    },

    handleOctaveChange: (n: number) => {
      let order = 1
      while (!synth.activeVoices[n]) {
        const inc = 12
        if (synth.activeVoices[n + (inc * order)]) {
          n = n + (inc * order)
        } else if (synth.activeVoices[n - (inc * order)]) {
          n = n - (inc * order)
        }
        order += 1
      }
      return n
    },

    calculateFrequency: (n: number) => Math.pow(2, (n - 49) / 12) * 440
  }

  return synth
}

export default makeSynth
