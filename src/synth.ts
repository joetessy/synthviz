import makeVoice from './voice'
import makeAmp from './audio/amp'
import makeLFO from './audio/lfo'
import makeAnalyser from './audio/analyser'
import type { Synth, KeyInfo, Voice } from './types'

const makeSynth = (): Synth => {
  let monoVoice: Voice | null = null
  let heldKeys: number[] = []
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement
  const context = new AudioContext()
  const compressor = context.createDynamicsCompressor()
  compressor.threshold.value = -45
  compressor.knee.value = 40
  compressor.ratio.value = 12
  compressor.attack.value = 0.25
  compressor.release.value = 0.25
  const volume = makeAmp(context)
  const masterAnalyser = makeAnalyser(context, 440)
  const tremoloAmp = makeAmp(context, 0)
  const tremoloLfo = makeLFO(context, 0)

  // Signal chain: volume → masterAnalyser → compressor → destination
  volume.connect(masterAnalyser)
  masterAnalyser.connect(compressor)
  compressor.connect(context.destination)

  // Tremolo: tremoloLfo → tremoloAmp → volume.gain.gain
  tremoloLfo.connect(tremoloAmp)
  tremoloAmp.connect(volume.amplitude)
  tremoloLfo.start()

  const synth: Synth = {
    context,
    activeVoices: {},
    destination: context.destination,
    volume,
    compressor,
    masterAnalyser,
    tremoloAmp,
    tremoloLfo,
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
    glide: 0,
    lastFrequency: 0,
    mono: false,

    start: (key: KeyInfo) => {
      const n = key.n
      const frequency = synth.calculateFrequency(n)

      if (synth.mono) {
        heldKeys = heldKeys.filter(k => k !== n)
        heldKeys.push(n)
        if (monoVoice) {
          if (n !== monoVoice.n) {
            delete synth.activeVoices[monoVoice.n]
            monoVoice.n = n
            monoVoice.frequency = frequency
            monoVoice.retrigger(frequency, synth.glide, synth.envelope)
            synth.lastFrequency = frequency
            synth.activeVoices[n] = monoVoice
          }
        } else {
          monoVoice = makeVoice(
            context, n, frequency, volume,
            synth.osc1type, synth.osc2type,
            synth.osc1vol, synth.osc2vol,
            synth.osc1oct, synth.osc2oct,
            synth.osc1cutoff, synth.osc2cutoff,
            synth.vibratoSpeed, synth.vibratoDepth,
            synth.lastFrequency, synth.glide
          )
          monoVoice.connect()
          monoVoice.start(synth.envelope)
          synth.lastFrequency = frequency
          synth.activeVoices[n] = monoVoice
        }
        return
      }

      // If another key detuned into this slot, stop it now to prevent ghost notes
      if (synth.activeVoices[n]) {
        synth.activeVoices[n].stop(0)
        delete synth.activeVoices[n]
      }
      synth.activeVoices[n] = makeVoice(
        context, n, frequency, volume,
        synth.osc1type, synth.osc2type,
        synth.osc1vol, synth.osc2vol,
        synth.osc1oct, synth.osc2oct,
        synth.osc1cutoff, synth.osc2cutoff,
        synth.vibratoSpeed, synth.vibratoDepth,
        synth.lastFrequency, synth.glide
      )
      synth.activeVoices[n].connect()
      synth.activeVoices[n].start(synth.envelope)
      synth.lastFrequency = frequency
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
      if (synth.mono) {
        heldKeys = heldKeys.filter(k => k !== n)

        // Release any pre-toggle polyphonic voice at this key
        const polyVoice = synth.activeVoices[n]
        if (polyVoice && polyVoice !== monoVoice) {
          const voiceId = polyVoice.id
          polyVoice.stop(synth.envelope.release)
          setTimeout(() => {
            if (synth.activeVoices[n]?.id === voiceId) delete synth.activeVoices[n]
          }, synth.envelope.release * 1000)
        }

        if (!monoVoice) return
        if (heldKeys.length > 0) {
          const prevN = heldKeys[heldKeys.length - 1]
          if (prevN !== monoVoice.n) {
            delete synth.activeVoices[monoVoice.n]
            const prevFreq = synth.calculateFrequency(prevN)
            monoVoice.n = prevN
            monoVoice.frequency = prevFreq
            monoVoice.retrigger(prevFreq, synth.glide, synth.envelope)
            synth.lastFrequency = prevFreq
            synth.activeVoices[prevN] = monoVoice
          }
        } else {
          const stoppedId = monoVoice.id
          const stoppedN = monoVoice.n
          monoVoice.stop(synth.envelope.release)
          monoVoice = null
          setTimeout(() => {
            if (synth.activeVoices[stoppedN]?.id === stoppedId) delete synth.activeVoices[stoppedN]
          }, synth.envelope.release * 1000)
          synth.lastFrequency = 0
        }
        return
      }

      n = synth.handleOctaveChange(n)
      const voice = synth.activeVoices[n]
      if (!voice) return
      const voiceId = voice.id
      voice.stop(synth.envelope.release)
      // Delay deletion until after release completes so waveform continues to draw
      // Only delete if the voice in this slot is still the same one we stopped
      setTimeout(() => {
        if (synth.activeVoices[n]?.id === voiceId) {
          delete synth.activeVoices[n]
        }
      }, synth.envelope.release * 1000)
    },

    handleOctaveChange: (n: number) => {
      if (synth.activeVoices[n]) return n
      for (let order = 1; order <= 10; order++) {
        if (synth.activeVoices[n + 12 * order]) return n + 12 * order
        if (synth.activeVoices[n - 12 * order]) return n - 12 * order
      }
      return n
    },

    calculateFrequency: (n: number) => Math.pow(2, (n - 49) / 12) * 440
  }

  return synth
}

export default makeSynth
