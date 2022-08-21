var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 500,
    height = 500,
    output = document.getElementById("radians"),
    output2 = document.getElementById("degrees"),
    mX = 0,
    mY = 0;

canvas.width = width;
canvas.height = height;

canvas.addEventListener("mousemove", function (e) {
    mX = e.x;
    mY = e.y;
});

var Ball = function (x, y, radius, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = radius || 10;
    this.speed = 5;
    this.color = color || "rgb(255,0,0)";

    this.velX = 0;
    this.velY = 0;
}

Ball.prototype.update = function (x, y) {
    // get the target x and y
    this.targetX = x;
    this.targetY = y;
    var x = this.targetX - this.x,
        y = this.targetY - this.y;

    output.textContent = Math.atan2(y,x);
    output2.textContent = Math.atan2(y,x)/Math.PI * 180
};

Ball.prototype.render = function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x-this.radius/2, this.y-this.radius/2, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
};

var ball1 = new Ball(width/2, height/2, 10);

function render() {
    ctx.clearRect(0, 0, width, height);
    ball1.update(mX, mY);
    ball1.render();
    requestAnimationFrame(render);
}

render();