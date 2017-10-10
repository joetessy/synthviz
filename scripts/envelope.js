export default function makeEnvelope({context}){
  let envelope = {
    // attackTime: 0,
    // releaseTime: .2,
    // sustainVal: 1,
    // decayTime: 1,
    envOn(attackTime, decayTime, sustainVal){
      let now = context.currentTime;
      this.param.cancelScheduledValues(now);
      this.param.setValueAtTime(0, now);
      this.param.linearRampToValueAtTime(1, now + attackTime);
      this.param.linearRampToValueAtTime(
        sustainVal, now + attackTime + decayTime);
    },
    envOff(releaseTime){
      let now = context.currentTime;
      this.param.cancelScheduledValues(0);
      this.param.setValueAtTime(0.5, now);
      this.param.linearRampToValueAtTime(0, now + releaseTime);
    },
    connect(param){
      this.param = param;
    }
  };
  return envelope;
}
