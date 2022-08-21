var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 500,
    height = 500;

canvas.width = width;
canvas.height = height;


ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.strokeStyle = "#fff";
ctx.lineWidth = 2;

var waves = [];

for(var w =18; w > 9; w-=0.5){
  waves.push({amp : (w*0.015), freq : 0, move : 0});
}

function render(){
  ctx.fillRect(0,0,canvas.width,canvas.height);
  for(w = 0; w < waves.length; w++){
    var i = w+4,
        wave = waves[w];

    ctx.beginPath();
    ctx.moveTo(width,Math.sin(wave.freq*Math.PI/i));
    for(var x = width; x >=0; x--){
      var y = Math.sin(wave.freq*Math.PI/i);
      wave.freq += wave.amp;
      ctx.lineTo(x,((w)*29) + y*14);
    }
    wave.move += (i*0.1);
    wave.freq = wave.move;
    ctx.stroke();
  }
  requestAnimationFrame(render);
}

render();