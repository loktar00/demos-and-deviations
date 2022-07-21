// super requestAnimationFrame polyfill!
(function (window) {
    'use strict';

    var lastTime = 0,
        vendors = ['moz', 'webkit', 'o', 'ms'],
        x;

    // Remove vendor prefixing if prefixed and break early if not
    for (x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    // Check if full standard supported
    if (!window.cancelAnimationFrame) {
        // Check if standard partially supported
        if (!window.requestAnimationFrame) {
            // No support, emulate standard
            window.requestAnimationFrame = function (callback) {
                var now = new Date().getTime(),
                    nextTime = Math.max(lastTime + 16, now);

                return window.setTimeout(function () {
                    callback(lastTime = nextTime);
                }, nextTime - now);
            };

            window.cancelAnimationFrame = window.clearTimeout;
        } else {
            // Emulate cancel for browsers that don't support it
            vendors = window.requestAnimationFrame;
            lastTime = {};

            window.requestAnimationFrame = function (callback) {
                var id = x; // Generate the id (x is initialized in the for loop above)
                x += 1;
                lastTime[id] = callback;

                // Call the vendors requestAnimationFrame implementation
                vendors(function (timestamp) {
                    if (lastTime.hasOwnProperty(id)) {
                        var error;
                        try {
                            lastTime[id](timestamp);
                        } catch (e) {
                            error = e;
                        } finally {
                            delete lastTime[id];
                            if (error) {
                                throw error;
                            } // re-throw the error if an error occurred
                        }
                    }
                });

                // return the id for cancellation capabilities
                return id;
            };

            window.cancelAnimationFrame = function (id) {
                delete lastTime[id];
            };
        }
    }

}(this));


var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 500,
    height = 500;

canvas.width = width;
canvas.height = height;


var map = [],
    cycle = 0,
    mapWidth = 250,
    mapHeight = 250,
    request = null,
    pixelSize = 2,
    settings = {
        fillPercent: 30,
        pixelSize: 2,
        fullScreenNoise: false,
        numberOfSeeds: 50,
        Generate: function () {
            cancelAnimationFrame(request);
            pixelSize = parseInt(settings.pixelSize);
            mapWidth = Math.round(width / pixelSize);
            mapHeight = Math.round(height / pixelSize);

            if (settings.fullScreenNoise) {
                initFullScreenNoise();
            } else {
                initSeed();
            }
        }
    };

function initFullScreenNoise() {
    for (var x = 0; x <= mapWidth; x++) {
        map[x] = [];
        for (var y = 0; y <= mapHeight; y++) {
            if (y == 0 || x == 0 || y == mapHeight - 1 || x == mapWidth - 1) {
                map[x][y] = 1;
            } else if (Math.random() * 100 < settings.fillPercent) {
                map[x][y] = 1;
            } else {
                map[x][y] = 0;
            }
        }
    }
    render();
}

function initSeed() {
    for (var x = 0; x <= mapWidth; x++) {
        map[x] = [];
        for (var y = 0; y <= mapHeight; y++) {
            map[x][y] = 0;
        }
    }

    // init a few random seeds
    var xArea = 3,
        yArea = 3;

    for (var i = 0; i < settings.numberOfSeeds; i++) {
        var xPos = 10 + ~~ (Math.random() * (mapWidth - 10)),
            yPos = 10 + ~~ (Math.random() * (mapHeight - 10)),
            xRange = ~~ (Math.random() * 10),
            yRange = ~~ (Math.random() * 10);

        for (x = xPos - xRange; x <= xPos + xRange; x++) {
            for (y = yPos - yRange; y <= yPos + yRange; y++) {
                if (x > 0 && x < mapWidth && y > 0 && y < mapHeight) {
                    map[x][y] = (Math.random() * 100 < settings.fillPercent);
                }
            }
        }
    }
    render();
}

// process
function process() {
    var walls = 0;

    for (var x = 1; x < mapWidth; x++) {
        for (var y = 1; y < mapHeight; y++) {
            map[x][y] = getWalls(x, y, 1, 1);
        }
    }
}

function getWalls(x, y, rangeX, rangeY) {
    var startX = x - rangeX,
        startY = y - rangeY,
        endX = x + rangeX,
        endY = y + rangeY,
        walls = 0;

    for (var yy = startY; yy <= endY; yy++) {
        for (var xx = startX; xx <= endX; xx++) {
            if (!(xx == x && yy == y)) {
                if (map[xx][yy]) {
                    walls++;
                }
            }
        }
    }

    if (map[x][y] == 1) {
        if (walls >= 5) {
            return 0;
        } else if (walls >= 1 && walls <= 4) {
            return 1;
        }
    } else {
        if (walls == 3) {
            return 1;
        }
    }
    return 0;
}

function render() {
    var pW = (0.5 + (width / mapWidth)) << 0,
        pH = (0.5 + (height / mapHeight)) << 0;

    var imgData = ctx.createImageData(width, height),
        data = imgData.data,
        pix = null;

    for (var x = 0; x < mapWidth; x++) {
        for (var y = 0; y < mapHeight; y++) {
            if (map[x][y] === 1) {
                for (var w = 0; w < pixelSize; w++) {
                    for (var h = 0; h < pixelSize; h++) {
                        pix = (((x * pixelSize) + w) + ((y * pixelSize) + h) * width) * 4;
                        data[pix + 3] = 255;
                    }
                }
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);
    process();
    request = requestAnimationFrame(render);
}

setTimeout(function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.body.offsetHeight;
    mapWidth = ~~ (width / pixelSize);
    mapHeight = ~~ (height / pixelSize);
    initSeed();
}, 150);

var gui = new dat.GUI();
gui.add(settings, 'fillPercent');
gui.add(settings, 'pixelSize');
gui.add(settings, 'numberOfSeeds');
gui.add(settings, 'fullScreenNoise');
gui.add(settings, 'Generate');