var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = window.innerWidth,
    height = 400,
    cycle = 0,
    colors = {
        r: 0,
        g: 170,
        b: 0
    };

canvas.width = width;
canvas.height = height;

var points = [];

function render() {
    var imageData = ctx.createImageData(width, height),
        p = points.length;

    while (p--) {
        points[p].x += points[p].speed;
        if (points[p].x > width + points[p].size) {
            points[p].x = -points[p].size;
        }

        var pX = points[p].x,
            pY = points[p].y,
            pSize = points[p].size;

        for (var x = pX - pSize; x < pX + pSize; x++) {
            for (var y = pY - pSize; y < pY + pSize; y++) {

                var dist = Math.sqrt((x - pX) * (x - pX) + (y - pY) * (y - pY)),
                    pix = ((x + pX) + (y + pY) * width) * 4;

                if (~~ ((pSize) - dist) > 0) {
                    imageData.data[pix] = colors.r;
                    imageData.data[pix + 1] = colors.g;
                    imageData.data[pix + 2] = colors.b;
                    imageData.data[pix + 3] += ~~ ((pSize) - dist);
                }

            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    colorAnim();
}

function colorAnim() {
    var imageData = ctx.getImageData(0, 0, width, height),
        pix = imageData.data;

    for (var i = 0, n = pix.length; i < n; i += 4) {
        pix[i] = colors.r;
        pix[i + 1] = colors.g;
        pix[i + 2] = colors.b;
    }
    ctx.putImageData(imageData, 0, 0);
    colorCycle();
    requestAnimationFrame(colorAnim);
}

function colorCycle() {
    cycle += 0.07;
    if (cycle > 100) {
        cycle = 0;
    }
    colors.r = ~~ (Math.sin(.3 * cycle + 0) * 127 + 128);
    colors.g = ~~ (Math.sin(.3 * cycle + 2) * 127 + 128);
    colors.b = ~~ (Math.sin(.3 * cycle + 4) * 127 + 128);
}
setTimeout(function () {
    width = canvas.width = window.innerWidth,
    height = canvas.height = document.body.offsetHeight;

    for (var i = 0; i < 80; i++) {
        points.push({
            x: Math.round(Math.random() * width),
            y: Math.round(Math.random() * height),
            size: 5 + ~~ (Math.random() * 150),
            speed: ~~ (Math.random() * 2)
        });
    }


    render();
}, 20);