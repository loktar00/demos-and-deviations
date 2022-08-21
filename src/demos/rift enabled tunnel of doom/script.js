   // tunnel
   var leftEye = document.getElementById("left_eye"),
   rightEye = document.getElementById("right_eye")
   canvas = document.getElementById("canvas"),
   canvasR = document.getElementById("rcanvas"),
   ctx = canvas.getContext('2d'),
   ctxR = canvasR.getContext('2d'),
   width = 0,
   height = 0,
   perspective = 0,
   size = 20,
   angle = .42,
   moveAngle = 0,
   points = [];


var setPoint = function (x, y, z, color) {
   this.xp = x + Math.random() * 10;
   this.yp = y + Math.random() * 50;
   this.zp = z;
   this.x = this.y = this.z = 0;
   this.color = color;
   return this;
};

var addRing = function (xx, yy) {
   var x = (width / 2) * Math.cos(angle * yy),
       z = -50 + xx * 80,
       y = (height / 2) * Math.sin(angle * yy),
       gray = 100 + Math.random() * 100;
   points[xx * size + yy] = new setPoint(x, y, z, [100, Math.floor(Math.random() * 200), 200]);
}

// Set width/height
perspective = 250;


// render loop
function render() {
   ctx.fillStyle = "rgba(0,0,0,.1)";
   ctx.fillRect(0, 0, width, height);

   for (j = size - 1; j > -1; j--) {
       for (i = size - 1; i > -1; i--) {
           var point = points[j * size + i],
               px = point.xp,
               py = point.yp,
               pz = point.zp,
               color = point.color,
               cosY = Math.cos(.01),
               sinY = Math.sin(.01);

           point.zp -= 25;

           scl = perspective / (perspective + pz);

           point.y = (height / 2) + py * scl;
           point.x = (width / 2) + px * scl;

           point.x += Math.cos(moveAngle) * 20;
           point.y += Math.sin(moveAngle) * 50;

           if (j < size - 1 && i < size - 1 && pz > -250) {
               ctx.lineTo(Math.floor(points[((j + 1) * size) + i].x), Math.floor(points[((j + 1) * size) + i].y));
               ctx.lineTo(Math.floor(points[(j + 1) * size + (i + 1)].x), Math.floor(points[(j + 1) * size + (i + 1)].y));
               ctx.lineTo(Math.floor(points[(j * size) + (i + 1)].x), Math.floor(points[(j * size) + (i + 1)].y));
           }

           ctx.lineTo(point.x, point.y);
           var r = parseInt(color[0] - point.zp / 8),
               g = parseInt(color[1] - point.zp / 8),
               b = parseInt(color[2] - point.zp / 8),
               a = 255 - point.zp / 20;

           ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
           ctx.fill();
           ctx.beginPath();
       }
   }

   // Move points
  // moveAngle += 0.02;
   if (points[0].zp < -250) {
       points.splice(0, size);
       for (yy = 0; yy < size; yy++) {
           addRing(size - 1, yy);
       }
   }

   ctxR.drawImage(canvas,0,0);
   requestAnimationFrame(render);

}

width = canvas.width = canvasR.width = 256,
height = canvas.height = canvasR.height = 256;
canvas.style.width = '100%';
canvas.style.height = '100%';

canvasR.style.width = '100%';
canvasR.style.height = '100%';

for (yy = 0; yy < size; yy++) {
   for (xx = 0; xx < size; xx++) {
       addRing(xx, yy);
   }
}

render();
