export default function makeWaveForm({context, frequency}){
  let drawVisual;
  let canvas = document.querySelector('#canvas');
  let analyser = context.createAnalyser();
    analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  let WIDTH = canvas.width;
  let HEIGHT = canvas.height;

  let input = analyser,
      output = analyser;

  function draw(ctx, freq){
    let color = 'blue';
    // if (freq < 270){
    //   color = '#fd0000';
    // }else if (freq >= 270 && freq <= 300 ){
    //   color = '#ff9b00';
    // } else if (freq > 300 && freq < 350){
    //   color = '#f5fe01';
    // } else if (freq >= 350 && freq <= 400){
    //   color = '#3bf00c';
    // } else if (freq > 400 && freq <= 500){
    //   color = '#0024ff';
    // } else if (freq > 500){
    //   color = '#c500ff';
    // }

    analyser.getByteTimeDomainData(dataArray);
    ctx.lineWidth = 1.8;

    ctx.strokeStyle = color;
    ctx.beginPath();
    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;
    for(var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT / 2;
      if(i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();
  }

  return {
    analyser,
    input,
    output,
    draw,

    connect(node){
      if (node.hasOwnProperty('input')) {
        this.output.connect(node.input);
      } else {
        this.output.connect(node);
      }
    }
  };
}
