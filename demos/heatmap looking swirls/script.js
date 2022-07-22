var canvas = document.querySelector('canvas'),
ctx = canvas.getContext('2d'),
width = window.innerWidth,
height = window.innerHeight,
cycle = 0,
things = [];

canvas.width = width;
canvas.height = height;

ctx.strokeStyle = "rgba(255,0,0,0.5)";
ctx.globalcompositeoperation = "lighter";


function init() {
for (var y = 0; y < 10; y++) {
    for (var x = 0; x < 10; x++) {
        newThing(40 + x*80, 40 + y * 80);
    }
}

render();
}

function newThing(x,y) {
things.push({
    x: x,
    y: y,
    angleX: 1,
    angleY: 1,
    height: 0,
    rad: 20
});
}

function render() {
ctx.fillStyle = colorCycle();
// ctx.strokeStyle = colorCycle();
for (var i = 0; i < things.length; i++) {
    var thing = things[i];

    thing.height += 0.1;

    if(thing.rad - thing.height > 0){
        ctx.beginPath();
        ctx.arc(thing.x + Math.cos(thing.angleX+=0.05),
                thing.y + Math.sin(thing.angleY+=0.05),
                thing.rad - thing.height, 0, Math.PI * 2);

        ctx.fill();
        //ctx.stroke();
    }
}

requestAnimationFrame(render);
}

function colorCycle() {
cycle += .1;
if (cycle > 100) {
    cycle = 0;
}

var r = Math.floor(Math.sin(.3 * cycle + 0) * 127 + 128),
    g = Math.floor(Math.sin(.3 * cycle + 2) * 127 + 128),
    b = Math.floor(Math.sin(.3 * cycle + 4) * 127 + 128),
    a = 1;
return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

init();