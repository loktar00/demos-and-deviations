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

    // makes our x and y the center of the circle.
    this.x = (this.x-this.radius/2);
    this.y = (this.y-this.radius/2);

    // how far out do we want the point
    this.pointLength = 50;
    this.px = 0;
    this.py = 0;


    this.color = color || "rgb(255,0,0)";
}

Ball.prototype.update = function (x, y) {
    // get the target x and y
    this.targetX = x;
    this.targetY = y;

    var x = this.x - this.targetX,
        y = this.y - this.targetY,
        radians = Math.atan2(y,x);

    this.px = this.x - this.pointLength * Math.cos(radians);
    this.py = this.y - this.pointLength * Math.sin(radians);

    // -y will make 0 the top, y will 0 us at the bottom.
    output.textContent = radians;
    output2.textContent = radians/Math.PI * 180
};

Ball.prototype.render = function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgb(0,0,255)";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.px, this.py);
    ctx.closePath();
    ctx.stroke();
};

var ball1 = new Ball(width/2, height/2, 10);

function render() {
    ctx.clearRect(0, 0, width, height);
    ball1.update(mX, mY);
    ball1.render();
    requestAnimationFrame(render);
}

render();