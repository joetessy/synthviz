import type { AnalyserWrapper, AudioWrapper } from '../types'

const makeAnalyser = (context: AudioContext, _frequency: number): AnalyserWrapper => {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement
  const analyser = context.createAnalyser()
  analyser.fftSize = 4096
  analyser.smoothingTimeConstant = 0
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  const draw = (ctx: CanvasRenderingContext2D, freq: number) => {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height
    const dpr = window.devicePixelRatio || 1

    let color = '#ff00f7'
    if (freq > 300 && freq <= 400) {
      color = '#24ff00'
    } else if (freq > 400) {
      color = '#f8ff00'
    }

    analyser.getByteTimeDomainData(dataArray)

    let hasSignal = false
    for (let i = 0; i < bufferLength; i++) {
      if (Math.abs(dataArray[i] - 128) > 2) { hasSignal = true; break }
    }
    if (!hasSignal) return

    ctx.lineWidth = 3.5 * dpr
    ctx.strokeStyle = color
    ctx.beginPath()
    const pad = Math.ceil(ctx.lineWidth / 2) + Math.round(HEIGHT * 0.05)
    const usableHeight = HEIGHT - 2 * pad
    const sliceWidth = WIDTH / bufferLength
    let x = 0
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0
      const y = pad + (v / 2) * usableHeight
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      x += sliceWidth
    }
    ctx.lineTo(WIDTH, HEIGHT / 2)
    ctx.stroke()
  }

  return {
    analyser,
    input: analyser,
    output: analyser,
    draw,
    connect: (node: AudioWrapper | AudioNode | AudioParam) => {
      if ('input' in node) analyser.connect(node.input as AudioNode)
      else if (node instanceof AudioParam) analyser.connect(node)
      else analyser.connect(node as AudioNode)
    }
  }
}

export default makeAnalyser
