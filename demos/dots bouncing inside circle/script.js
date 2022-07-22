var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 600,
    height = 600;

canvas.width = width;
canvas.height = height;

var boundaryRadius = 300,
    boundaryX = 300,
    boundaryY = 300;

var Ball = function (x, y, speed) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = 10;
    this.speed = speed || 10;
    this.color = "rgb(255,0,0)";
    this.angle = Math.random() * 360;
    this.radians = this.angle * Math.PI/ 180;
    this.velX = 0;
    this.velY = 0;
}

Ball.prototype.update = function () {
    var dx = boundaryX - this.x,
        dy = boundaryY - this.y,
        dist = Math.sqrt(dx * dx + dy * dy);

    this.radians = this.angle * Math.PI/ 180;
    this.velX = Math.cos(this.radians) * this.speed;
    this.velY = Math.sin(this.radians) * this.speed;

    // check if we are still inside of our boundary.
    if (dist < boundaryRadius-this.radius) {
        this.x += this.velX;
        this.y += this.velY;
    } else {
        // collision, step back and choose an opposite angle with a bit of randomness.
        this.x -= this.velX;
        this.y -= this.velY;
        this.angle += 180+Math.random()*45;
    }
};

Ball.prototype.render = function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    // draw our circle with x and y being the center
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.px, this.py);
    ctx.closePath();
};

var balls = [],
    ballNum = 3;

for(var i = 0; i < ballNum; i++){
    balls.push(new Ball(boundaryX + Math.random()*30, boundaryY + Math.random() * 30,  5));
}


function drawAngles() {
    var d = 50; //start line at (10, 20), move 50px away at angle of 30 degrees
    var angle = 80 * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(300, 0);
    ctx.lineTo(300, 600); //x, y
    ctx.moveTo(0, 300);
    ctx.lineTo(600, 300);
    ctx.arc(boundaryX, boundaryY, boundaryRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#000";
    ctx.stroke();
}


function render() {
    ctx.clearRect(0, 0, width, height);
    drawAngles();

    balls.forEach(function(e){
        e.update();
        e.render();
    });

    requestAnimationFrame(render);
}

render();