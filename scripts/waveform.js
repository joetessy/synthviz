export default function makeWaveForm({context, frequency}){
  let drawVisual;
  let canvas = document.querySelector('#canvas');
  let canvasContext = canvas.getContext('2d');
  let analyser = context.createAnalyser();
    analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  let WIDTH = canvas.width;
  let HEIGHT = canvas.height;

  let input = analyser,
      output = analyser;

  function draw(freq){

    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
    drawVisual = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    canvasContext.lineWidth = 2;

    canvasContext.strokeStyle = `rgb(0, 255, 237)`;
    // canvasContext.strokeStyle = `rgb(${a}, ${b}, ${c})`;
    canvasContext.beginPath();
    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;
    for(var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT / 2;
      if(i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }
      x += sliceWidth;
    }
    canvasContext.lineTo(canvas.width, canvas.height/2);
    canvasContext.stroke();
  }

  return {
    analyser,
    canvas,
    canvasContext,
    input,
    output,
    draw,
    calculateColor(frequency){

    },
    connect(node){
      if (node.hasOwnProperty('input')) {
        this.output.connect(node.input);
      } else {
        this.output.connect(node);
      }
    }
  };
}
