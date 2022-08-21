var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 800,
    height = 800,
    mX = 0,
    mY = 0,
    started = false;

canvas.width = width;
canvas.height = height;

canvas.addEventListener("mousemove", function (e) {
    mX = e.pageX;
    mY = e.pageY;
});

canvas.addEventListener("mouseenter", function (e) {
    if(!started){
        started = true;
        render();
    }
});

canvas.addEventListener("mouseleave", function (e) {
    started = false;
});

var Ball = function (x, y, radius, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = radius || 10;
    this.speed = 20;
    this.color = color || "rgb(255,0,0)";

    this.x -= this.radius / 2;
    this.y -= this.radius / 2;
}

Ball.prototype.update = function (x, y) {
    // get the target x and y
    this.targetX = x;
    this.targetY = y;

    // move toward it
    this.x += (this.targetX-this.x)/this.speed;
    this.y += (this.targetY-this.y)/this.speed;
};

Ball.prototype.render = function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
};

var ball1 = new Ball(width/2, height/2, 10);

function render() {
    ctx.clearRect(0, 0, width, height);
    ball1.update(mX, mY);
    ball1.render();
    if(started){
        requestAnimationFrame(render);
    }
}

render();