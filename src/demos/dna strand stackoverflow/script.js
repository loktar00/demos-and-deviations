(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d");

ctx.lineWidth = 4;

// Color stuff not real important just fluff
var cycle = 0,
  colors = {
      r: 0,
      g: 170,
      b: 0
  };

function colorCycle(inc) {
  cycle += inc;
  if (cycle > 100) {
      cycle = 0;
  }
  colors.r = ~~ (Math.sin(.3 * cycle + 0) * 127 + 128);
  colors.g = ~~ (Math.sin(.3 * cycle + 2) * 127 + 128);
  colors.b = ~~ (Math.sin(.3 * cycle + 4) * 127 + 128);
}

// Sections and points

function Point(x, y, z, size) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.xpos = 0;
  this.ypos = 0;
  this.size = 5;

  rotateY(this,angle+=0.1);
}

function Section(x, y, z, width) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.width = width;
  this.points = [];
  this.points.push(new Point(this.x - this.width / 2, this.y, this.z, 20));
  this.points.push(new Point(this.x + this.width / 2, this.y, this.z, 20));

  this.render = function (angleX, angleY) {
      ctx.beginPath();
      for (var p = 0; p < this.points.length; p++) {
          var point = this.points[p];

          rotateX(point, angleX);
          rotateY(point, angleY);
          doPerspective(point);

          ctx.arc(point.xpos, point.ypos, point.size, 0, Math.PI * 2, true);

          if (p == 0) {
              ctx.moveTo(this.points[0].xpos, this.points[0].ypos);
          } else {
              ctx.lineTo(point.xpos, point.ypos);
          }
      }

      ctx.closePath();
      ctx.stroke();
      ctx.fill();
  }
}

// 3d Functions for rotation and perspective
function rotateX(point, angleX) {
  var cosX = Math.cos(angleX),
      sinX = Math.sin(angleX),
      y1 = point.y * cosX - point.z * sinX,
      z1 = point.z * cosX + point.y * sinX;
  point.y = y1;
  point.z = z1;
}

function rotateY(point, angleY) {
  var cosY = Math.cos(angleY),
      sinY = Math.sin(angleY),
      x1 = point.x * cosY - point.z * sinY,
      z1 = point.z * cosY + point.x * sinY;
  point.x = x1;
  point.z = z1;
}

function doPerspective(point) {
  if (point.z > -fl) {
      var scale = fl / (fl + point.z);
      point.size = scale * 5;
      point.xpos = vpX + point.x * scale;
      point.ypos = vpY + point.y * scale;
  }
}

// Init code
var sections = [],
  numSections = 50,
  fl = 250,
  vpX,
  vpY,
  angle = 0;


// make some sections
for (var i = 0; i < numSections; i++) {
  sections.push(new Section(0, -250 + (i * 10), 0, 50));
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  colorCycle(0.1);
  ctx.fillStyle = "rgb(" + colors.r + "," + colors.g + "," + colors.b + ")";
  ctx.strokeStyle = "rgb(" + colors.r + "," + colors.g + "," + colors.b + ")";
  for (var i = 0; i < sections.length; i++) {
      sections[i].render(0, 0.03);
  }
  requestAnimationFrame(render);
}

setTimeout(function () {
  canvas.width = window.innerWidth,
  canvas.height = document.body.offsetHeight;
  vpX = canvas.width / 2;
  vpY = canvas.height / 2;
  render();
},110);