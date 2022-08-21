
var c=document.getElementById("canvas");
c.width =c.height = 300;
    var ctx=c.getContext("2d");
    var centerX = 150;
    var centerY = 150;
var offset = 0,
    yOffset = 0;

function render(){
    yOffset = 0;
    ctx.clearRect(0,0,300,300);
    ctx.moveTo(centerX, centerY);

    var STEPS_PER_ROTATION = 60;
    var increment = 0.08;
    var theta = increment;
    ctx.beginPath();
    offset+=0.2;
    while( theta < 10*Math.PI) {
      var newX = centerX + theta * Math.cos(theta+offset);
      var newY = centerY+(yOffset-=0.1) + theta * Math.sin(theta+offset);
      ctx.lineTo(newX, newY);
      theta = theta + increment;
    }
    ctx.stroke();
    ctx.closePath();
    requestAnimationFrame(render);
}

render();