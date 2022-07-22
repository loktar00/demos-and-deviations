var rcanvas = document.createElement("canvas"),
    rctx = rcanvas.getContext("2d");

rcanvas.width = rcanvas.height = 700;

var rad = 100
    total = 50,
    centerX = rcanvas.width/2
    centerY = rcanvas.height/2
    angle = 0,
    wave = 0;

for(var i = 0; i < total; i++){
  rctx.beginPath();
  rctx.save();
  rctx.translate(centerX,centerY);
  rctx.rotate(Math.PI/180 * (angle+= 360/total));
  rctx.moveTo(0,0);

  rctx.lineTo(rad-rad/30, rad+rad/30);
  rctx.lineTo(rad+rad/30, rad-rad/30);
  rctx.closePath();
  rctx.fill();
  rctx.restore();

}

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

canvas.width = canvas.height = 500;

angle = 0;

function render(){
    ctx.clearRect(0,0,canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(Math.PI/180 * Math.sin(wave+=0.2)*2);

    rctx.clearRect(0,0,700,700);

    for(var i = 0; i < total; i++){
      rctx.beginPath();
      rctx.save();
      rctx.translate(centerX,centerY);
      rctx.rotate(Math.PI/180 * (angle+= 360/total));
      rctx.moveTo(0,0);

      rctx.lineTo(rad-rad/30, rad+rad/30);
      rctx.lineTo(rad+rad/30, rad-rad/30);
      rctx.closePath();
      rctx.fill();
      rctx.restore();
    }

    ctx.drawImage(rcanvas,0,0,700,700,-300,-300,600,600);
    ctx.restore();


    requestAnimationFrame(render);
}

render();