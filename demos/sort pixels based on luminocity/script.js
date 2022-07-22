var canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d"),
    height = 256,
    width = 256;

canvas.width = width;
canvas.height = height;

var image = new Image(),
    canvasData = null,
    cData = null,
    pix = 4,
    sortedData = [];

image.crossOrigin = "anonymous";
image.src = "http://i.imgur.com/gM9s6N0.jpg";

image.addEventListener("load", function () {
    ctx.drawImage(this, 0, 0, width, height);
    canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    cData = canvasData.data;
    pixelSort();
});

function pixelSort() {
    for (var y = pix; y < height; y+=pix) {
        for (var x = pix; x < width; x+=pix) {
            var idx = (y * width + x) * 4,
                checkIdx = ((y - pix) * width + x) * 4,
                checkXdx = (y * width + (x-pix)) * 4;

            var swap = 0,
                lumA = 0,
                lumB = 0;

            for(var py = 0; py < pix; py++){
                for(var px = 0; px < pix; px++){
                    idx = ((y+py) * width + (x+px)) * 4;
                    checkIdx = (((y-pix)+py) * width + (x + px)) * 4;

                    lumA += hsv(cData[idx],cData[idx + 1],cData[idx + 2]).h;
                    lumB += hsv(cData[checkIdx],cData[checkIdx + 1],cData[checkIdx + 2]).h;
                }
            }

            if (lumA > lumB) {
                for(var py = 0; py < pix; py++){
                    for(var px = 0; px < pix; px++){
                        idx = ((y+py) * width + (x+px)) * 4;
                        checkIdx = (((y-pix)+py) * width + (x + px)) * 4;

                        for (var i = 0; i < 4; i++) {
                            swap = cData[idx + i];
                            cData[idx + i] = cData[checkIdx + i];
                            cData[checkIdx + i] = swap;
                        }
                    }
                }
            }

            lumA = 0;
            lumB = 0;

            for(var py = 0; py < pix; py++){
                for(var px = 0; px < pix; px++){
                    idx = ((y+py) * width + (x+px)) * 4;
                    checkXdx = ((y+py) * width + ((x - pix) + px)) * 4;

                    lumA += hsv(cData[idx],cData[idx + 1],cData[idx + 2]).v;
                    lumB += hsv(cData[checkXdx],cData[checkXdx + 1],cData[checkXdx + 2]).v;
                }
            }

            if (lumA > lumB) {
                for(var py = 0; py < pix; py++){
                    for(var px = 0; px < pix; px++){
                        idx = ((y+py) * width + (x+px)) * 4;
                        checkXdx = ((y+py) * width + ((x - pix) + px)) * 4;
                        for (var i = 0; i < 4; i++) {
                            swap = cData[idx + i];
                            cData[idx + i] = cData[checkXdx + i];
                            cData[checkXdx + i] = swap;
                        }
                    }
                }
            }
        }
    }

    ctx.putImageData(canvasData, 0, 0);

    requestAnimationFrame(pixelSort);
}


function hsv(r, g, b) {
    var maxColor = Math.max(r, g, b),
        minColor = Math.min(r, g, b),
        h = 0,
        s = 0,
        v = 0;

    if (maxColor == minColor) {
        h = 0;
    } else if (maxColor == r) {
        h = 60.0 * ((g - b) / (maxColor - minColor)) % 360.0;
    } else if (maxColor == g) {
        h = 60.0 * ((b - r) / (maxColor - minColor)) + 120.0;
    } else if (maxColor == b) {
        h = 60.0 * ((r - g) / (maxColor - minColor)) + 240.0;
    }

    v = maxColor;
    if (maxColor == 0.0) {
        s = 0.0;
    } else {
        s = 1.0 - (minColor / maxColor);
    }

    return {
        h: h,
        s: s,
        v: v
    };
}