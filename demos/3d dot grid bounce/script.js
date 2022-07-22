var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

canvas.width = canvas.height = 500;

var focalLength = 250,
    vpX = canvas.width / 2,
    vpY = canvas.height / 2,
    angle = 0;


function Ball(x, y, z) {
    this.xp = x;
    this.yp = y;
    this.zp = z;

    this.x = 0;
    this.y = 0;
}

Ball.prototype.render = function () {
    if (this.zp > -focalLength) {
        var scale = focalLength / (focalLength + this.zp);
        this.x = vpX + this.xp * scale;
        this.y = vpY + this.yp * scale;
        this.visible = true;
    } else {
        this.visible = false;
    }

    if (this.visible) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, scale*5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}


var balls = [];

for (var x = 0; x < 25; x++) {
    for (var y = 0; y < 10; y++) {
        balls.push(new Ball(-350+x * 50, y*10, -100 + y * 20));
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angle += 0.1;
    balls.forEach(function (element, index, array) {
        element.yp += Math.sin(angle)*10;
        element.render();
    });
    requestAnimationFrame(render);
}

render();