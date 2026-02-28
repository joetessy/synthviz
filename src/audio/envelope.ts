import type { EnvelopeController } from '../types'

const makeEnvelope = (context: AudioContext): EnvelopeController => {
  let param: AudioParam | null = null
  return {
    envOn: (attackTime: number, decayTime: number, sustainVal: number, amplitude: number) => {
      if (!param) return
      const now = context.currentTime
      param.cancelScheduledValues(now)
      param.setValueAtTime(0, now)
      param.linearRampToValueAtTime(amplitude, now + attackTime)
      param.linearRampToValueAtTime(amplitude * sustainVal, now + attackTime + decayTime)
    },
    envOff: (releaseTime: number) => {
      if (!param) return
      const now = context.currentTime
      param.cancelScheduledValues(0)
      param.setValueAtTime(param.value, now)
      param.linearRampToValueAtTime(0, now + releaseTime)
    },
    connect: (p: AudioParam) => { param = p }
  }
}

export default makeEnvelope
