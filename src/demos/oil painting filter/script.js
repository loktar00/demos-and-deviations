var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    img = new Image(),
    effectEl = document.getElementById("effect"),
    settings = {
      radius : 4,
      intensity : 25,
      ApplyFilter : function(){
         doOilPaintEffect();
      }
    }

img.addEventListener('load', function () {
    // reduced the size by half for pen and performance.
    canvas.width = (this.width/2);
    canvas.height = (this.height/2);
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    doOilPaintEffect();
});

img.src = "./cheeky.png";

var gui = new dat.GUI();
gui.add(settings, 'intensity');
gui.add(settings, 'radius');
gui.add(settings, 'ApplyFilter');

function doOilPaintEffect(){
  oilPaintEffect(canvas, settings.radius, settings.intensity);
}

function oilPaintEffect(canvas, radius, intensity) {
    var width = canvas.width,
        height = canvas.height,
        imgData = ctx.getImageData(0, 0, width, height),
        pixData = imgData.data,
        // change to createElement getting added element just for the demo
        destCanvas = document.getElementById("dest-canvas"),
        dCtx = destCanvas.getContext("2d"),
        pixelIntensityCount = [];

    destCanvas.width = width;
    destCanvas.height = height;

    var destImageData = dCtx.createImageData(width, height),
        destPixData = destImageData.data,
        intensityLUT = [],
        rgbLUT = [];

    for (var y = 0; y < height; y++) {
        intensityLUT[y] = [];
        rgbLUT[y] = [];
        for (var x = 0; x < width; x++) {
            var idx = (y * width + x) * 4,
                r = pixData[idx],
                g = pixData[idx + 1],
                b = pixData[idx + 2],
                avg = (r + g + b) / 3;

            intensityLUT[y][x] = Math.round((avg * intensity) / 255);
            rgbLUT[y][x] = {
                r: r,
                g: g,
                b: b
            };
        }
    }


    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            pixelIntensityCount = [];

            // Find intensities of nearest pixels within radius.
            for (var yy = -radius; yy <= radius; yy++) {
                for (var xx = -radius; xx <= radius; xx++) {
                  if (y + yy > 0 && y + yy < height && x + xx > 0 && x + xx < width) {
                      var intensityVal = intensityLUT[y + yy][x + xx];

                      if (!pixelIntensityCount[intensityVal]) {
                          pixelIntensityCount[intensityVal] = {
                              val: 1,
                              r: rgbLUT[y + yy][x + xx].r,
                              g: rgbLUT[y + yy][x + xx].g,
                              b: rgbLUT[y + yy][x + xx].b
                          }
                      } else {
                          pixelIntensityCount[intensityVal].val++;
                          pixelIntensityCount[intensityVal].r += rgbLUT[y + yy][x + xx].r;
                          pixelIntensityCount[intensityVal].g += rgbLUT[y + yy][x + xx].g;
                          pixelIntensityCount[intensityVal].b += rgbLUT[y + yy][x + xx].b;
                      }
                  }
                }
            }

            pixelIntensityCount.sort(function (a, b) {
                return b.val - a.val;
            });

            var curMax = pixelIntensityCount[0].val,
                dIdx = (y * width + x) * 4;

            destPixData[dIdx] = ~~ (pixelIntensityCount[0].r / curMax);
            destPixData[dIdx + 1] = ~~ (pixelIntensityCount[0].g / curMax);
            destPixData[dIdx + 2] = ~~ (pixelIntensityCount[0].b / curMax);
            destPixData[dIdx + 3] = 255;
        }
    }

    // change this to ctx to instead put the data on the original canvas
    dCtx.putImageData(destImageData, 0, 0);
}