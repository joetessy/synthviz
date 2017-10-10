export default function makeEnvelope({context}){
  return {
    attackTime: 0.1,
    releaseTime: 0.1,
    trigger(){
      let now = context.currentTime;
      this.param.cancleSchduledValues(now);
      this.param.setValueAtTime(0, now);
      this.param.linearRampToValueAtTime(1, now + this.attackTime);
      this.param.linearRampToValueAtTime(0, now +
        this.attackTime + this.releaseTime);
    },
    connect(param){
      this.param = param;
    }
  };
}
