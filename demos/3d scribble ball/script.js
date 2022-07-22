function Line(points) {
    this.points = points || [];
    this.dist = 0;
}

Line.prototype.update = function () {
    for (var p = 0; p < this.points.length; p++) {
        this.points[p].rotateX(angleX);
        this.points[p].rotateY(angleY);
        this.points[p].map2D();
    }
}

Line.prototype.render = function () {
    ctx.beginPath();
    ctx.moveTo(this.points[0].xPos, this.points[0].yPos);
    for (var p = 1; p < this.points.length; p++) {
        ctx.lineTo(this.points[p].xPos, this.points[p].yPos);
    }

    this.dist = this.points[this.points.length-1].z;


    ctx.stroke();
};

function Point(pos) {
    this.x = pos.x || 0;
    this.y = pos.y || 0;
    this.z = pos.z || 0;

    this.cX = 0;
    this.cY = 0;
    this.cZ = 0;

    this.xPos = 0;
    this.yPos = 0;
    this.map2D();
}

Point.prototype.rotateX = function (angleX) {
    var cosX = Math.cos(angleX),
        sinX = Math.sin(angleX),
        y1 = this.y * cosX - this.z * sinX,
        z1 = this.z * cosX + this.y * sinX;

    this.y = y1;
    this.z = z1;
};

Point.prototype.rotateY = function (angleY) {
    var cosY = Math.cos(angleY),
        sinY = Math.sin(angleY),
        x1 = this.x * cosY - this.z * sinY,
        z1 = this.z * cosY + this.x * sinY;

    this.x = x1;
    this.z = z1;
};

Point.prototype.rotateZ = function (angleZ) {
    var cosZ = Math.cos(angleZ),
        sinZ = Math.sin(angleZ),
        x1 = this.x * cosZ - this.y * sinZ,
        y1 = this.y * cosZ + this.x * sinZ;

    this.x = x1;
    this.y = y1;
};

Point.prototype.map2D = function () {
    var scaleX = focal / (focal + this.z + this.cZ),
        scaleY = focal / (focal + this.z + this.cZ);

    this.xPos = vpx + (this.cX + this.x) * scaleX;
    this.yPos = vpy + (this.cY + this.y) * scaleY;
};

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = canvas.height = 512;

var lines = [],
    numLines = 20,
    focal = 256,
    vpx = canvas.width / 2,
    vpy = canvas.height / 2,
    angleX, angleY;

for (var i = 0; i < numLines; i++) {
    var points = [],
        rad = 100;

    points.push(new Point({
        x: 0,
        y: 0,
        z: 0
    }));

    for (var p = 0; p < 100; p++) {
        var lastP = points[points.length-1],
            ranPoint = randomSpherePoint(lastP.x,lastP.y,lastP.z,5);

        points.push(new Point({
            x: ranPoint.x,
            y: ranPoint.y,
            z: ranPoint.z
        }));
    }

    lines.push(new Line(points));
}

function randomSpherePoint(x0,y0,z0,radius){
   var u = Math.random(),
       v = Math.random(),
       theta = 2 * Math.PI * u,
       phi = Math.acos(2 * v - 1),
       x = x0 + (radius * Math.sin(phi) * Math.cos(theta)),
       y = y0 + (radius * Math.sin(phi) * Math.sin(theta)),
       z = z0 + (radius * Math.cos(phi));

   return {x : x, y : y, z : z};
}

function demo() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    angleX = (0 - vpy) * 0.0001;
    angleY = (0 - vpx) * 0.0001;

    lines.sort(function(a,b){
        return b.dist - a.dist;
    });

    for(var i = 0, len = lines.length; i < len; i++){
        lines[i].update();
        lines[i].render();
    }
    requestAnimationFrame(demo);
}

demo();