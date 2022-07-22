(function(){
    var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    balls = [];

canvas.width = 600;
canvas.height = 400;

var ball = function(){
    this.x = Math.random()*10;
    this.y= Math.random()*400;
    this.speed =(Math.random()*20)*.1;
    this.force = -this.speed*10;
    this.curForce = this.force;
};

ball.prototype.update = function(){
    this.x +=this.speed;
    this.y += this.curForce+=0.1;

    if(this.y >= 400){
        this.curForce = this.force;
    }
};

ball.prototype.render = function(){
   ctx.beginPath();
   ctx.arc(this.x,this.y,5,0,360);
   ctx.fill();
};


function init(){
    for(var i = 0; i < 10; i++){
        balls.push(new ball());
    }
    tick();
};


function tick(){
    ctx.clearRect(0,0,600,400);
    var i = 10;
    while(i--){
       balls[i].update();
       balls[i].render();
    }

    setTimeout(tick, 10);
};

init();
})();




