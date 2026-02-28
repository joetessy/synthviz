import type { AnalyserWrapper, AudioWrapper } from '../types'

const makeAnalyser = (context: AudioContext, _frequency: number): AnalyserWrapper => {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement
  const analyser = context.createAnalyser()
  analyser.fftSize = 2048
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  const WIDTH = canvas.width
  const HEIGHT = canvas.height

  const draw = (ctx: CanvasRenderingContext2D, freq: number) => {
    let color = '#ff00f7'
    if (freq > 300 && freq <= 400) {
      color = '#24ff00'
    } else if (freq > 400) {
      color = '#f8ff00'
    }

    analyser.getByteTimeDomainData(dataArray)
    ctx.lineWidth = 1.8
    ctx.strokeStyle = color
    ctx.beginPath()
    const sliceWidth = WIDTH * 1.0 / bufferLength
    let x = 0
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0
      const y = v * HEIGHT / 2
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      x += sliceWidth
    }
    ctx.lineTo(canvas.width, canvas.height / 2)
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
