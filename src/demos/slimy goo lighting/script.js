function generateTerrainMap(mapDimension, unitSize, roughness) {
  "use strict";

  var map = create2DArray(mapDimension+1, mapDimension+1);
  startDisplacement(map, mapDimension);
  return map;

  // Setup the map array for use
  function create2DArray(d1, d2) {
      var data = [],
          x = 0,
          y = 0;

      for (x = 0; x < d1; x ++) {
          data[x] = [];
          for (y = 0; y < d2; y ++) {
              data[x][y] = 0;
          }
      }
      return data;
  }

  // Starts off the map generation, seeds the first 4 corners
  function startDisplacement(map, mapDimension){
      var topRight = 0,
          topLeft = 0,
          bottomRight = 0,
          bottomLeft = 0,
          center = 0;

      // top left
      map[0][0] = Math.random();
      topLeft = map[0][0];

      // bottom left
      map[0][mapDimension] = Math.random();
      bottomLeft = map[0][mapDimension];

      // top right
      map[mapDimension][0] = Math.random();
      topRight = map[mapDimension][0];

      // bottom right
      map[mapDimension][mapDimension] = Math.random();
      bottomRight = map[mapDimension][mapDimension];

      // Center
      map[mapDimension / 2][mapDimension / 2] = map[0][0] + map[0][mapDimension] + map[mapDimension][0] + map[mapDimension][mapDimension] / 4;
      map[mapDimension / 2][mapDimension / 2] = normalize(map[mapDimension / 2][mapDimension / 2]);
      center = map[mapDimension / 2][mapDimension / 2];

      /* Non wrapping terrain */
      map[mapDimension / 2][mapDimension] = bottomLeft + bottomRight + center / 3;
      map[mapDimension / 2][0] = topLeft + topRight + center / 3;
      map[mapDimension][mapDimension / 2] = topRight + bottomRight + center / 3;
      map[0][mapDimension / 2] = topLeft + bottomLeft + center / 3;

      /*Wrapping terrain */

      /*map[mapDimension / 2][mapDimension] = bottomLeft + bottomRight + center + center / 4;
      map[mapDimension / 2][0] = topLeft + topRight + center + center / 4;
      map[mapDimension][mapDimension / 2] = topRight + bottomRight + center + center / 4;
      map[0][mapDimension / 2] = topLeft + bottomLeft + center + center / 4;*/


      // Call displacment
      midpointDisplacment(mapDimension);
  }

  // Workhorse of the terrain generation.
  function midpointDisplacment(dimension){
      var newDimension = dimension / 2,
          topRight = 0,
          topLeft = 0,
          bottomLeft = 0,
          bottomRight = 0,
          center = 0,
          x = 0, y = 0,
          i = 0, j = 0;

      if (newDimension > unitSize){
          for(i = newDimension; i <= mapDimension; i += newDimension){
              for(j = newDimension; j <= mapDimension; j += newDimension){
                  x = i - (newDimension / 2);
                  y = j - (newDimension / 2);

                  topLeft = map[i - newDimension][j - newDimension];
                  topRight = map[i][j - newDimension];
                  bottomLeft = map[i - newDimension][j];
                  bottomRight = map[i][j];

                  // Center
                  map[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(dimension);
                  map[x][y] = normalize(map[x][y]);
                  center = map[x][y];

                  // Top
                  if(j - (newDimension * 2) + (newDimension / 2) > 0){
                      map[x][j - newDimension] = (topLeft + topRight + center + map[x][j - dimension + (newDimension / 2)]) / 4 + displace(dimension);
                  }else{
                      map[x][j - newDimension] = (topLeft + topRight + center) / 3 + displace(dimension);
                  }

                  map[x][j - newDimension] = normalize(map[x][j - newDimension]);

                  // Bottom
                  if(j + (newDimension / 2) < mapDimension){
                      map[x][j] = (bottomLeft + bottomRight + center + map[x][j + (newDimension / 2)]) / 4 + displace(dimension);
                  }else{
                      map[x][j] = (bottomLeft + bottomRight + center) / 3 + displace(dimension);
                  }

                  map[x][j] = normalize(map[x][j]);

                  //Right
                  if(i + (newDimension / 2) < mapDimension){
                      map[i][y] = (topRight + bottomRight + center + map[i + (newDimension / 2)][y]) / 4 + displace(dimension);
                  }else{
                      map[i][y] = (topRight + bottomRight + center) / 3 + displace(dimension);
                  }

                  map[i][y] = normalize(map[i][y]);

                  // Left
                  if(i - (newDimension * 2) + (newDimension / 2) > 0){
                      map[i - newDimension][y] = (topLeft + bottomLeft + center + map[i - dimension + (newDimension / 2)][y]) / 4 + displace(dimension);
                  }else{
                      map[i - newDimension][y] = (topLeft + bottomLeft + center) / 3 + displace(dimension);
                  }

                  map[i - newDimension][y] = normalize(map[i - newDimension][y]);
              }
          }
          midpointDisplacment(newDimension);
      }
  }

  // Random function to offset the center
  function displace(num){
      var max = num / (mapDimension + mapDimension) * roughness;
      return (Math.random() - 0.5) * max;
  }

  // Normalize the value to make sure its within bounds
  function normalize(value){
      return Math.max(Math.min(value, 1), 0);
  }
}

var mapDimension = 512,
  unitSize = 1,
  heightCanvas = document.createElement("canvas"),
  mapCanvas = document.getElementById('canvas'),
  mapCtx = mapCanvas.getContext("2d"),
  hCtx = heightCanvas.getContext("2d"),
  shadowCanvas = document.createElement("canvas"),
  shadowCtx = shadowCanvas.getContext("2d"),
  colorMapData = null,
  mouseX = mapDimension/2,
  mouseY = mapDimension/2,
  autoAngle = 0,
  settings = {
    roughness : 20,
    mapDimension : 512,
    unitSize : 1,
    mouseControl : false,
    render : function(){
      terrainGen();
    }
  };

window.onload = function () {
terrainGen();
lighting(hCtx, mouseX, mouseY, deltaHypotenuse);
};

mapCanvas.addEventListener("mousemove", function (e) {
if(settings.mouseControl){
  mouseX = e.clientX;
  mouseY = e.clientY;
}
});

function terrainGen() {
// Set these variables to adjust how the map is generated
var roughness = parseInt(settings.roughness, 10),
    mapDimension = parseInt(settings.mapDimension, 10),
    unitSize = parseInt(settings.unitSize, 10);

var map = generateTerrainMap(settings.mapDimension, unitSize, roughness),
    mapCanvas = document.getElementById('canvas');


mapCanvas.width = mapDimension;
mapCanvas.height = mapDimension;

shadowCanvas.width = mapDimension;
shadowCanvas.height = mapDimension;

// Draw everything after the terrain vals are generated
colorMap(mapDimension, "canvas", map);
drawGrey(mapDimension, map);

// Draw the map
function colorMap(size, canvasId, mapData) {
  var canvas = document.getElementById(canvasId),
      ctx = canvas.getContext("2d"),
      canvasData = ctx.getImageData(0, 0, mapDimension, mapDimension),
      x = 0,
      y = 0,
      colorFill = "#000000";

  var colorBands = [
    {
      startVal : 0,
      endVal : 0.3,
      colorStart : {r : 10, g : 0, b : 0},
      colorEnd : { r : 50, g : 0, b : 0},
      gradWeight : 30
    },
    {
      startVal : 0.3,
      endVal : 0.8,
      colorStart : {r : 100, g : 38, b : 3},
      colorEnd : { r : 100, g : 100, b : 18},
      gradWeight : 45
    },
    {
      startVal : 0.8,
      endVal : 0.95,
      colorStart : {r : 100, g : 56, b : 31},
      colorEnd : { r : 100, g : 80, b : 18},
      gradWeight : 15
    },
    {
      startVal : 0.95,
      endVal : 1,
      colorEnd : {r : 90, g : 40, b : 40},
      colorStart : { r : 120, g : 40, b : 40},
      gradWeight : 30
    }
  ];

  var img = ctx.createImageData(canvas.height, canvas.width),
      imgData = img.data,
      band = 0,
      colorLen = colorBands.length;

  for (x = 0; x <= size; x += unitSize) {
    for (y = 0; y <= size; y += unitSize) {
      var data = mapData[x][y];

      for(band = colorLen; band--;){
        var colorBand = colorBands[band];
        if(data >= colorBand.startVal && data <= colorBand.endVal){
          colorFill = fade(colorBand.colorStart, colorBand.colorEnd, colorBand.gradWeight, parseInt(data * 100));
        }
      }

      for (var w = 0; w <= unitSize; w++) {
        for (var h = 0; h <= unitSize; h++) {
          var pData = (~~ (x+w) + (~~ (y+h) * canvas.width)) * 4;

          imgData[pData] = colorFill.r;
          imgData[pData + 1] = colorFill.g;
          imgData[pData + 2] = colorFill.b;
          imgData[pData + 3] = 255;
        }
      }

    }
  }

  ctx.putImageData(img, 0, 0);
  colorMapData = img;
}

function drawGrey(size, mapData) {
  var canvas = heightCanvas,
      ctx = canvas.getContext("2d"),
      colorFill = "#000000";

  canvas.width = canvas.height = size;

  var img = ctx.createImageData(canvas.height, canvas.width),
      imgData = img.data;

  for (x = 0; x <= size; x += unitSize) {
    for (y = 0; y <= size; y += unitSize) {
      var data = mapData[x][y];

      colorFill = Math.floor(map[x][y] * 250);

      for (var w = 0; w <= unitSize; w++) {
        for (var h = 0; h <= unitSize; h++) {
          var pData = (~~ (x+w) + (~~ (y+h) * canvas.width)) * 4;

          imgData[pData] = colorFill;
          imgData[pData + 1] = colorFill;
          imgData[pData + 2] = colorFill;
          imgData[pData + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(img, 0, 0);
}
}

function fade(colorStart, colorEnd, totalSteps, step) {
var rStart = colorStart.r,
    rEnd = colorEnd.r,
    gStart = colorStart.g,
    gEnd = colorEnd.g,
    bStart = colorStart.b,
    bEnd = colorEnd.b,
    r = rEnd + (~~ ((rStart - rEnd) / totalSteps) * step),
    g = gEnd + (~~ ((gStart - gEnd) / totalSteps) * step),
    b = bEnd + (~~ ((bStart - bEnd) / totalSteps) * step);

return {
  r: r,
  g: g,
  b: b
};
}

var deltaHypotenuse = [],
  originXY = settings.mapDimension / 4;

//Returns a positive int, up to mapDimension,
function luminosity(d) {
return Math.round(
  Math.min(
    Math.max(d, 0), parseInt(settings.mapDimension, 10) - 1));
}

//Function tranxlates (x,y) coords into a linear array position
function findPixelData(x, y) {
return (y * parseInt(settings.mapDimension, 10) + x) * 4;
}

function cycleThrough(d) {
for (var y = 0; y <= parseInt(settings.mapDimension, 10); y+= unitSize) {
  for (var x = 0; x <= parseInt(settings.mapDimension, 10); x += unitSize) {
    d(x, y);
  }
}
}

function lighting(ctx, posX, posY, deltaHypotenuse) {
var pData = hCtx.getImageData(0, 0, parseInt(settings.mapDimension, 10), parseInt(settings.mapDimension, 10)).data,
    canvasData = hCtx.getImageData(0, 0, parseInt(settings.mapDimension, 10), parseInt(settings.mapDimension, 10));

cycleThrough(function (x, y) {
  //Find the pixelData value for each pixel
  var pData1 = pData[findPixelData(x, y + 4) + 2],
      pData2 = pData[findPixelData(x, y - 4) + 2],
      pData3 = pData[findPixelData(x + 4, y) + 2],
      pData4 = pData[findPixelData(x - 4, y) + 2];

  /*
          Set the intensity of a point to the luminosity of
          a value from the array where we generated the hypotenuses (see code below).

          The value we're looking for is calculated based on mouse movement, and difference between pixels.
          */
  var intensity = luminosity(
    deltaHypotenuse[
      luminosity(pData1 - pData2 - y + posY) * parseInt(settings.mapDimension, 10) + luminosity(pData3 - pData4 - x + posX)]);

  //This sets RGB data to the value of intensity.
  for (var i = 3; i--;) {
    canvasData.data[findPixelData(x, y) + i] = intensity;
  }

  //Set the alpha channel
  canvasData.data[findPixelData(x, y) + 3] = 255;

});

shadowCtx.putImageData(canvasData, 0, 0);

// draw.
mapCtx.globalCompositeOperation = "lighter";
mapCtx.putImageData(colorMapData, 0, 0);
mapCtx.drawImage(shadowCanvas, 0, 0);

requestAnimationFrame(function () {
  if(!settings.mouseControl){
    mouseX += Math.cos(autoAngle+=0.01)*20;
    mouseY += Math.sin(autoAngle+=0.2)*15;
  }

  lighting(hCtx, mouseX + originXY, mouseY + originXY, deltaHypotenuse);
});
}

//Generate an array with values that show the distance between (x,y) point and every canvas point.
cycleThrough(function (x, y) {
var V = (x - originXY) / (originXY/2),
    W = (y - originXY) / (originXY/2);

deltaHypotenuse[y * parseInt(settings.mapDimension, 10) + x] = (Math.max(0, 1 - Math.sqrt(V * V + W * W)) * parseInt(settings.mapDimension, 10));
});


var gui = new dat.GUI();

gui.add(settings, 'roughness');
gui.add(settings, 'mapDimension', [64,128,256,512,1024]);
gui.add(settings, 'render');
gui.add(settings, 'mouseControl');