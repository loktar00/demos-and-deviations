var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 500,
    height = 500,
    keys = [];

canvas.width = width;
canvas.height = height;

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});


var Ship = function (x, y, radius, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = radius || 10;

    this.isThrusting = false;
    this.thrust = 0.1;
    this.turnSpeed = 0.001;
    this.angle = 0;

    this.color = color || "rgb(255,0,0)";

    this.pointLength = 20;
    this.px = 0;
    this.py = 0;

    this.velX = 0;
    this.velY = 0;
}

Ship.prototype.turn = function(dir){
    this.angle += this.turnSpeed * dir;
};

Ship.prototype.update = function () {
    /*
    * Get the direction we are facing
    */
    var radians = this.angle/Math.PI*180;

    //lol wut
    if(this.isThrusting){
      this.velX += Math.cos(radians) * this.thrust;
      this.velY += Math.sin(radians) * this.thrust;
    }

    // bounds check
    if(this.x < this.radius){
        this.x = canvas.width;
    }
    if(this.x > canvas.width){
        this.x = this.radius;
    }
    if(this.y < this.radius){
        this.y = canvas.height;
    }
    if(this.y > canvas.height){
        this.y = this.radius;
    }

    // calc the point out in front of the ship
    this.px = this.x - this.pointLength * Math.cos(radians);
    this.py = this.y - this.pointLength * Math.sin(radians);

    // apply friction
    this.velX *= 0.98;
    this.velY *= 0.98;

    // apply velocities
    this.x -= this.velX;
    this.y -= this.velY;
};

Ship.prototype.render = function () {
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

var ship = new Ship(width/2, height/2, 10);

function render() {

    // check keys
    // up arrow or space
    ship.isThrusting = (keys[38] || keys[32]);

    if (keys[39]) {
        // right arrow
        ship.turn(1);
    }
    if (keys[37]) {
        // left arrow
       ship.turn(-1);
    }


    ctx.clearRect(0, 0, width, height);
    ship.update();
    ship.render();
    requestAnimationFrame(render);
}

render();