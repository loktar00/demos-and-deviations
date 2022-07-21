(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  imgBox = document.getElementsByClassName('img-box')[0];

canvas.width = 854;
canvas.height = 480;

var mapData = [],
  settings = {
      Burns: 500,
      Color: false
  },
  img1 = new Image(),
  img2 = document.getElementsByTagName('img')[0];

function init() {
  for (var x = 0; x <= canvas.width; x++) {
      mapData[x] = [];
      for (var y = 0; y <= canvas.height; y++) {
          mapData[x][y] = {
              val: 5 + ~~ (Math.random() * 15),
              neighbors: true
          };
      }
  }

  for (var i = 0; i < settings.Burns; i++) {
      mapData[~~ (Math.random() * canvas.width)][~~ (Math.random() * canvas.height)].val = 0;
  }

  burn();
}

function burnEdges(x, y, data) {
  var neighbors = false;
  for (var xx = x - 1; xx <= x + 1; xx++) {
      for (var yy = y - 1; yy <= y + 1; yy++) {
          if (!(xx == x && yy == y) && (xx > -1 && xx < canvas.width + 1 && yy > -1 && yy < canvas.height + 1)) {
              if (mapData[xx][yy].val > 0) {
                  neighbors = true;
                  mapData[xx][yy].val -= 2;
                  if (settings.Color) {
                      var pix = (xx + yy * canvas.width) * 4;
                      data[pix] = 250;
                      data[pix + 1] = 80;
                      data[pix + 2] = 0;
                  }
              }
          }
      }
  }

  if (!neighbors) {
      mapData[x][y].neighbors = false;
  }
}

function burn() {
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height),
      data = imgData.data,
      pix = null,
      flag = true;

  for (var x = 0; x <= canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
          pix = (x + y * canvas.width) * 4;
          if (mapData[x][y].val <= 0) {
              if (mapData[x][y].neighbors) {
                  burnEdges(x, y, data);
              }
              data[pix + 3] = 0;
          } else {
              flag = false;
          }
      }
  }
  ctx.putImageData(imgData, 0, 0);
  if (!flag) {
      requestAnimationFrame(burn);
  } else {
      swap();
  }
}

function swap() {
  var src = img1.src;
  img1.src = img2.src;
  img2.src = src;
}

img1.onload = function () {
  ctx.drawImage(img1, 0, 0);
  //imgBox.appendChild(img2);
  init();
}
img1.crossOrigin = "Anonymous";
img1.src = "./Z6YcTrI.png";

img2.crossOrigin = "Anonymous";
img2.src = "./nY670Qj.png";

var gui = new dat.GUI();
gui.add(settings, 'Burns', 1, 1000);
gui.add(settings, 'Color');
gui.close();