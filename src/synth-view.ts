import makeSynth from './synth'
import { initKnob, setKnobValue, getKnob, getKnobValue, redrawKnob } from './ui/knob'
import { BUILTIN_PRESETS, getAllPresets, loadUserPresets, saveUserPresets, captureState } from './presets'
import type { KeyInfo, PresetData, PresetParams } from './types'

const synth = makeSynth()

export const synthView = {
  synth,
  inc: 0,
  ctx: (document.querySelector('#canvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D,
  lastTime: 0,
  activePresetId: null as string | null,
  isDirty: false,
  loadedPresetParams: null as PresetParams | null,
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

    // Save prev positions before updating, for two-pass visual move below
    const prevNs: Record<number, number> = {}
    for (let i = 0; i < keys.length; i++) {
      const currKey = Number(keys[i])
      prevNs[currKey] = synthView.keys[currKey].n
      if (!synthView.keys[currKey].incremented) {
        synthView.keys[currKey].origin = synthView.keys[currKey].n
      }
      if (synthView.synth.activeVoices[synthView.keys[currKey].n]) {
        synthView.keys[currKey].incremented = true
      }
      const n = synthView.keys[currKey].n += diff
      if (n) synthView.keys[currKey].n = n
    }

    // Two-pass visual update: avoids de-highlighting a key that another held
    // note just moved into (e.g. A→42 while S was at 42 before moving to 44)
    const toRelease: number[] = []
    const toPush: number[] = []
    for (let i = 0; i < keys.length; i++) {
      const currKey = Number(keys[i])
      if (synthView.keys[currKey].down && synthView.keys[currKey].type !== 'octave') {
        toRelease.push(prevNs[currKey])
        toPush.push(synthView.keys[currKey].n)
      }
    }
    const pushSet = new Set(toPush)
    toRelease.forEach(oldN => { if (!pushSet.has(oldN)) synthView.releaseKey(oldN) })
    toPush.forEach(newN => synthView.pushKey(newN))

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

  updateMonoBtn: () => {
    const monoBtn = document.querySelector('.mono-btn') as HTMLElement | null
    if (!monoBtn) return
    monoBtn.classList.remove('active', 'dirty')
    if (synthView.activePresetId && synthView.loadedPresetParams) {
      const presetMono = synthView.loadedPresetParams.mono ?? false
      if (synth.mono !== presetMono) {
        monoBtn.classList.add('dirty')
      } else if (synth.mono) {
        monoBtn.classList.add('active')
      }
    } else if (synth.mono) {
      monoBtn.classList.add('active')
    }
  },

  // ── Knob action handler (shared between onChange and onRelease) ───────────

  applyKnobAction: (action: string, osc: string | undefined, v: number) => {
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
      case 'glide':
        synth.glide = v
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
        if (osc === '1') {
          synth.changeOscVolume(v / 1200, 1)
        } else {
          synth.changeOscVolume(v / 1200, 2)
        }
        break
      case 'octave':
        if (osc === '1') {
          synth.changeOctave(v, 1)
        } else {
          synth.changeOctave(v, 2)
        }
        break
      case 'cutoff':
        if (osc === '1') {
          synth.changeCutoff(v, synth.osc1res, 1)
        } else {
          synth.changeCutoff(v, synth.osc2res, 2)
        }
        break
    }
  },

  getPresetValueForKnob: (action: string, osc: string | undefined): number | null => {
    const p = synthView.loadedPresetParams
    if (!p) return null
    switch (action) {
      case 'attack':        return p.attack
      case 'decay':         return p.decay
      case 'sustain':       return p.sustain
      case 'release':       return p.release
      case 'oscVolume':     return osc === '1' ? p.osc1vol    : p.osc2vol
      case 'octave':        return osc === '1' ? p.osc1oct    : p.osc2oct
      case 'cutoff':        return osc === '1' ? p.osc1cutoff : p.osc2cutoff
      case 'vibrato-speed': return p.vibratoSpeed
      case 'vibrato-depth': return p.vibratoDepth
      case 'tremolo-speed': return p.tremoloSpeed
      case 'tremolo-depth': return p.tremoloDepth
      case 'glide':         return p.glide
      default:              return null
    }
  },

  // Compares current synth state against loadedPresetParams and updates:
  //  - preset button class (.active vs .dirty)
  //  - save / reset button visibility
  // Knob arc colors are updated individually in setUpKnobs onChange.
  recomputePresetButtonDirty: () => {
    if (!synthView.activePresetId || !synthView.loadedPresetParams) return
    const p = synthView.loadedPresetParams

    // Compare full captured state vs preset
    const current = captureState()
    const anyDirty = !(
      Math.abs(current.attack        - p.attack)        < 0.001 &&
      Math.abs(current.decay         - p.decay)         < 0.001 &&
      Math.abs(current.sustain       - p.sustain)       < 0.001 &&
      Math.abs(current.release       - p.release)       < 0.001 &&
      Math.abs(current.osc1vol       - p.osc1vol)       < 0.001 &&
      Math.abs(current.osc1oct       - p.osc1oct)       < 0.001 &&
      Math.abs(current.osc1cutoff    - p.osc1cutoff)    < 0.001 &&
      Math.abs(current.osc2vol       - p.osc2vol)       < 0.001 &&
      Math.abs(current.osc2oct       - p.osc2oct)       < 0.001 &&
      Math.abs(current.osc2cutoff    - p.osc2cutoff)    < 0.001 &&
      Math.abs(current.vibratoSpeed  - p.vibratoSpeed)  < 0.001 &&
      Math.abs(current.vibratoDepth  - p.vibratoDepth)  < 0.001 &&
      Math.abs(current.tremoloSpeed  - p.tremoloSpeed)  < 0.001 &&
      Math.abs(current.tremoloDepth  - p.tremoloDepth)  < 0.001 &&
      Math.abs(current.glide         - p.glide)         < 0.001 &&
      current.osc1type === p.osc1type &&
      current.osc2type === p.osc2type &&
      current.mono === (p.mono ?? false)
    )

    const activeBtn = document.querySelector(`.preset[data-preset-id="${synthView.activePresetId}"]`)

    if (anyDirty) {
      synthView.isDirty = true
      if (activeBtn) {
        activeBtn.classList.remove('active')
        activeBtn.classList.add('dirty')
      }
      const saveBtn = document.querySelector('.preset-save-btn') as HTMLElement | null
      const resetBtn = document.querySelector('.preset-reset-btn') as HTMLElement | null
      if (saveBtn) {
        const isBuiltIn = BUILTIN_PRESETS.some(bp => bp.id === synthView.activePresetId)
        saveBtn.textContent = isBuiltIn ? 'SAVE AS NEW' : 'SAVE'
        saveBtn.classList.remove('hide')
      }
      if (resetBtn) resetBtn.classList.remove('hide')
    } else {
      synthView.isDirty = false
      if (activeBtn) {
        activeBtn.classList.remove('dirty')
        activeBtn.classList.add('active')
      }
      document.querySelector('.preset-save-btn')?.classList.add('hide')
      document.querySelector('.preset-reset-btn')?.classList.add('hide')
    }
    synthView.updateMonoBtn()
  },

  setUpKnobs: () => {
    const knobs = document.querySelectorAll<HTMLCanvasElement>('canvas.knob')
    knobs.forEach((canvas) => {
      const action = canvas.dataset.action ?? ''
      const osc = canvas.dataset.osc
      const min = parseFloat(canvas.dataset.min ?? '0')
      const max = parseFloat(canvas.dataset.max ?? '100')
      const step = parseFloat(canvas.dataset.step ?? '1')
      const initial = parseFloat(canvas.dataset.value ?? '0')

      const onChange = (v: number) => {
        synthView.applyKnobAction(action, osc, v)
        // Immediate color feedback: orange if value differs from loaded preset
        if (synthView.activePresetId && synthView.loadedPresetParams) {
          const presetVal = synthView.getPresetValueForKnob(action, osc)
          if (presetVal !== null) {
            const newColor = Math.abs(v - presetVal) >= step * 0.5 ? '#ff9900' : '#b4ff00'
            if (canvas.dataset.color !== newColor) {
              canvas.dataset.color = newColor
              redrawKnob(canvas)
            }
          }
          synthView.recomputePresetButtonDirty()
        }
      }

      initKnob(canvas, min, max, step, initial, onChange)
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
          osci.classList.remove('dirty')
        })
        synth.changeType(type, num)
        // apply to any currently playing voices
        Object.values(synth.activeVoices).forEach(voice => {
          if (num === '1') voice.oscillator1.changeType(type)
          else voice.oscillator2.changeType(type)
        })
        // Show orange if this type differs from the loaded preset, green if it matches
        if (synthView.activePresetId && synthView.loadedPresetParams) {
          const presetType = num === '1'
            ? synthView.loadedPresetParams.osc1type
            : synthView.loadedPresetParams.osc2type
          target.classList.add(type !== presetType ? 'dirty' : 'active')
        } else {
          target.classList.add('active')
        }
        synthView.recomputePresetButtonDirty()
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
    const controlsStrip = document.querySelector('.controls-strip') as HTMLElement | null
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
        if (controlsStrip) {
          controlsStrip.classList.remove('hide')
          document.documentElement.style.removeProperty('--panel-height')
        } else {
          envelope?.classList.remove('hide')
          oscillators?.classList.remove('hide')
          bottomLeft?.classList.remove('hide')
          bottomRight?.classList.remove('hide')
          lfoSection?.classList.remove('hide')
          header?.classList.remove('hide')
        }
      } else {
        hideButton.classList.add('active')
        hideButton.innerHTML = 'SHOW'
        if (controlsStrip) {
          controlsStrip.classList.add('hide')
          document.documentElement.style.setProperty('--panel-height', '150px')
        } else {
          envelope?.classList.add('hide')
          bottomLeft?.classList.add('hide')
          bottomRight?.classList.add('hide')
          oscillators?.classList.add('hide')
          lfoSection?.classList.add('hide')
          header?.classList.add('hide')
        }
      }
    })
  },

  // ── V2 preset system ──────────────────────────────────────────────────────

  renderPresets: () => {
    const builtinRow = document.querySelector('.preset-row-builtin')
    const userRow = document.querySelector('.preset-row-user')
    if (!builtinRow || !userRow) return

    builtinRow.innerHTML = ''
    userRow.innerHTML = ''

    BUILTIN_PRESETS.forEach((preset, i) => {
      const btn = document.createElement('div')
      btn.className = 'preset'
      btn.dataset.presetId = preset.id
      btn.textContent = String(i + 1)
      btn.title = preset.name
      if (preset.id === synthView.activePresetId) {
        if (synthView.isDirty) btn.classList.add('dirty')
        else btn.classList.add('active')
      }
      builtinRow.appendChild(btn)
    })

    loadUserPresets().forEach((preset) => {
      const btn = document.createElement('div')
      btn.className = 'preset user-preset'
      btn.dataset.presetId = preset.id
      btn.title = preset.name

      const label = document.createElement('span')
      label.className = 'preset-name-label'
      label.textContent = preset.name

      const rename = document.createElement('span')
      rename.className = 'preset-rename'
      rename.textContent = '✎'
      rename.dataset.renameId = preset.id

      const del = document.createElement('span')
      del.className = 'preset-delete'
      del.textContent = '×'
      del.dataset.deleteId = preset.id

      btn.appendChild(label)
      btn.appendChild(rename)
      btn.appendChild(del)

      if (preset.id === synthView.activePresetId) {
        if (synthView.isDirty) btn.classList.add('dirty')
        else btn.classList.add('active')
      }
      userRow.appendChild(btn)
    })

    const newBtn = document.createElement('div')
    newBtn.className = 'preset preset-new'
    newBtn.textContent = '+'
    newBtn.title = 'New preset from current state'
    userRow.appendChild(newBtn)
  },

  showConfirm: (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      let overlay = document.querySelector<HTMLElement>('.sv-confirm')
      if (!overlay) {
        overlay = document.createElement('div')
        overlay.className = 'sv-confirm hide'
        overlay.innerHTML = `
          <div class="sv-confirm-box">
            <p class="sv-confirm-msg"></p>
            <div class="sv-confirm-btns">
              <button class="sv-confirm-cancel">CANCEL</button>
              <button class="sv-confirm-ok">DELETE</button>
            </div>
          </div>`
        document.body.appendChild(overlay)
      }

      overlay.querySelector('.sv-confirm-msg')!.textContent = message
      overlay.classList.remove('hide')

      const done = (result: boolean) => {
        overlay!.classList.add('hide')
        resolve(result)
      }

      overlay.querySelector('.sv-confirm-ok')!.addEventListener('click', () => done(true), { once: true })
      overlay.querySelector('.sv-confirm-cancel')!.addEventListener('click', () => done(false), { once: true })
      overlay.addEventListener('click', (e) => { if (e.target === overlay) done(false) }, { once: true })
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') done(false) }, { once: true })
    })
  },

  handlePresetRowClick: async (e: Event) => {
    const target = e.target as HTMLElement

    if (target.classList.contains('preset-delete')) {
      const id = target.dataset.deleteId
      if (!id) return
      const preset = getAllPresets().find(p => p.id === id)
      if (!preset) return
      if (!await synthView.showConfirm(`Delete "${preset.name}"?`)) return
      const userPresets = loadUserPresets().filter(p => p.id !== id)
      saveUserPresets(userPresets)
      if (synthView.activePresetId === id) {
        synthView.activePresetId = null
        synthView.isDirty = false
        document.querySelector('.preset-save-btn')?.classList.add('hide')
        document.querySelector('.preset-reset-btn')?.classList.add('hide')
      }
      synthView.renderPresets()
      return
    }

    if (target.classList.contains('preset-rename')) {
      const id = target.dataset.renameId
      if (id) synthView.startRename(id)
      return
    }

    const btn = target.closest('.preset') as HTMLElement | null
    if (!btn) return

    if (btn.classList.contains('preset-new')) {
      synthView.newPreset()
      return
    }

    const presetId = btn.dataset.presetId
    if (!presetId) return
    const preset = getAllPresets().find(p => p.id === presetId)
    if (!preset) return
    synthView.loadPreset(preset)
  },

  loadPreset: (preset: PresetData) => {
    synthView.activePresetId = null  // suppress dirty checks during setPreset
    synthView.loadedPresetParams = { ...preset.params }
    const p = preset.params
    synthView.setPreset(
      p.attack, p.decay, p.sustain, p.release,
      p.osc1vol, p.osc1oct, p.osc1cutoff,
      p.osc2vol, p.osc2oct, p.osc2cutoff,
      p.vibratoSpeed, p.vibratoDepth,
      p.tremoloSpeed, p.tremoloDepth,
      p.osc1type, p.osc2type,
      p.glide ?? 0, p.mono ?? false
    )
    synthView.activePresetId = preset.id
    synthView.clearDirtyState()
  },

  markDirty: (_canvas: HTMLCanvasElement | null) => {
    synthView.recomputePresetButtonDirty()
  },

  clearDirtyState: () => {
    synthView.isDirty = false

    document.querySelectorAll<HTMLCanvasElement>('canvas.knob').forEach(canvas => {
      canvas.dataset.color = '#b4ff00'
      redrawKnob(canvas)
    })

    document.querySelectorAll('.preset.dirty').forEach(b => b.classList.remove('dirty'))
    // Osctype buttons: remove dirty (setPreset's .click() re-adds .active to the correct ones)
    document.querySelectorAll<HTMLElement>('.osctype.dirty').forEach(btn => btn.classList.remove('dirty'))
    synthView.updateMonoBtn()

    document.querySelector('.preset-save-btn')?.classList.add('hide')
    document.querySelector('.preset-reset-btn')?.classList.add('hide')

    // Update active button highlight
    document.querySelectorAll('.preset').forEach(b => b.classList.remove('active'))
    if (synthView.activePresetId) {
      document.querySelector(`.preset[data-preset-id="${synthView.activePresetId}"]`)?.classList.add('active')
    }
  },

  savePreset: () => {
    const params = captureState()
    const isBuiltIn = synthView.activePresetId
      ? BUILTIN_PRESETS.some(p => p.id === synthView.activePresetId)
      : true

    if (!isBuiltIn && synthView.activePresetId) {
      const userPresets = loadUserPresets()
      const idx = userPresets.findIndex(p => p.id === synthView.activePresetId)
      if (idx >= 0) {
        userPresets[idx].params = params
        saveUserPresets(userPresets)
        synthView.loadedPresetParams = { ...params }
      }
      synthView.clearDirtyState()
      synthView.renderPresets()
    } else {
      synthView.createNewPreset(params)
    }
  },

  resetPreset: () => {
    if (!synthView.activePresetId) return
    const preset = getAllPresets().find(p => p.id === synthView.activePresetId)
    if (!preset) return
    synthView.loadPreset(preset)
  },

  createNewPreset: (params: ReturnType<typeof captureState>) => {
    const userPresets = loadUserPresets()
    const name = `Preset ${userPresets.length + 1}`
    const id = crypto.randomUUID()
    userPresets.push({ id, name, isBuiltIn: false, params })
    saveUserPresets(userPresets)
    synthView.activePresetId = id
    synthView.loadedPresetParams = { ...params }
    synthView.renderPresets()
    synthView.clearDirtyState()
    synthView.startRename(id)
  },

  newPreset: () => {
    synthView.createNewPreset(captureState())
  },

  startRename: (id: string) => {
    const btn = document.querySelector(`.preset[data-preset-id="${id}"]`) as HTMLElement | null
    if (!btn) return

    const userPresets = loadUserPresets()
    const preset = userPresets.find(p => p.id === id)
    if (!preset) return

    const input = document.createElement('input')
    input.type = 'text'
    input.value = preset.name
    input.className = 'preset-name-input'

    const finishRename = () => {
      const newName = input.value.trim() || preset.name
      const idx = userPresets.findIndex(p => p.id === id)
      if (idx >= 0) {
        userPresets[idx].name = newName
        saveUserPresets(userPresets)
      }
      synthView.renderPresets()
    }

    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') { e.preventDefault(); finishRename() }
      if (e.key === 'Escape') { synthView.renderPresets() }
    })
    input.addEventListener('blur', finishRename)

    btn.innerHTML = ''
    btn.appendChild(input)
    input.focus()
    input.select()
  },

  // ── Old-UI preset system ──────────────────────────────────────────────────

  setUpPresets: () => {
    synthView.setUpShowHide()

    const presetRow = document.querySelector('.preset-row')
    if (!presetRow) {
      // Old UI: switch on innerHTML
      const presets = document.querySelectorAll('.preset')
      presets.forEach((preset) => {
        preset.addEventListener('click', () => {
          switch (preset.innerHTML) {
            case '1':
              synthView.setPreset(0, 0, 100, 10, 50, 1, 22, 25, 2, 22, 0, 0, 0, 0, 'sine', 'sine')
              break
            case '2':
              synthView.setPreset(0, 7, 55, 10, 50, 1, 9.18, 18, 4, 12.91, 6, 5, 0, 0, 'sine', 'sine')
              break
            case '3':
              synthView.setPreset(32, 7, 55, 10, 40, 1, 16.74, 55, 3, 12.89, 3.5, 6, 6, 76, 'sawtooth', 'triangle')
              break
            case '4':
              synthView.setPreset(0, 7, 55, 10, 40, 1, 9.18, 55, 2, 12.91, 2, 2, 8.5, 84, 'triangle', 'triangle')
              break
            case '5':
              synthView.setPreset(0, 5, 0, 10, 40, 1, 9.18, 55, 3, 18.88, 0, 0, 0, 0, 'sawtooth', 'triangle')
              break
            case '6':
              synthView.setPreset(24, 0, 100, 10, 40, 1, 6.62, 55, 3, 11.83, 3.5, 2, 1.5, 45, 'square', 'sawtooth')
              break
          }
          synthView.clearActivePreset()
          preset.classList.add('active')
        })
      })
      return
    }

    // V2: dynamic preset list
    synthView.renderPresets()
    presetRow.addEventListener('click', synthView.handlePresetRowClick)

    document.querySelector('.preset-save-btn')?.addEventListener('click', synthView.savePreset)
    document.querySelector('.preset-reset-btn')?.addEventListener('click', synthView.resetPreset)
  },

  setPreset: (
    attack: number, decay: number, sustain: number, release: number,
    osc1vol: number, osc1oct: number, osc1cutoff: number,
    osc2vol: number, osc2oct: number, osc2cutoff: number,
    vibratoSpeed: number, vibratoDepth: number,
    tremoloSpeed: number, tremoloDepth: number,
    osc1type: OscillatorType, osc2type: OscillatorType,
    glide = 0, mono = false
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
    setKnobValue(getKnob('glide'), glide, true)
    synth.mono = mono
    const monoBtn = document.querySelector('.mono-btn') as HTMLElement | null
    if (monoBtn) monoBtn.dataset.mono = mono.toString()
    document.querySelector<HTMLElement>(`.osctype[data-type="${osc1type}"][data-osc="1"]`)?.click()
    document.querySelector<HTMLElement>(`.osctype[data-type="${osc2type}"][data-osc="2"]`)?.click()
  },

  setUpKeyboard: () => {
    const keyboard = document.querySelector('.keyboard')
    if (!keyboard) return

    let mouseNote: number | null = null
    const touchNotes = new Map<number, number>()

    const startNote = (n: number) => {
      synth.context.resume()
      synth.start({ n, down: false, action: () => {} })
      synthView.pushKey(n)
    }

    const stopNote = (n: number) => {
      synth.stop(n)
      synthView.releaseKey(n)
    }

    keyboard.addEventListener('mousedown', (e: Event) => {
      const key = (e.target as HTMLElement).closest('[data-key]') as HTMLElement | null
      if (!key) return
      const n = parseInt(key.dataset.key ?? '')
      if (isNaN(n)) return
      e.preventDefault()
      mouseNote = n
      startNote(n)
    })

    keyboard.addEventListener('mouseover', (e: Event) => {
      if (mouseNote === null) return
      const key = (e.target as HTMLElement).closest('[data-key]') as HTMLElement | null
      if (!key) return
      const n = parseInt(key.dataset.key ?? '')
      if (isNaN(n) || n === mouseNote) return
      stopNote(mouseNote)
      mouseNote = n
      startNote(n)
    })

    document.addEventListener('mouseup', () => {
      if (mouseNote !== null) { stopNote(mouseNote); mouseNote = null }
    })

    keyboard.addEventListener('touchstart', (e: Event) => {
      const te = e as TouchEvent
      te.preventDefault()
      for (const touch of Array.from(te.changedTouches)) {
        const el = document.elementFromPoint(touch.clientX, touch.clientY)
        const key = el?.closest('[data-key]') as HTMLElement | null
        if (!key) continue
        const n = parseInt((key as HTMLElement).dataset.key ?? '')
        if (isNaN(n) || touchNotes.has(touch.identifier)) continue
        touchNotes.set(touch.identifier, n)
        startNote(n)
      }
    }, { passive: false } as AddEventListenerOptions)

    document.addEventListener('touchmove', (e: TouchEvent) => {
      if (touchNotes.size === 0) return
      e.preventDefault()
      for (const touch of Array.from(e.changedTouches)) {
        const prev = touchNotes.get(touch.identifier)
        if (prev === undefined) continue
        const el = document.elementFromPoint(touch.clientX, touch.clientY)
        const key = el?.closest('[data-key]') as HTMLElement | null
        if (!key) continue
        const n = parseInt((key as HTMLElement).dataset.key ?? '')
        if (isNaN(n) || n === prev) continue
        stopNote(prev)
        touchNotes.set(touch.identifier, n)
        startNote(n)
      }
    }, { passive: false } as AddEventListenerOptions)

    const endTouches = (e: Event) => {
      for (const touch of Array.from((e as TouchEvent).changedTouches)) {
        const n = touchNotes.get(touch.identifier)
        if (n !== undefined) { stopNote(n); touchNotes.delete(touch.identifier) }
      }
    }

    document.addEventListener('touchend', endTouches)
    document.addEventListener('touchcancel', endTouches)
  },

  start: () => {
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)

    const keys = synthView.keys
    synthView.setUpPresets()
    synthView.setUpKnobs()
    synthView.setUpOscillatorTypes()
    synthView.setUpKeyboard()

    const monoBtn = document.querySelector('.mono-btn') as HTMLElement | null
    if (monoBtn) {
      monoBtn.addEventListener('click', () => {
        synth.mono = !synth.mono
        monoBtn.dataset.mono = synth.mono.toString()
        synthView.updateMonoBtn()
        synthView.recomputePresetButtonDirty()
      })
    }

    if (document.querySelector('.preset-row')) {
      // V2: load first preset programmatically
      synthView.loadPreset(getAllPresets()[0])
    } else {
      ;(document.querySelector('.preset') as HTMLElement)?.click()
    }

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
          synthView.releaseKey(n)  // visual now tracks current n (moved by increment)
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
