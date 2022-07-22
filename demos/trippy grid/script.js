var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 500,
    height = 500;

canvas.width = width;
canvas.height = height;

ctx.strokeStyle = "#fff";
ctx.lineWidth =2;

var swap = true,
    spacing = 8,
    gridSize = Math.ceil((width/spacing)*2),
    lastTime = new Date().getTime(),
    minTime = 30;

function render(){
  ctx.fillRect(0,0,width,height);
  for(var i = -gridSize; i < gridSize; i++){
    if(swap){
        ctx.beginPath();
        ctx.moveTo(0,i*spacing);
        ctx.lineTo(i*spacing,0);
        ctx.closePath();
        ctx.stroke();
    }else{
        ctx.beginPath();
        ctx.moveTo(0,i*spacing);
        ctx.lineTo(width,height+(i*spacing));
        ctx.closePath();
        ctx.stroke();
    }
  }

  if(lastTime + minTime < new Date().getTime() ){
    lastTime = new Date().getTime();
    swap = !swap;
  }

  requestAnimationFrame(render);
}

render();