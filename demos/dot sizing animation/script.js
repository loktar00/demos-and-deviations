var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

canvas.width = canvas.height = 1000;


var rows = 40,
    pos = (canvas.width/rows),
    rad = pos/2.1,
    inc = 0;


function render(){
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    for(var y = 0; y < rows; y++){
       for(var x = 0; x < rows; x++){
           ctx.save();
           ctx.translate((x*pos)+pos/2, (y*pos)+pos/2);
           ctx.moveTo(0,0);
           ctx.arc(0,0, rad, 0, Math.PI*2);
           ctx.restore();
       }
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    for(var y = 0; y < rows; y++){
       for(var x = 0; x < rows; x++){
           ctx.save();
           ctx.translate((x*pos)+pos/2, (y*pos)+pos/2);
           ctx.moveTo(0,0);
           ctx.arc(0,0, Math.abs(Math.cos(inc*0.5)*rad), 0, Math.PI*2);
           ctx.restore();
           inc+=(x+y)*0.1;
       }

    }
    ctx.closePath();
    ctx.fill();
    requestAnimationFrame(render);
}

render();