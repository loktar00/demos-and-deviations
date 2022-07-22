var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 500,
    height = 500,
    output = document.getElementById("output"),
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
    this.color = color || "rgb(255,0,0)";

    this.x -= this.radius / 2;
    this.y -= this.radius / 2;
}

Ball.prototype.update = function (x, y) {
    this.x = x;
    this.y = y;
    this.x -= this.radius / 2;
    this.y -= this.radius / 2;
};

Ball.prototype.render = function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
};

var ball1 = new Ball(width/2, height/2, 50, "rgb(0,0,255)");
    ball2 = new Ball(0,0,10);


// distance check
function distance(ent1, ent2){
    var x = ent2.x - ent1.x,
        y = ent2.y - ent1.y,
        dist = Math.sqrt(x*x + y*y),
        collision = false;

    // check the distance against the sum of both objects radius. If its less its a hit
    if(dist < ent1.radius + ent2.radius){
       collision = true;
    }

    output.textContent = dist + " " + ent2.x + " " + ent2.y;
    return collision;
}


function render() {
    ctx.clearRect(0, 0, width, height);
    ball2.update(mX, mY);

    // change the color if they collided
    if(distance(ball1, ball2)){
        ball1.color = "rgb(255,0,0)";
    }else{
        ball1.color = "rgb(0,0,255)";
    }

    ball1.render();
    ball2.render();
    if(started){
        requestAnimationFrame(render);
    }
}

render();