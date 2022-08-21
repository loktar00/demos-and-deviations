(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = window.innerWidth,
    height = document.body.offsetHeight,
    settings = {
        size: 6,
        fireWidth: 15,
        lifeTime: 3000,
        innerFlameStartColor: {
            r: 250,
            g: 140,
            b: 0
        },
        innerFlameEndColor: {
            r: 50,
            g: 0,
            b: 0
        },
        outerFlameStartColor: {
            r: 200,
            g: 60,
            b: 0
        },
        outerFlameEndColor: {
            r: 80,
            g: 10,
            b: 0
        },
        showLogs: true
    },
    dimW = Math.ceil(width / settings.size),
    dimH = Math.ceil(height / settings.size),
    logWidth = settings.fireWidth + (settings.fireWidth / 4),
    flames = [],
    logs = [];

for (var i = 0; i < 400; i++) {
    flames.push(initFlame());
}

initLogs();

canvas.width = width;
canvas.height = height;

function initLogs() {
    logs = [];
    for (var i = 0; i < 300; i++) {
        logs.push({
            x: Math.ceil(((dimW / 2) - logWidth / 2 + Math.random() * logWidth) * 2) / 2,
            y: dimH - Math.ceil(Math.random() * 4)
        });
    }
}

function initFlame(reset) {
    var y = Math.ceil(Math.random() * dimH),
        x = Math.ceil(((dimW / 2) - settings.fireWidth / 2 + Math.random() * settings.fireWidth) * 2) / 2,
        colorStart = settings.innerFlameStartColor,
        colorStop = settings.innerFlameEndColor;

    if (reset) {
        y = dimH;
    }

    if (x <= (dimW / 2) - (settings.fireWidth / 6) || x >= (dimW / 2) + (settings.fireWidth / 6)) {
        colorStart = settings.outerFlameStartColor,
        colorStop = settings.outerFlameEndColor;
    }

    return {
        x: x,
        y: y,
        colorStart: colorStart,
        colorStop: colorStop,
        sinX: Math.round(Math.random() * 1),
        speedX: Math.ceil(Math.random() * 5),
        speedY: 0.5,
        top: Math.round(Math.random() * dimH / 2),
        startTime: new Date().getTime(),
        lifeTime: Math.random() * settings.lifeTime
    };
}

function render() {
    ctx.fillStyle = "rgba(26,0,1,0.2)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < flames.length; i++) {
        var flame = flames[i],
            endStep = (flame.startTime + flame.lifeTime),
            curStep = (flame.startTime + flame.lifeTime) - new Date().getTime();

        flame.y -= flame.speedY;
        y = Math.floor(flame.y);

        flame.x += Math.round(Math.sin(flame.sinX += flame.speedX));
        flame.x = Math.round(flame.x * 2) / 2

        if (flame.y <= flame.top || curStep <= 0) {
            flames[i] = initFlame(true);
        }

        var color = colorChange(flame.colorStart, flame.colorStop, dimH , flame.y);
        color.a = flame.lifeTime * curStep;

        ctx.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";

        drawTriangle(flame.x, y);
    }
    ctx.globalCompositeOperation = "source-over";
    if (settings.showLogs) {
        ctx.fillStyle = "rgb(70,30,0)";
        for (i = 0; i < logs.length; i++) {
            var log = logs[i];
            drawTriangle(log.x, log.y);
        }
    }
    requestAnimationFrame(render);
}

function drawTriangle(x, y) {
    var size = settings.size;
    ctx.beginPath();
    if (parseInt(x) === x) {
        ctx.moveTo(x * size, y * size);
        ctx.lineTo(x * size + size / 2, y * size + size);
        ctx.lineTo(x * size - size / 2, y * size + size);
    } else {
        ctx.moveTo(x * size - size / 2, y * size);
        ctx.lineTo(x * size + size / 2, y * size);
        ctx.lineTo(x * size, y * size + size);
    }
    ctx.fill();
}

render();


function colorChange(startColor, endColor, totalSteps, step) {
    var scale = step / totalSteps,
        r = endColor.r + scale * (startColor.r - endColor.r),
        g = endColor.g + scale * (startColor.g - endColor.g),
        b = endColor.b + scale * (startColor.b - endColor.b);
    return {
        r: Math.floor(Math.min(255, Math.max(0, r))),
        g: Math.floor(Math.min(255, Math.max(0, g))),
        b: Math.floor(Math.min(255, Math.max(0, b)))
    };
}

window.onresize = function () {
    height = canvas.height = document.body.offsetHeight;
    width = canvas.width = document.body.offsetWidth;
    dimW = Math.ceil(width / settings.size);
    dimH = Math.ceil(height / settings.size);
    initLogs();
};

// Settings
var gui = new dat.GUI();

gui.add(settings, 'size', 1, 40).onFinishChange(function () {
    dimW = Math.ceil(width / settings.size);
    dimH = Math.ceil(height / settings.size);
    initLogs();
});
gui.add(settings, 'lifeTime', 500, 20000);
gui.add(settings, 'fireWidth', 5, 50);
gui.addColor(settings, 'innerFlameStartColor');
gui.addColor(settings, 'innerFlameEndColor');
gui.addColor(settings, 'outerFlameStartColor');
gui.addColor(settings, 'outerFlameEndColor');
gui.add(settings, 'showLogs');