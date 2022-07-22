var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 506,
    height = 131;

canvas.width = width;
canvas.height = height;

function Point(x,y){
  this.x = x;
  this.y = y;
  this.freq = -this.x;
  this.amp = 1.2;

  this.update = function(){
    this.freq+=this.amp;
    this.x += Math.sin(this.freq*Math.PI/35)*0.5;
  }
}

var points = [];
for(var i = 0; i < 800; i++){
  points.push(new Point(15 + Math.random()*width, Math.random()*height));
}

var box = {
  x : 5,
  y : 0,
  height : height,
  width : 5,
  freq : -10,
  amp : 1.2,
  update : function(){
    this.freq+=this.amp;
    this.x += Math.sin(this.freq*Math.PI/35)*0.5;
  }
}

function render(){
  ctx.clearRect(0,0,width,height);
  ctx.fillStyle = "#ff0000";
  box.update();
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.fillStyle = "#000";
  for(var p = 0; p < points.length; p++){
    points[p].update();
    ctx.beginPath();
    ctx.arc(points[p].x, points[p].y,2.5,0, Math.PI * 2, true );
    ctx.closePath();
    ctx.fill();
  }
  requestAnimationFrame(render);
}

render();