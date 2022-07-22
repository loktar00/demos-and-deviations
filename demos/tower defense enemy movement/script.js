var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 500,
    height = 600,
    balls = [],
    targets = [
    {x : 450, y : 20},
    {x : 450, y : 150},
    {x : 20, y : 150},
    {x : 20, y : 250},
    {x : 450, y : 250},
    {x : 450, y : 350},
    {x : 20, y : 350},
    {x : 20, y : 450},
    {x : 450, y : 450},
    {x : 450, y : 550},
    {x : 20, y : 550},
    {x : 20, y : 20}
            ],
    started = false;

canvas.width = width;
canvas.height = height;

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
    this.speed = 3;
    this.color = color || "rgb(255,0,0)";

    this.pointLength = 20;
    this.px = 0;
    this.py = 0;

    this.target = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.velX = 0;
    this.velY = 0;
}

Ball.prototype.update = function () {
    // get the target x and y
    this.targetX = targets[this.target].x;
    this.targetY = targets[this.target].y;

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

    // Once we hit our target move on to the next.
    if (dist > this.radius/2) {
        // add our velocities
        this.x += this.velX;
        this.y += this.velY;
    }else{
        this.target++;
        if(this.target == targets.length){
            this.target = 0;
        }
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

for(var i = 0; i < 20; i++){
    balls.push(new Ball(20 - i * 30, 20, 10));
}

function render() {
    ctx.clearRect(0, 0, width, height);
    balls.forEach(function(el){
        el.update();
        el.render();
    });
    if(started){
        requestAnimationFrame(render);
    }
}

render();