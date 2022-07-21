'use strict';

// requestanimation polyfill
(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        },
        timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}());

// setup stuff.
var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    width = 600,
    height = 600,
    settings = {
        background: "#0D4D2B",
        traceColor: "#ffe99b",
        traceFill: "#000000",
        startTraces : 20,
        totalTraces : 50,
        redraw: function () {
            reinit();
        },
        standard: {
            background: "#0D4D2B",
            traceColor: "#ffe99b",
            traceFill: "#000000"
        },
        green2: {
            background: "#0d4d2b",
            traceColor: "#11ef88",
            traceFill: "#fff"
        },
        blackwhite: {
            background: "#fff",
            traceColor: "#000",
            traceFill: "#000"
        },
        blue: {
            background: "#011880",
            traceColor: "#2dace3",
            traceFill: "#fff"
        },
        colorScheme: 0
    },
    gui = new dat.GUI();
    gui.close();

var schemeSettings = gui.add(settings, 'colorScheme', ['standard', 'green2', 'blackwhite', 'blue']),
    colorSettings = gui.addFolder('Custom Colors'),
    backgroundChange = colorSettings.addColor(settings, 'background'),
    traceColorChange = colorSettings.addColor(settings, 'traceColor'),
    traceFillChange = colorSettings.addColor(settings, 'traceFill');

gui.add(settings, 'startTraces');
gui.add(settings, 'totalTraces');
gui.add(settings, 'redraw');

// dat gui events
backgroundChange.onChange(function (value) {
    document.body.style.backgroundColor = value;
});

traceColorChange.onChange(function (value) {
    ctx.strokeStyle = value;
});

traceFillChange.onChange(function (value) {
    ctx.fillStyle = value;
});

schemeSettings.onChange(function (value) {
    document.body.style.backgroundColor = settings[value].background;
    ctx.strokeStyle =  settings[value].traceColor;
    ctx.fillStyle =  settings[value].traceFill;
});

canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

function Trace(settings) {
    settings = settings || {};
    this.x = settings.x || Math.ceil((Math.random() * width) / 4) * 4;
    this.y = settings.y || Math.ceil((Math.random() * height) / 4) * 4;

    this.points = [];
    this.points.push({
        x: this.x,
        y: this.y,
        arc: 0
    });

    this.trapCount = 0;
    this.live = true;

    this.lastPoint = this.points[0];

    this.angle = settings.angle || (Math.ceil((Math.random() * 360) / 45) * 45) * (Math.PI / 180);
    this.speed = 4;
}

Trace.prototype.update = function () {
    var x = this.lastPoint.x,
        y = this.lastPoint.y,
        dx = this.x - x,
        dy = this.y - y;

    // if its greater than .01 keep moving
    if (Math.random() > 0.01) {
        var velX = Math.cos(this.angle) * this.speed,
            velY = Math.sin(this.angle) * this.speed,
            checkPointX = this.x + (Math.cos(this.angle) * 8),
            checkPointY = this.y + (Math.sin(this.angle) * 8),
            imageData = ctx.getImageData(checkPointX, checkPointY, 3, 3),
            pxlData = imageData.data,
            collision = false;

        // check if its in bounds.
        if (checkPointX > 0 && checkPointX < width && checkPointY > 0 && checkPointY < height) {
            // check if the point in front is clear or not.
            for (var i = 0, n = pxlData.length; i < n; i += 4) {
                var alpha = imageData.data[i + 3];

                if (alpha !== 0) {
                    collision = true;
                    break;
                }
            }
        } else {
            collision = true;
        }

        // no collision keep moving
        if (!collision) {
            this.trapCount = 0;
            this.x += velX;
            this.y += velY;
        } else {
            // collision, assume its not the end
            this.trapCount++;
            this.angle -= 45 * (Math.PI / 180);

            // line is fully trapped make sure to draw an arc and start a new trace.
            if (this.trapCount >= 7) {
                this.live = false;

                if (traces.length < settings.totalTraces) {
                    traces.push(new Trace({
                        cX: 0,
                        cY: 0
                    }));
                }
            }

            if (Math.sqrt(dx * dx + dy * dy) > 4) {
                this.points.push({
                    x: this.x,
                    y: this.y
                });
                this.lastPoint = this.points[this.points.length - 1];
            } else {
                this.trapCount++;
                this.x = this.lastPoint.x;
                this.y = this.lastPoint.y;
            }
        }
    } else {
        // small chance we might just stop altogether.
        if (Math.random() > 0.9) {
            this.live = false;
        }

        // no collision clear any prev trap checks, change the direction and continue on.
        this.trapCount = 0;
        this.angle += 45 * (Math.PI / 180);

        if (Math.sqrt(dx * dx + dy * dy) > 4) {
            this.points.push({
                x: this.x,
                y: this.y
            });
            this.lastPoint = this.points[this.points.length - 1];
        } else {
            this.x = this.lastPoint.x;
            this.y = this.lastPoint.y;
        }
    }
};

Trace.prototype.render = function () {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (var p = 1, plen = this.points.length; p < plen; p++) {
        ctx.lineTo(this.points[p].x, this.points[p].y);
    }
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.points[0].x, this.points[0].y, 4, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (!this.live) {
        ctx.beginPath();
        ctx.arc(this.points[plen - 1].x, this.points[plen - 1].y, 4, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
};

// init
var traces = [],
    traceNum = settings.startTraces,
    reqAnimFrameInstance = null;

for (var b = 0; b < traceNum; b++) {
    traces.push(new Trace({
        cX: 0,
        cY: 0
    }));
}

function reinit() {
    cancelAnimationFrame(reqAnimFrameInstance);
    traces = [];
    traceNum = settings.startTraces;
    ctx.clearRect(0, 0, width, height);

    for (var b = 0; b < traceNum; b++) {
        traces.push(new Trace({
            cX: 0,
            cY: 0
        }));
    }
    doTrace();
}

ctx.strokeStyle = "#ffe99b";
ctx.fillStyle = "#000";
ctx.lineWidth = 2;

function doTrace() {
    ctx.clearRect(0, 0, width, height);

    for (var b = 0; b < traces.length; b++) {
        traces[b].render();
    }

    for (b = 0; b < traces.length; b++) {
        if (traces[b].live) {
            traces[b].update();
        }
    }
    reqAnimFrameInstance = requestAnimationFrame(doTrace);
}

doTrace();