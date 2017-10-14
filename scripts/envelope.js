export default function makeEnvelope({context}){
  let envelope = {

    envOn(attackTime, decayTime, sustainVal, amplitude){
      console.log('amplitude is ' + amplitude);
      console.log('sustainVal is ' + sustainVal);
      console.log('amp * sustain is ' + amplitude * sustainVal);
      let now = context.currentTime;
      this.param.cancelScheduledValues(now);
      this.param.setValueAtTime(0, now);
      this.param.linearRampToValueAtTime(amplitude, now + attackTime);
      this.param.linearRampToValueAtTime(
        (amplitude * sustainVal), now + attackTime + decayTime);
    },

    envOff(releaseTime){
      let now = context.currentTime;
      this.param.cancelScheduledValues(0);
      this.param.setValueAtTime(this.param.value, now);
      this.param.linearRampToValueAtTime(0, now + releaseTime);
    },
    connect(param){
      this.param = param;
    }
  };
  return envelope;
}
