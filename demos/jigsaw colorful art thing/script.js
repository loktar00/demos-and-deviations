var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    settings = {
        width: 200,
        height: 200,
        points: 300,
        pSize: 1,
    };

canvas.width = settings.width;
canvas.height = settings.height;


function render() {
    var imageData = ctx.createImageData(settings.width, settings.height),
        maxDist = 0,
        width = settings.width,
        height = settings.height,
        pSize = settings.pSize,
        renderType = settings.renderType;

    var ranPoints = [],
        points = [];

    for(var y = 0; y < 20; y++){
        for(var x = 0; x < 20; x++){
            var colorData = ctx.getImageData(~~(x * (width/20)+(y%2)*5),~~(y * (height/20)+(x%2)*5),1,1).data;
             ranPoints.push({
                x: x * (width/20)+(y%2)*5,
                y: y * (height/20)+(x%2)*5,
                color: {
                    r: ~~ (Math.random() * 256),
                    g: ~~ (Math.random() * 256),
                    b: ~~ (Math.random() * 256)
                }
            });
        }
    }

    // Check distance with all other points
    for (var x = 0; x < width; x += pSize) {
        for (var y = 0; y < height; y += pSize) {
            var pLen = ranPoints.length,
                p = 0,
                dist = 0,
                firstPoint = 0,
                curMinDist = width * height,
                dist2 = 0,
                curMinDist2 = 0;

            for (p = 0; p < pLen; p++) {
                var dX = ranPoints[p].x - x,
                    dY = ranPoints[p].y - y;
               // dist = Math.sqrt(dX * dX + dY * dY);
              // dist = Math.abs(dX) + Math.abs(dY);
                dist = Math.max(Math.abs(dX), Math.abs(dY));
                if (dist < curMinDist) {
                    points[y * width + x] = ranPoints[p].color;
                    curMinDist = dist;
                }
            }
        }
    }

    // Draw points
    for (var x = 0; x < width; x += pSize) {
        for (var y = 0; y < height; y += pSize) {
            for (var pix = 0; pix < pSize; pix++) {
                for (var piy = 0; piy < pSize; piy++) {
                    i = ((x + pix) + (y + piy) * imageData.width) * 4;
                    imageData.data[i + 0] = points[y * width + x].r;
                    imageData.data[i + 1] = points[y * width + x].g;
                    imageData.data[i + 2] = points[y * width + x].b;
                    imageData.data[i + 3] = 255;

                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

render();

