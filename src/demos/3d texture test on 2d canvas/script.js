var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    textureSrc = "http://i.imgur.com/kvduFUw.png",
    texImage = new Image();

texImage.crossOrigin = true;
texImage.src = textureSrc;

canvas.width = canvas.height = 500;

ctx.strokeStyle = "#fff";
var focalLength = 250,
    vpX = canvas.width / 2,
    vpY = canvas.height / 2,
    angle = 0;


function Poly(x, y, z, sx, sy, scaleX, scaleY, tex, tx, ty, tsx, tsy, tw, th) {
    this.xp = x;
    this.yp = y;
    this.zp = z;

    this.angle = Math.random() * 10;

    this.startX = this.xp;
    this.startY = this.yp;
    this.startZ = this.zp;

    this.sx = sx || 1;
    this.sy = sy || 1;

    this.scaleX = scaleX || 1;
    this.scaleY = scaleY || 1;

    this.x = 0;
    this.y = 0;

    // for texture mapping
    this.texture = tex;
    this.tx = tx;
    this.ty = ty;
    this.tsx = tsx;
    this.tsy = tsy;
    this.tw = tw;
    this.th = th;
}

Poly.prototype.rotate = function () {
    var x = this.startX * Math.cos(angleY) - this.startY * Math.sin(angleY),
        y = this.startY * Math.cos(angleY) + this.startX * Math.sin(angleY);

    this.xp = x;
    this.yp = y;
}


Poly.prototype.render = function () {
    this.rotate();
    if (this.zp > -focalLength) {
        var scale = focalLength / (focalLength + this.zp);

        this.x = vpX + this.xp * scale;
        this.y = vpY + this.yp * scale;

        var x0 = this.x - this.sx * this.scaleX * scale,
            x1 = this.x + this.sx * this.scaleX * scale,
            x2 = this.x - this.sx * this.scaleX * scale,
            y0 = this.y - this.sy * this.scaleY * scale,
            y1 = this.y - this.sy * this.scaleY * scale,
            y2 = this.y + this.sy * this.scaleY * scale;

        //ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();
        //ctx.fill();

        // calculate transformation matrix
        x1 -= x0;
        y1 -= y0;
        x2 -= x0;
        y2 -= y0;

        /*var u0 = this.tx,
            u1 = this.tx + (this.tsx * this.tw),
            u2 = this.tx,
            v0 = this.ty - this.tsy * this.th,
            v1 = this.ty - this.tsy * this.th,
            v2 = this.ty;*/

        var u0 = this.tx,
            u1 = this.tw,
            u2 = this.tx,
            v0 = this.th,
            v1 = this.th,
            v2 = this.ty;

        /*var u0 = this.tx - this.tsx * this.tw,
            u1 = this.tx + this.tsx * this.tw,
            u2 = this.tx - this.tsx * this.tw,
            v0 = this.ty - this.tsy * this.th,
            v1 = this.ty - this.tsy * this.th,
            v2 = this.ty + this.tsy * this.th;*/

        u1 -= u0;
        v1 -= v0;
        u2 -= u0;
        v2 -= v0;

        var id = 1 / (u1 * v2 - u2 * v1);
            a = id * (v2 * x1 - v1 * x2),
            b = id * (v2 * y1 - v1 * y2),
            c = id * (u1 * x2 - u2 * x1),
            d = id * (u1 * y2 - u2 * y1),
            e = x0 - a * u0 - c * v0,
            f = y0 - b * u0 - d * v0;

        // draw image
        ctx.save();
        ctx.transform(a, b, c, d, e, f);
        ctx.clip();
        ctx.drawImage(this.texture, this.tx, this.tx,this.th,this.tw);

        // restore previous state
        ctx.restore();

        this.visible = true;
    } else {
        this.visible = false;
    }
}

function Quad(x, y, z, scaleX, scaleY, texture, tx, ty, width, height) {
    this.scaleX = scaleX || 1;
    this.scaleY = scaleY || 1;

    this.polies = [
    new Poly(x, y, z, -1, 1, this.scaleX, this.scaleY, texture, tx, ty, -1, 1, width, height),
    new Poly(x, y, z, 1, -1, this.scaleX, this.scaleY, texture, tx, ty, 1, -1, width, height)];
}

Quad.prototype.render = function () {
    this.polies.forEach(function (el) {
        el.render();
    });
}


var grass = [],
    angle = 0,
    angleY = 180,
    angleX = 180,
    angleZ = 180;

grass.push(new Quad(100, 50, 100, 90, 90, texImage, 0, 0, 220, 226));


function render() {
    angle += 0.01
    angleY = Math.sin(angle);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    grass.forEach(function (el) {
        el.render();
    });
    requestAnimationFrame(render);
}

texImage.addEventListener("load", function () {
    render();
});