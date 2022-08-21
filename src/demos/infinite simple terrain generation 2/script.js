(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = window.innerWidth,
    height = 400;


var y = [],
    settings = {
      colWidth : 2,
      maxDev :1, // max height of a column
      colDist : 0.2, // maximum difference in distance a point can be from its neighbor
      horDist : 0.1, // max range between the next set of points...
      heightMultiplier : 50,
      mapType : 0
    };

function initCols() {
    for (var i = 0; i < width / settings.colWidth; i++) {
        if (i === 0) {
            y[i] = (Math.random() * settings.maxDev);
        } else {
            y[i] = y[i - 1] + (Math.random() * settings.colDist) - settings.colDist * .5;
            if (y[i] > settings.maxDev) {
                y[i] = settings.maxDev;
            } else if (y[i] < 0) {
                y[i] = 0;
            }
        }
    }
    render();
}

function genCols() {
    for (var i = 0; i < y.length; i++) {
        var prevCol = y[y.length - 1],
            nextCol = y[i + 1];

        if (i > 0) {
            prevCol = y[i - 1];
        }

        if (i === y.length - 1) {
            nextCol = y[0];
        }

        var rowOffset = y[i] + ((Math.random() * settings.horDist) - settings.horDist / 2),
            colOffset = ((prevCol + nextCol) / 2) + ((Math.random() * settings.colDist) - settings.colDist / 2),
            offset = (rowOffset + colOffset) * .5;

        if (offset > settings.maxDev) {
            offset = settings.maxDev;
        } else if (offset < 0) {
            offset = 0;
        }

        y[i] = offset;

    }
}

function render() {
    ctx.drawImage(canvas, 0, 0, width, height, 0, -1, width, height);

    for (var i = 0; i < y.length; i++) {
        var color = getColor(y[i]);
        ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
        ctx.fillRect(i * settings.colWidth, height, settings.colWidth, -y[i] * settings.heightMultiplier);
    }

    genCols();

    requestAnimationFrame(render);
}

function getColor(val) {

    var waterStart={r:39,g:50,b:63},
        waterEnd={r:10,g:20,b:40},
        grassStart={r:67,g:100,b:18},
        grassEnd={r:22,g:38,b:3},
        mtnEnd={r:67,g:80,b:18},
        mtnStart={r:60,g:56,b:31},
        rockStart={r:130,g:130,b:130},
        rockEnd={r:90,g:90,b:90},
        snowStart={r:200,g:200,b:200},
        snowEnd={r:255,g:255,b:255},
        gamma = 500,
        colorFill = {r : 0, g : 0, b : 0};

    if(settings.mapType == 0) {
          if (val >= 0 && val <= 0.3) {
              colorFill = fade(waterStart, waterEnd, 30, parseInt(val * 100, 10));
          } else if (val > 0.3 && val <= 0.8) {
              colorFill = fade(grassStart, grassEnd, 45, parseInt(val * 100, 10) - 35);
          } else if (val > 0.8 && val <= 0.95) {
              colorFill = fade(mtnStart, mtnEnd, 15, parseInt(val * 100, 10) - 80);
          } else if (val > 0.95 && val <= 1) {
              colorFill = fade(rockStart, rockEnd, 5, parseInt(val * 100, 10) - 98);
          }
    }else{
          var r = 0,
              g = 0,
              b = 0;

          if (val < 0.5) {
              r = val * gamma;
          } else {
              r = (1.0 - val) * gamma;
          }

          if (val >= 0.3 && val < 0.8) {
              g = (val - 0.3) * gamma;
          } else if (val < 0.3) {
              g = (0.3 - val) * gamma;
          } else {
              g = (1.3 - val) * gamma;
          }

          if (val >= 0.5) {
              b = (val - 0.5) * gamma;
          } else {
              b = (0.5 - val) * gamma;
          }

          colorFill = {
              r: ~~r,
              g: ~~g,
              b: ~~b
          };
  }
  return colorFill;
}

// utility for color interpolation
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


setTimeout(function () {
    width = canvas.width = document.body.offsetWidth;
    height = canvas.height = document.body.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    initCols();
}, 50);

var gui = new dat.GUI();
gui.add(settings, 'colWidth');
gui.add(settings, 'maxDev', 0, 1);
gui.add(settings, 'colDist', 0, 1);
gui.add(settings, 'horDist', 0, 1);
gui.add(settings, 'heightMultiplier');
gui.add(settings, 'mapType', {'Color Map' : 0, 'Plasma' : 1});