type KnobState = {
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
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

  const fillColor  = canvas.dataset.color      ?? '#ff00f7'
  const trackColor = canvas.dataset.track      ?? '#333'
  const textColor  = canvas.dataset.labelColor ?? 'white'

  ctx.clearRect(0, 0, w, h)

  ctx.beginPath()
  ctx.arc(cx, cy, r, START, START + SWEEP)
  ctx.strokeStyle = trackColor
  ctx.lineWidth = 4
  ctx.stroke()

  if (ratio > 0) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, START, START + SWEEP * ratio)
    ctx.strokeStyle = fillColor
    ctx.lineWidth = 4
    ctx.stroke()
  }

  const decimals = state.step >= 1 ? 0 : Math.max(0, Math.ceil(-Math.log10(state.step)))
  const label = value.toFixed(decimals)
  ctx.fillStyle = textColor
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
  onChange: (v: number) => void,
  onRelease?: (v: number) => void
) => {
  const state: KnobState = {
    value: initial,
    min,
    max,
    step,
    onChange,
    onRelease: onRelease ?? onChange
  }
  knobMap.set(canvas, state)
  drawKnob(canvas, state)

  let startY = 0
  let startX = 0
  let startValue = 0
  let touchIntent: 'unknown' | 'knob' | 'scroll' = 'unknown'

  const onMouseMove = (e: MouseEvent) => {
    const delta = startY - e.clientY
    const range = max - min
    const newValue = Math.min(max, Math.max(min, startValue + (delta / 150) * range))
    const stepped = Math.round(newValue / step) * step
    state.value = Math.min(max, Math.max(min, stepped))
    drawKnob(canvas, state)
    state.onChange(state.value)
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

  canvas.addEventListener('touchstart', (e: TouchEvent) => {
    startY = e.touches[0].clientY
    startX = e.touches[0].clientX
    startValue = state.value
    touchIntent = 'unknown'
  }, { passive: true })

  canvas.addEventListener('touchmove', (e: TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - startX)
    const dy = Math.abs(e.touches[0].clientY - startY)

    if (touchIntent === 'unknown') {
      touchIntent = dx > dy ? 'scroll' : 'knob'
    }

    if (touchIntent === 'scroll') return

    e.preventDefault()
    const delta = startY - e.touches[0].clientY
    const range = max - min
    const newValue = Math.min(max, Math.max(min, startValue + (delta / 150) * range))
    const stepped = Math.round(newValue / step) * step
    state.value = Math.min(max, Math.max(min, stepped))
    drawKnob(canvas, state)
    state.onChange(state.value)
  }, { passive: false })

  canvas.addEventListener('touchend', () => {
    if (touchIntent === 'knob') state.onRelease(state.value)
    touchIntent = 'unknown'
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

export const getKnobValue = (canvas: HTMLCanvasElement): number =>
  knobMap.get(canvas)?.value ?? 0

export const redrawKnob = (canvas: HTMLCanvasElement): void => {
  const state = knobMap.get(canvas)
  if (state) drawKnob(canvas, state)
}
