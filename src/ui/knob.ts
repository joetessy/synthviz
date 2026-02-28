type KnobState = {
  value: number
  min: number
  max: number
  step: number
  onRelease: (v: number) => void
}

const knobMap = new WeakMap<HTMLCanvasElement, KnobState>()

const START = 0.75 * Math.PI
const SWEEP = 1.5 * Math.PI

const drawKnob = (canvas: HTMLCanvasElement, state: KnobState) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { value, min, max } = state
  const ratio = (value - min) / (max - min)
  const w = canvas.width
  const h = canvas.height
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) / 2 - 4

  ctx.clearRect(0, 0, w, h)

  ctx.beginPath()
  ctx.arc(cx, cy, r, START, START + SWEEP)
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 4
  ctx.stroke()

  if (ratio > 0) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, START, START + SWEEP * ratio)
    ctx.strokeStyle = '#ff00f7'
    ctx.lineWidth = 4
    ctx.stroke()
  }

  const decimals = state.step >= 1 ? 0 : Math.max(0, Math.ceil(-Math.log10(state.step)))
  const label = value.toFixed(decimals)
  ctx.fillStyle = 'white'
  ctx.font = '9px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, cx, cy)
}

export const initKnob = (
  canvas: HTMLCanvasElement,
  min: number,
  max: number,
  step: number,
  initial: number,
  onRelease: (v: number) => void
) => {
  const state: KnobState = { value: initial, min, max, step, onRelease }
  knobMap.set(canvas, state)
  drawKnob(canvas, state)

  let startY = 0
  let startValue = 0

  const onMouseMove = (e: MouseEvent) => {
    const delta = startY - e.clientY
    const range = max - min
    const newValue = Math.min(max, Math.max(min, startValue + (delta / 150) * range))
    const stepped = Math.round(newValue / step) * step
    state.value = Math.min(max, Math.max(min, stepped))
    drawKnob(canvas, state)
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    state.onRelease(state.value)
  }

  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    startY = e.clientY
    startValue = state.value
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    e.preventDefault()
  })
}

export const setKnobValue = (canvas: HTMLCanvasElement, value: number, fireCallback = false) => {
  const state = knobMap.get(canvas)
  if (!state) return
  state.value = Math.min(state.max, Math.max(state.min, value))
  drawKnob(canvas, state)
  if (fireCallback) state.onRelease(state.value)
}

export const getKnob = (action: string, osc?: string): HTMLCanvasElement => {
  const selector = osc
    ? `canvas.knob[data-action="${action}"][data-osc="${osc}"]`
    : `canvas.knob[data-action="${action}"]`
  return document.querySelector(selector) as HTMLCanvasElement
}
