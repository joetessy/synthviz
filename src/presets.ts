import { getKnob, getKnobValue } from './ui/knob'
import type { PresetParams, PresetData } from './types'

const STORAGE_KEY = 'synthviz-user-presets'

export const BUILTIN_PRESETS: PresetData[] = [
  {
    id: 'builtin-1', name: 'Default', isBuiltIn: true,
    params: { attack: 0, decay: 0, sustain: 100, release: 10, osc1vol: 50, osc1oct: 1, osc1cutoff: 22, osc2vol: 25, osc2oct: 2, osc2cutoff: 22, vibratoSpeed: 0, vibratoDepth: 0, tremoloSpeed: 0, tremoloDepth: 0, osc1type: 'sine', osc2type: 'sine', glide: 0, mono: false }
  },
  {
    id: 'builtin-2', name: 'Warm Pad', isBuiltIn: true,
    params: { attack: 0, decay: 7, sustain: 55, release: 10, osc1vol: 50, osc1oct: 1, osc1cutoff: 9.18, osc2vol: 18, osc2oct: 4, osc2cutoff: 12.91, vibratoSpeed: 6, vibratoDepth: 5, tremoloSpeed: 0, tremoloDepth: 0, osc1type: 'sine', osc2type: 'sine', glide: 0, mono: false }
  },
  {
    id: 'builtin-3', name: 'Lead', isBuiltIn: true,
    params: { attack: 32, decay: 7, sustain: 55, release: 10, osc1vol: 40, osc1oct: 1, osc1cutoff: 16.74, osc2vol: 55, osc2oct: 3, osc2cutoff: 12.89, vibratoSpeed: 3.5, vibratoDepth: 6, tremoloSpeed: 6, tremoloDepth: 76, osc1type: 'sawtooth', osc2type: 'triangle', glide: 0, mono: false }
  },
  {
    id: 'builtin-4', name: 'Bells', isBuiltIn: true,
    params: { attack: 0, decay: 7, sustain: 55, release: 10, osc1vol: 40, osc1oct: 1, osc1cutoff: 9.18, osc2vol: 55, osc2oct: 2, osc2cutoff: 12.91, vibratoSpeed: 2, vibratoDepth: 2, tremoloSpeed: 8.5, tremoloDepth: 84, osc1type: 'triangle', osc2type: 'triangle', glide: 0, mono: false }
  },
  {
    id: 'builtin-5', name: 'Bass', isBuiltIn: true,
    params: { attack: 0, decay: 5, sustain: 0, release: 10, osc1vol: 40, osc1oct: 1, osc1cutoff: 9.18, osc2vol: 55, osc2oct: 3, osc2cutoff: 18.88, vibratoSpeed: 0, vibratoDepth: 0, tremoloSpeed: 0, tremoloDepth: 0, osc1type: 'sawtooth', osc2type: 'triangle', glide: 0, mono: false }
  },
  {
    id: 'builtin-6', name: 'Arp', isBuiltIn: true,
    params: { attack: 24, decay: 0, sustain: 100, release: 10, osc1vol: 40, osc1oct: 1, osc1cutoff: 6.62, osc2vol: 55, osc2oct: 3, osc2cutoff: 11.83, vibratoSpeed: 3.5, vibratoDepth: 2, tremoloSpeed: 1.5, tremoloDepth: 45, osc1type: 'square', osc2type: 'sawtooth', glide: 0, mono: false }
  }
]

export const loadUserPresets = (): PresetData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as PresetData[]
  } catch {
    return []
  }
}

export const saveUserPresets = (presets: PresetData[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
}

export const getAllPresets = (): PresetData[] => [
  ...BUILTIN_PRESETS,
  ...loadUserPresets()
]

export const captureState = (): PresetParams => {
  const kv = (action: string, osc?: string): number => {
    const canvas = getKnob(action, osc)
    return canvas ? getKnobValue(canvas) : 0
  }
  const osc1type = (document.querySelector('.osctype.active[data-osc="1"], .osctype.dirty[data-osc="1"]') as HTMLElement | null)?.dataset.type as OscillatorType ?? 'sine'
  const osc2type = (document.querySelector('.osctype.active[data-osc="2"], .osctype.dirty[data-osc="2"]') as HTMLElement | null)?.dataset.type as OscillatorType ?? 'sine'
  const mono = (document.querySelector('.mono-btn') as HTMLElement | null)?.dataset.mono === 'true'
  return {
    attack: kv('attack'),
    decay: kv('decay'),
    sustain: kv('sustain'),
    release: kv('release'),
    osc1vol: kv('oscVolume', '1'),
    osc1oct: kv('octave', '1'),
    osc1cutoff: kv('cutoff', '1'),
    osc2vol: kv('oscVolume', '2'),
    osc2oct: kv('octave', '2'),
    osc2cutoff: kv('cutoff', '2'),
    vibratoSpeed: kv('vibrato-speed'),
    vibratoDepth: kv('vibrato-depth'),
    tremoloSpeed: kv('tremolo-speed'),
    tremoloDepth: kv('tremolo-depth'),
    osc1type,
    osc2type,
    glide: kv('glide'),
    mono
  }
}
