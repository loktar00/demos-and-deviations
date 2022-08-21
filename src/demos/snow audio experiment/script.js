var context = new webkitAudioContext(),
node = null,
audioBuffer = null,
sourceNode = null,
analyser = null,
prevVal = [],
canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d"),
snowCanvas = document.createElement("canvas"),
sCtx = snowCanvas.getContext("2d"),
flakes = [];

ctx.globalCompositeOperation = "lighter";
sCtx.globalCompositeOperation = "lighter";

canvas.width = snowCanvas.width = window.innerWidth;
canvas.height = snowCanvas.height = window.innerHeight;

document.body.appendChild(snowCanvas);

var audio = new Audio();
audio.src = "http://somethinghitme.com/projects/audio/break2.ogg";
audio.controls = true;
audio.preload = true;
document.body.insertBefore(audio, document.body.childNodes[0]);


function drawSpectrum() {
var array = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(array);
ctx.fillStyle = "rgba(0,0,0,0.5)";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#65edff";

var x = 0;
for (var i = 0; i < 200; i++) {
    var value = array[i];
    if (Math.abs(value - prevVal[i]) > 50) {
        newFlake(x, 120 - value / 4);
    }
    prevVal[i] = value;
    ctx.fillRect(x, 140 - value / 2, 3, value / 4);
    x += canvas.width / 200;
}
snow();
requestAnimationFrame(drawSpectrum);
};

function snow() {
var imgData = sCtx.createImageData(snowCanvas.width, snowCanvas.height),
    data = imgData.data;

for (var i = 0; i < flakes.length; i++) {
    var flake = flakes[i];

    flake.velX *= .98;
    if (flake.velY <= flake.speed) {
        flake.velY = flake.speed
    }
    flake.velX += Math.cos(flake.step += .05) * flake.stepSize;

    ctx.fillStyle = "#c6f8ff";
    flake.y += flake.velY;
    flake.x += flake.velX;

    if (flake.y >= canvas.height || flake.y <= 0 || flake.x >= canvas.width || flake.x <= 0) {
        flakes.splice(i, 1);
    }

    if (flake.x < snowCanvas.width && flake.x > 0 && flake.y > 0 && flake.y < snowCanvas.height) {
        for (var w = 0; w < flake.size; w++) {
            for (var h = 0; h < flake.size; h++) {
                if (flake.x + w < snowCanvas.width && flake.x + w > 0 && flake.y + h > 0 && flake.y + h < snowCanvas.height) {
                    fData = (~~ (flake.x + w) + (~~ (flake.y + h) * snowCanvas.width)) * 4;
                    data[fData] = 198;
                    data[fData + 1] = 248;
                    data[fData + 2] = 255;
                    data[fData + 3] = 255;
                }
            }
        }
    }
}
sCtx.putImageData(imgData, 0, 0);
};

function newFlake(x, y) {
var size = (Math.random() * 1) + 0.5,
    speed = (Math.random() * 1) + 0.5;

flakes.push({
    speed: speed,
    velY: speed,
    velX: 0,
    x: x,
    y: y,
    size: size,
    stepSize: (Math.random()) / 30,
    step: 0
});
}

window.addEventListener('load', function (e) {
sourceNode = context.createMediaElementSource(audio);
node = context.createScriptProcessor(1024, 1, 2);
node.connect(context.destination);

analyser = context.createAnalyser();
analyser.smoothingTimeConstant = 0.1;
analyser.fftSize = 1024;

sourceNode.connect(analyser);
analyser.connect(node);
sourceNode.connect(context.destination);

analyser.connect(context.destination);

canvas.width = snowCanvas.width = window.innerWidth;
canvas.height = snowCanvas.height = window.innerHeight;

drawSpectrum();
}, false);