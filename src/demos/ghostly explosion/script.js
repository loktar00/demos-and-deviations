window.requestAnimFrame = (function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
      window.setTimeout(callback, 1000 / 60);
  };
})();

var numberOfObjects = 100,
  canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  objects = [],
  settings = {
      explosion : false
  },
  colorBg = {r : 0, g: 0, b : 0},
  colorFg = {r :255, g: 255, b: 255};

var imgToDraw = null,
  imageCanvas = null,
  iCtx = null,
  imageData = null,
  imagePixData = null,
  imgWidth = null,
  imgHeight = null;

var width = 600,
  height = 600;

canvas.width = width;
canvas.height = height;

for (var i = 0; i < numberOfObjects; i++) {
  objects.push({
      angle: Math.random() * 360,
      x: 200 + (Math.random() * 100),
      y: 120 + (Math.random() * 100),
      speed: 1 + Math.random() * 5
  });
}

function draw() {
  document.body.style.background = "rgb(" + colorBg.r + "," + colorBg.g + "," + colorBg.b + ")";
  var canvasData = ctx.createImageData(canvas.width, canvas.height),
      cData = canvasData.data;

  for (var nObject = 0; nObject < numberOfObjects; nObject++) {
      var entity = objects[nObject],
          velY = Math.cos(entity.angle * Math.PI / 180) * entity.speed,
          velX = Math.sin(entity.angle * Math.PI / 180) * entity.speed;

      entity.x += velX;
      entity.y -= velY;

      for (var w = 0; w < imgWidth; w++) {
          for (var h = 0; h < imgHeight; h++) {
              if (entity.x + w < width && entity.x + w > 0 && entity.y + h > 0 && entity.y + h < height) {

                  var iData = (h * imgWidth + w) * 4,
                      pData = (~~ (entity.x + w) + ~~ (entity.y + h) * width) * 4;

                  cData[pData] = colorFg.r;
                  cData[pData + 1] = colorFg.g;
                  cData[pData + 2] = colorFg.b;
                  if (imagePixData[iData + 3] !== 0) {
                      cData[pData + 3] = Math.max(cData[pData + 3] - imagePixData[iData + 3], imagePixData[iData + 3] - cData[pData + 3]);
                  }
              }
          }
      }

      entity.angle += 2 + Math.random() * 8;
  }
  ctx.putImageData(canvasData, 0, 0);
  window.requestAnimFrame(draw);
}

imgToDraw = new Image();
imgToDraw.crossOrigin = true;
imgToDraw.src = "https://i.imgur.com/jzdSkZd.png";

imgToDraw.onload = function () {
  imageCanvas = document.createElement("canvas"),
  iCtx = imageCanvas.getContext("2d");

  imageCanvas.width = this.width;
  imageCanvas.height = this.height;

  iCtx.drawImage(this, 0, 0);

  imageData = iCtx.getImageData(0, 0, this.width, this.height);
  imagePixData = imageData.data;

  imgWidth = this.width;
  imgHeight = this.height;

  draw();
};

var gui = new dat.GUI(),
  listener = gui.add(settings, 'explosion', false);
listener.onChange(function(value) {
  if(value){
      colorBg = {r : 180, g: 0, b : 0};
      colorFg = {r :255, g: 255, b: 0};
  }else{
      colorBg = {r : 0, g: 0, b : 0};
      colorFg = {r :255, g: 255, b: 255};
  }
});
