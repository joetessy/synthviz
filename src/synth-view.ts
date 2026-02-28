import makeSynth from './synth'
import { initKnob, setKnobValue, getKnob } from './ui/knob'
import type { KeyInfo } from './types'

const synth = makeSynth()

export const synthView = {
  synth,
  inc: 0,
  ctx: (document.querySelector('#canvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D,
  lastTime: 0,
  keys: {
    65: { down: false, n: 40, action: (info: KeyInfo) => synthView.startSynth(info) },
    87: { down: false, n: 41, action: (info: KeyInfo) => synthView.startSynth(info) },
    83: { down: false, n: 42, action: (info: KeyInfo) => synthView.startSynth(info) },
    69: { down: false, n: 43, action: (info: KeyInfo) => synthView.startSynth(info) },
    68: { down: false, n: 44, action: (info: KeyInfo) => synthView.startSynth(info) },
    70: { down: false, n: 45, action: (info: KeyInfo) => synthView.startSynth(info) },
    84: { down: false, n: 46, action: (info: KeyInfo) => synthView.startSynth(info) },
    71: { down: false, n: 47, action: (info: KeyInfo) => synthView.startSynth(info) },
    89: { down: false, n: 48, action: (info: KeyInfo) => synthView.startSynth(info) },
    72: { down: false, n: 49, action: (info: KeyInfo) => synthView.startSynth(info) },
    85: { down: false, n: 50, action: (info: KeyInfo) => synthView.startSynth(info) },
    74: { down: false, n: 51, action: (info: KeyInfo) => synthView.startSynth(info) },
    75: { down: false, n: 52, action: (info: KeyInfo) => synthView.startSynth(info) },
    79: { down: false, n: 53, action: (info: KeyInfo) => synthView.startSynth(info) },
    76: { down: false, n: 54, action: (info: KeyInfo) => synthView.startSynth(info) },
    80: { down: false, n: 55, action: (info: KeyInfo) => synthView.startSynth(info) },
    90: { down: false, n: 0, type: 'octave', dir: 'down', action: (info: KeyInfo) => synthView.octave(info) },
    88: { down: false, n: 0, type: 'octave', dir: 'up', action: (info: KeyInfo) => synthView.octave(info) }
  } as Record<number, KeyInfo>,

  animate: (time: number) => {
    synthView.synth.draw(synthView.ctx)
    synthView.lastTime = time
    requestAnimationFrame(synthView.animate)
  },

  octave: (obj: KeyInfo) => {
    let oct1, oct2
    if (obj.dir === 'up') {
      oct1 = synthView.synth.osc1oct + 1
      oct2 = synthView.synth.osc2oct + 1
    } else {
      oct1 = synthView.synth.osc1oct - 1
      oct2 = synthView.synth.osc2oct - 1
    }
    synthView.synth.changeOctave(oct1, 1)
    synthView.synth.changeOctave(oct2, 2)
  },

  increment: (val: number) => {
    const keys = Object.keys(synthView.keys)
    let diff = Math.abs(synthView.inc - val)
    if (synthView.inc > val) diff *= -1

    for (let i = 0; i < keys.length; i++) {
      const currKey = Number(keys[i])
      if (!synthView.keys[currKey].incremented) {
        synthView.keys[currKey].origin = synthView.keys[currKey].n
      }
      if (synthView.synth.activeVoices[synthView.keys[currKey].n]) {
        synthView.keys[currKey].incremented = true
      }
      const n = synthView.keys[currKey].n += diff
      if (n) synthView.keys[currKey].n = n
    }
    synthView.synth.updateFrequencies(diff)
    synthView.inc = val
    synthView.updateKeyLettering()
  },

  updateKeyLettering: () => {
    const keyLetters = ['A', 'W', 'S', 'E', 'D', 'F', 'T', 'G',
                        'Y', 'H', 'U', 'J', 'K', 'O', 'L', 'P']
    const keyValues = Object.keys(synthView.keys)
    const firstKey = synthView.keys[Number(keyValues[0])].n
    const keyDivs = document.querySelectorAll('div[data-keynum]')

    for (let i = 0; i < keyDivs.length; i++) {
      keyDivs[i].innerHTML = ''
    }
    for (let i = 0; i < keyLetters.length; i++) {
      const keyString = `div[data-keynum="${i + firstKey}"]`
      const keyDiv = document.querySelector(keyString)
      if (keyDiv) keyDiv.innerHTML = keyLetters[i]
    }
  },

  startSynth: (info: KeyInfo) => {
    synthView.synth.start(info)
    synthView.pushKey(info.n)
  },

  pushKey: (n: number) => {
    const keyString = `div[data-key="${n}"]`
    const key = document.querySelector(keyString)
    if (key !== null) {
      if (Array.from(key.classList).includes('black')) {
        key.classList.add('playblack')
      } else {
        key.classList.add('playwhite')
      }
    }
  },

  releaseKey: (n: number) => {
    const keyString = `div[data-key="${n}"]`
    const key = document.querySelector(keyString)
    if (key !== null) {
      if (Array.from(key.classList).includes('black')) {
        key.classList.remove('playblack')
      } else {
        key.classList.remove('playwhite')
      }
    }
  },

  setUpKnobs: () => {
    const knobs = document.querySelectorAll<HTMLCanvasElement>('canvas.knob')
    knobs.forEach((canvas) => {
      const action = canvas.dataset.action ?? ''
      const min = parseFloat(canvas.dataset.min ?? '0')
      const max = parseFloat(canvas.dataset.max ?? '100')
      const step = parseFloat(canvas.dataset.step ?? '1')
      const initial = parseFloat(canvas.dataset.value ?? '0')
      initKnob(canvas, min, max, step, initial, (v) => {
        switch (action) {
          case 'tremolo-speed':
            synth.changeLFO(v, 'speed', 'tremolo')
            break
          case 'tremolo-depth':
            synth.changeLFO(v, 'depth', 'tremolo')
            break
          case 'vibrato-speed':
            synth.changeLFO(v, 'speed', 'vibrato')
            break
          case 'vibrato-depth':
            synth.changeLFO(v, 'depth', 'vibrato')
            break
          case 'tune':
            synthView.increment(v)
            break
          case 'attack':
            synth.envelope.attack = 2 * v / 100
            break
          case 'decay':
            synth.envelope.decay = 3 * v / 100
            break
          case 'sustain':
            synth.envelope.sustain = v / 100
            break
          case 'release':
            synth.envelope.release = 2 * v / 100 + 0.01
            break
          case 'oscVolume':
            if (canvas.dataset.osc === '1') {
              synth.changeOscVolume(v / 1200, 1)
            } else {
              synth.changeOscVolume(v / 1200, 2)
            }
            break
          case 'octave':
            if (canvas.dataset.osc === '1') {
              synth.changeOctave(v, 1)
            } else {
              synth.changeOctave(v, 2)
            }
            break
          case 'cutoff':
            if (canvas.dataset.osc === '1') {
              synth.changeCutoff(v, synth.osc1res, 1)
            } else {
              synth.changeCutoff(v, synth.osc2res, 2)
            }
            break
        }
      })
    })
  },

  setUpOscillatorTypes: () => {
    const oscSettings = document.querySelectorAll('.osctype')
    oscSettings.forEach((osc) => {
      osc.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement
        const type = target.getAttribute('data-type') as OscillatorType
        const num = target.getAttribute('data-osc') ?? ''
        const currSet = document.querySelectorAll(`div[data-osc="${num}"]`)
        currSet.forEach((osci) => {
          osci.classList.remove('active')
        })
        synth.changeType(type, num)
        target.classList.add('active')
      })
    })
  },

  clearActivePreset: () => {
    const presets = document.querySelectorAll('.preset')
    presets.forEach((preset) => {
      if (Array.from(preset.classList).includes('active')) {
        preset.classList.remove('active')
      }
    })
  },

  setUpShowHide: () => {
    const envelope = document.querySelector('.envelope')
    const header = document.querySelector('h2')
    const oscillators = document.querySelector('.oscillator-controls')
    const bottomLeft = document.querySelector('.bottom-left')
    const bottomRight = document.querySelector('.bottom-right')
    const lfoSection = document.querySelector('.lfo-section')
    const hideButton = document.querySelector('.toggle-controls') as HTMLElement

    hideButton.addEventListener('click', () => {
      if (Array.from(hideButton.classList).includes('active')) {
        hideButton.classList.remove('active')
        hideButton.innerHTML = 'HIDE'
        envelope?.classList.remove('hide')
        oscillators?.classList.remove('hide')
        bottomLeft?.classList.remove('hide')
        bottomRight?.classList.remove('hide')
        lfoSection?.classList.remove('hide')
        header?.classList.remove('hide')
      } else {
        hideButton.classList.add('active')
        hideButton.innerHTML = 'SHOW'
        envelope?.classList.add('hide')
        bottomLeft?.classList.add('hide')
        bottomRight?.classList.add('hide')
        oscillators?.classList.add('hide')
        lfoSection?.classList.add('hide')
        header?.classList.add('hide')
      }
    })
  },

  setUpPresets: () => {
    synthView.setUpShowHide()
    const presets = document.querySelectorAll('.preset')
    presets.forEach((preset) => {
      preset.addEventListener('click', () => {
        switch (preset.innerHTML) {
          case '1':
            synthView.setPreset(0, 7, 55, 10, 50, 1, 9.18, 18, 4, 12.91, 6, 5, 0, 0, 'sine', 'sine')
            break
          case '2':
            synthView.setPreset(32, 7, 55, 10, 40, 1, 16.74, 55, 3, 12.89, 3.5, 6, 6, 76, 'sawtooth', 'triangle')
            break
          case '3':
            synthView.setPreset(0, 7, 55, 10, 40, 1, 9.18, 55, 2, 12.91, 2, 2, 8.5, 84, 'triangle', 'triangle')
            break
          case '4':
            synthView.setPreset(0, 5, 0, 10, 40, 1, 9.18, 55, 3, 18.88, 0, 0, 0, 0, 'sawtooth', 'triangle')
            break
          case '5':
            synthView.setPreset(24, 0, 100, 10, 40, 1, 6.62, 55, 3, 11.83, 3.5, 2, 1.5, 45, 'square', 'sawtooth')
            break
        }
        synthView.clearActivePreset()
        preset.classList.add('active')
      })
    })
  },

  setPreset: (
    attack: number, decay: number, sustain: number, release: number,
    osc1vol: number, osc1oct: number, osc1cutoff: number,
    osc2vol: number, osc2oct: number, osc2cutoff: number,
    vibratoSpeed: number, vibratoDepth: number,
    tremoloSpeed: number, tremoloDepth: number,
    osc1type: OscillatorType, osc2type: OscillatorType
  ) => {
    setKnobValue(getKnob('attack'), attack, true)
    setKnobValue(getKnob('decay'), decay, true)
    setKnobValue(getKnob('sustain'), sustain, true)
    setKnobValue(getKnob('release'), release, true)
    setKnobValue(getKnob('oscVolume', '1'), osc1vol, true)
    setKnobValue(getKnob('oscVolume', '2'), osc2vol, true)
    setKnobValue(getKnob('octave', '1'), osc1oct, true)
    setKnobValue(getKnob('octave', '2'), osc2oct, true)
    setKnobValue(getKnob('cutoff', '1'), osc1cutoff, true)
    setKnobValue(getKnob('cutoff', '2'), osc2cutoff, true)
    setKnobValue(getKnob('tremolo-speed'), tremoloSpeed, true)
    setKnobValue(getKnob('tremolo-depth'), tremoloDepth, true)
    setKnobValue(getKnob('vibrato-speed'), vibratoSpeed, true)
    setKnobValue(getKnob('vibrato-depth'), vibratoDepth, true)
    document.querySelector<HTMLElement>(`.osctype[data-type="${osc1type}"][data-osc="1"]`)?.click()
    document.querySelector<HTMLElement>(`.osctype[data-type="${osc2type}"][data-osc="2"]`)?.click()
  },

  start: () => {
    const keys = synthView.keys
    synthView.setUpPresets()
    synthView.setUpKnobs()
    synthView.setUpOscillatorTypes()
    requestAnimationFrame(synthView.animate)

    document.addEventListener('keydown', (e) => {
      synthView.synth.context.resume()
      const keyInfo = keys[e.keyCode]
      if (keyInfo) {
        if (keyInfo.down) return
        keyInfo.down = true
        keyInfo.action(keyInfo)
      }
    })

    document.addEventListener('keyup', (e) => {
      const keyInfo = keys[e.keyCode]
      if (keyInfo) {
        keyInfo.down = false
        if (keyInfo.type === 'octave') return

        const n = keyInfo.n
        if (keyInfo.incremented) {
          synthView.synth.stop(keyInfo.origin ?? n)
          synthView.releaseKey(keyInfo.origin ?? n)
          keyInfo.incremented = false
        } else {
          synthView.synth.stop(n)
          synthView.releaseKey(n)
        }
      }
    })

    synthView.synth.tremoloLfo.connect(synthView.synth.tremoloAmp)
    synthView.synth.tremoloAmp.connect(synthView.synth.volume.gain.gain)
    synthView.synth.volume.connect(synthView.synth.compressor)
    synthView.synth.compressor.connect(synthView.synth.context.destination)
    synthView.synth.tremoloLfo.start()
  }
}
