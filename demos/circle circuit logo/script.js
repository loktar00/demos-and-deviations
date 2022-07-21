// setup stuff.
var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight;

canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

function Branch(settings) {
    settings = settings || {};
    this.cX = settings.cX || centerX;
    this.cY = settings.cY || centerY;
    this.rad = rad;
    this.rot = settings.rot || Math.random() * 360;
    this.angle = settings.angle || 0;

    this.x1 = settings.x || 0;
    this.y1 = settings.y || 0;
    this.x2 = 0;
    this.y2 = 0;

    this.height = 0;
    this.maxHeight = 15 + Math.random() * 50;
    this.speed = 1 + Math.random();
}

Branch.prototype.render = function () {
    if (this.height < this.maxHeight) {
        this.height += this.speed;
        var tx = this.x1 - this.height,
            ty = this.y1 - this.height;

        this.x2 = tx + this.height * Math.cos(this.angle);
        this.y2 = ty + this.height * Math.sin(this.angle);

        if (Math.random() > 0.99) {
            branches.push(new Branch({
                x: this.x2,
                y: this.y2,
                rot: this.rot,
                angle: this.angle - 1.57
            }));
        }
    }

    ctx.save();
        ctx.translate(this.cX, this.cY);
        ctx.rotate(this.rot + globalRot);
        ctx.translate(0, -this.rad);
        ctx.beginPath();
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);
        ctx.closePath();
        ctx.stroke();

        if (this.height >= this.maxHeight) {
            ctx.beginPath();
            ctx.arc(this.x2, this.y2, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    ctx.restore();
};

var branches = [],
    branchNum = 10,
    centerX = width / 2,
    centerY = height / 2,
    rad = 50,
    globalRot = 0;

for (var b = 0; b < branchNum; b++) {
    branches.push(new Branch({
        cX: centerX,
        cY: centerY,
        rad: rad
    }));
}

ctx.strokeStyle = "#fff";
ctx.fillStyle = "#fff";


function render() {
    globalRot += 0.001;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, rad, 0, Math.PI * 2, 0);
    ctx.stroke();

    ctx.lineWidth = 4;
    for (var b = 0; b < branches.length; b++) {
        branches[b].render();
    }
    requestAnimationFrame(render);
}

render();