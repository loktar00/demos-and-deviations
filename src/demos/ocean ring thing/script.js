var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

document.body.appendChild(canvas);

ctx.lineCap = 'round';
ctx.lineWidth = 25;
ctx.shadowBlur = 55;
ctx.shadowColor="#000";

var x = canvas.width / 2,
    y = canvas.height / 2,
    gap = [],
    arcs = 10,
    rad = 22;

for (var a = 0; a < arcs; a++) {
    gap[a] = a;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < arcs; i++) {
        gap[i] += 0.1;
        ctx.strokeStyle = '#374d89';

        ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.sin(gap[i] / 2) / i * 1.5);
            ctx.beginPath();
            ctx.moveTo(rad * i, 0);
            ctx.arc(0, 0, rad * i, 0, Math.PI);
            ctx.stroke();
        ctx.restore();

        ctx.save();
            ctx.strokeStyle = '#fff';
            ctx.translate(x, y);
            ctx.rotate(Math.sin(gap[i] / 2) / i * 1.5);
            ctx.beginPath();
            ctx.moveTo(-rad * i, 0);
            ctx.arc(0, 0, rad * i, Math.PI, 0);
            ctx.stroke();
        ctx.restore();
    }
    requestAnimationFrame(render);
}

render();