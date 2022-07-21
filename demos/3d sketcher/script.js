function Line(points, color) {
  this.points = points || [];
  this.dist = 0;
  color = color || {
      r: 0,
      g: 0,
      b: 0
  };
  this.color = 'rgb(' + ~~ (color.r) + ',' + ~~ (color.g) + ',' + ~~ (color.b) + ')';
}

Line.prototype.update = function () {
  for (var p = 0; p < this.points.length; p++) {
      this.points[p].rotateX(settings.xRotation);
      this.points[p].rotateY(settings.yRotation);
      this.points[p].rotateZ(settings.zRotation);
      this.points[p].map2D();

  }
}

Line.prototype.render = function () {
  ctx.strokeStyle = this.color;
  for (var p = 1; p < this.points.length; p++) {
      if (this.points[p].z > -(focal - 50)) {
          ctx.beginPath();
          ctx.moveTo(this.points[p - 1].xPos, this.points[p - 1].yPos);
          ctx.lineTo(this.points[p].xPos, this.points[p].yPos);
          ctx.stroke();
      }
  }

  this.dist = this.points[this.points.length - 1].z;

};

function Point(pos) {
  this.x = pos.x - canvas.width / 2 || 0;
  this.y = pos.y - canvas.height / 2 || 0;
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

canvas.width = window.innerWidth;
canvas.height = innerHeight;

var lines = [],
  focal = canvas.width / 2,
  vpx = canvas.width / 2,
  vpy = canvas.height / 2,
  settings = {
      xRotation: 0.01,
      yRotation: 0.01,
      zRotation: 0,
      strokeColor: {
          r: 0,
          g: 0,
          b: 0
      },
      rotateWhileDrawing: true,
      demoMode: true,
      clearScreen: function () {
          lines = [];
      }
  },
  painting = false,
  lastX = 0,
  lastY = 0,
  points = [],
  line = null;

function demo() {
  if (settings.demoMode) {
      if (Math.random() > 0.985) {
          line = null;
          points = [];
          settings.strokeColor = {
              r: ~~ (Math.random() * 255),
              g: ~~ (Math.random() * 255),
              g: ~~ (Math.random() * 255)
          }
      }

      if (!line) {
          line = new Line(points, settings.strokeColor);
          lines.push(line);

          line.points.push(new Point({
              x: (canvas.width / 4) + Math.random() * canvas.width/2,
              y: (canvas.height / 4) + Math.random() * canvas.height/2,
          }));
      }

      var lastPoint = line.points[line.points.length - 1];
      line.points.push(new Point({
          x: (lastPoint.x + canvas.width / 2) + 50 - Math.random() * 100,
          y: (lastPoint.y + canvas.height / 2) + 50 - Math.random() * 100
      }));
  }

  if (!painting || settings.rotateWhileDrawing) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.sort(function (a, b) {
          return b.dist - a.dist;
      });

      for (var i = 0, len = lines.length; i < len; i++) {
          lines[i].update();
          lines[i].render();
      }
  }
  requestAnimationFrame(demo);
}

canvas.addEventListener('mousedown', function (e) {
  settings.demoMode = false;

  if (!painting) {
      points = [];
      painting = true;
  } else {
      painting = false;
  }
  startX = e.pageX - this.offsetLeft;
  startY = e.pageY - this.offsetTop;

  lastX = startX;
  lastY = startY;
  line = new Line(points, settings.strokeColor);
  lines.push(line);
  line.points.push(new Point({
      x: lastX,
      y: lastY
  }));
});

canvas.addEventListener('mouseup', function (e) {
  painting = false;
  line = null;
});

canvas.addEventListener('mousemove', function (e) {
  if (painting) {
      mouseX = e.pageX - this.offsetLeft;
      mouseY = e.pageY - this.offsetTop;

      var color = settings.strokeColor;

      ctx.strokeStyle = 'rgb(' + ~~ (color.r) + ',' + ~~ (color.g) + ',' + ~~ (color.b) + ')';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();

      lastX = mouseX;
      lastY = mouseY;

      line.points.push(new Point({
          x: mouseX,
          y: mouseY,
          z: 0
      }));
  }
});

demo();

var gui = new dat.GUI();
gui.add(settings, 'xRotation', -0.1, 0.1);
gui.add(settings, 'yRotation', -0.1, 0.1);
gui.add(settings, 'zRotation', -0.1, 0.1);
gui.addColor(settings, 'strokeColor').listen();
gui.add(settings, 'rotateWhileDrawing');
gui.add(settings, 'demoMode').listen();
gui.add(settings, 'clearScreen');

setTimeout(function(){
  canvas.width = window.innerWidth;
  canvas.height = innerHeight;
  focal = canvas.width / 2;
  vpx = canvas.width / 2;
  vpy = canvas.height / 2;
},200);