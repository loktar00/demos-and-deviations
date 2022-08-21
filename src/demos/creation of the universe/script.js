(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();


var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    glowCanvas = document.getElementById("glowCanvas"),
    gCtx = glowCanvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight,
    vanishPointY = height / 2,
    vanishPointX = width / 2,
    focalLength = 300,
    angle = 0,
    angleY = 180,
    angleX = 180,
    angleZ = 180;

glowCanvas.width = width/4;
glowCanvas.height = height/4;
glowCanvas.style.width = width + 'px';
glowCanvas.style.height = height + 'px';

//gCtx.globalCompositeOperation = "lighter";
gCtx.fillStyle = "rgba(0,0,0,0.7)";

canvas.width = width;
canvas.height = height;

function Emitter() {
    var PART_NUM = 5000;

    this.particles = [];

    for (var i = 0; i < PART_NUM; i++) {
        this.particles.push(new Particle());
    }
}

Emitter.prototype.update = function () {
    var partLen = this.particles.length;
    angle+=0.01
    angleZ = Math.sin(angle);

    this.particles.sort(function (a, b) {
        return b.z - a.z;
    });

    for (var i = 0; i < partLen; i++) {
        var particle = this.particles[i];
        particle.update();
    }

}

Emitter.prototype.render = function () {
    var imgData = ctx.createImageData(width, height),
        data = imgData.data,
        partLen = this.particles.length;

    for (var i = 0; i < partLen; i++) {
        var particle = this.particles[i];
        if (particle.render && particle.xPos < width && particle.xPos > 0 && particle.yPos > 0 && particle.yPos < height) {
            for (var w = 0; w < particle.size; w++) {
                for (var h = 0; h < particle.size; h++) {
                    if (particle.xPos + w < width && particle.xPos + w > 0 && particle.yPos + h > 0 && particle.yPos + h < height) {
                        pData = (~~ (particle.xPos + w) + (~~ (particle.yPos + h) * width)) * 4;
                        data[pData] = particle.color[0];
                        data[pData + 1] = particle.color[1];
                        data[pData + 2] = particle.color[2];
                        data[pData + 3] = 255;
                    }
                }
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);

    gCtx.fillRect(0,0,glowCanvas.width, glowCanvas.height);
    gCtx.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,glowCanvas.width, glowCanvas.height);
}


/*
 *	Controls the individual particles
 */
function Particle() {
    this.x = (Math.random() * 5) - 2.5;
    this.y = (Math.random() * 5) - 2.5;
    this.z = (Math.random() * 5) - 2.5;

    this.startX = this.x;
    this.startY = this.y;
    this.startZ = this.z;

    this.xPos = 0;
    this.yPos = 0;

    this.angle = 0;

    this.dir = 0;

    this.vx = (Math.random() * 120) - 60;
    this.vy = (Math.random() * 120) - 60;
    this.vz = (Math.random() * 120) - 60;

    this.color = [~~ (255), ~~ (255), ~~ (Math.random()*255)]
    this.render = true;

    this.size = Math.round(1 + Math.random() * 1);
}

Particle.prototype.rotate = function () {
    var x = this.startX * Math.cos(angleZ) - this.startY * Math.sin(angleZ),
        y = this.startY * Math.cos(angleZ) + this.startX * Math.sin(angleZ);

    this.x = x;
    this.y = y;
}

Particle.prototype.update = function () {
    var cosY = Math.cos(angleX),
        sinY = Math.sin(angleX),
        x1 = this.x * cosY - this.z * sinY,
        z1 = this.z * cosY + this.x * sinY,
        dist = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));

    this.x = (this.startX += this.vx * (dist * .001));
    this.y = (this.startY += this.vy * (dist * .001));
    this.z = (this.startZ -= this.vz * (dist * .001));
    this.rotate();


    this.render = false;

    if (this.z > -focalLength) {
        var scale = focalLength / (focalLength + this.z);
        this.size = scale * 2;
        this.xPos = vanishPointX + this.x * scale;
        this.yPos = vanishPointY + this.y * scale;
        this.render = true;
    }
}

function render() {
    emitter.update();
    emitter.render();
    requestAnimationFrame(render);
}

var emitter = new Emitter();
setTimeout(function(){
    width = window.innerWidth;
    height = window.innerHeight;
    glowCanvas.width = width/4;
    glowCanvas.height = height/4;
    glowCanvas.style.width = width + 'px';
    glowCanvas.style.height = height + 'px';
    canvas.width = width;
    canvas.height = height;
    render();
},100)