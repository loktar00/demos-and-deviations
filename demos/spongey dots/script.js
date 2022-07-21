(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d");

canvas.width = 517;
canvas.height = 291;

var points = [];

function Point(gx, gy, x, y) {
  this.x = x;
  this.y = y;
  this.gx = gx;
  this.gy = gy+1;
  this.t = 0;
  this.latT = 0;
  this.longAmp = ((this.gy*.2) * 2);
  this.latAmp = (this.gy*this.gy)*3 * .01;


  this.update = function () {
      this.t += 0.15;
      this.x -= Math.cos(this.t) * this.latAmp;
      this.y += Math.sin(this.t) * this.longAmp;
  }
}

for (var x = 0; x < 30; x++) {
  points[x] = [];
  for (var y = 0; y < 15; y++) {
      points[x][y] = new Point(x * .5, y*(y*.05), 30 + (30 - x) * 15, 50 + (15 - y) * 15);
      // lol ok this is really a hack.. its so bad but getting too close to the deadline!
      for (var i = 0; i < x % 30; i++) {
          points[x][y].update();
          points[x][y].update();

      }

  }
}


function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var x = 0; x < 30; x++) {
      for (var y = 0; y < 15; y++) {
          if (x == 15 && (y == 14 || y == 9)) {
              ctx.fillStyle = "blue";
          } else {
              ctx.fillStyle = "black";
          }
          var point = points[x][y];
          point.update();
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
          ctx.fill();
      }

  }
  requestAnimationFrame(render);
}

render();