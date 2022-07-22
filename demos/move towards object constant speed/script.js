var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 500,
    height = 500,
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
    this.speed = 5;
    this.color = color || "rgb(255,0,0)";

    this.pointLength = 50;
    this.px = 0;
    this.py = 0;

    this.velX = 0;
    this.velY = 0;
}

Ball.prototype.update = function (x, y) {
    // get the target x and y
    this.targetX = x;
    this.targetY = y;

    // We need to get the distance this time around
    var tx = this.targetX - this.x,
        ty = this.targetY - this.y,
        dist = Math.sqrt(tx * tx + ty * ty);

    /*
    * we calculate a velocity for our object this time around
    * divide the target x and y by the distance and multiply it by our speed
    * this gives us a constant movement speed.
    */

    this.velX = (tx / dist) * this.speed;
    this.velY = (ty / dist) * this.speed;

    /*
    * Get the direction we are facing
    * I just use -tx and -ty here because we already calculated tx and ty
    * To get the proper x and y you need to subtract the targets x and y from
    * our objects x and y
    */
    var radians = Math.atan2(-ty,-tx);

    this.px = this.x - this.pointLength * Math.cos(radians);
    this.py = this.y - this.pointLength * Math.sin(radians);

    // Stop once we hit our target. This stops the jittery bouncing of the object.
    if (dist > this.pointLength) {
        // add our velocities
        this.x += this.velX;
        this.y += this.velY;
    }
};

Ball.prototype.render = function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    // draw our circle with x and y being the center
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
    if(started){
        requestAnimationFrame(render);
    }
}

render();