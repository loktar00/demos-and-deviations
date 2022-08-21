var canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d"),
width = window.innerWidth,
height = document.body.offsetHeight;

canvas.width = width;
canvas.height = height;

// adding sections
var sect = [],
sectNum = 4,
anglePos = 359 / sectNum,
ang = 0,
amp = 150,
sectionWidth = 60,
xPos = width / 2,
color = {
    r: 0,
    g: 0,
    b: 0
};

function render() {
ctx.clearRect(0, 0, width, height);

for (var i = 0; i < height; i += 2) {
    sect[0] = ((Math.sin((i / amp) + ang)) * sectionWidth) + xPos;
    for (s = 1; s < sectNum; s++) {
        sect[s] = ((Math.sin((i / amp) + ang + anglePos * s)) * sectionWidth) + xPos;
    }

    if (sect[0] < sect[1]) {
        ctx.beginPath();
        ctx.strokeStyle = "rgb(" + Math.round(amp * (s * .1)) + ",0," + Math.round(amp * (s * .1)) + ")";
        ctx.moveTo(sect[0], i);
        ctx.lineTo(sect[1], i);
        ctx.stroke();
    }


    for (s = 1; s < sectNum; s++) {
        if (s + 1 < sectNum) {
            ctx.strokeStyle = "rgb(" + Math.round(amp * (s * .1)) + ",0," + Math.round(amp * (s * .1)) + ")";
            if (sect[s] < sect[s + 1]) {
                ctx.beginPath();
                ctx.moveTo(sect[s], i);
                ctx.lineTo(sect[s + 1], i);
                ctx.stroke();
            }
        } else {
            if (sect[s] < sect[0]) {
                ctx.beginPath();
                ctx.moveTo(sect[s], i);
                ctx.lineTo(sect[0], i);
                ctx.stroke();
            }
        }
    }
}

ang += 0.02;
amp += Math.sin(ang) * 10;

if (ang === 359) {
    ang = 0;
}
requestAnimationFrame(render);
}



setTimeout(function () {
width = canvas.width = window.innerWidth,
height = canvas.height = document.body.offsetHeight;
xPos = width / 2;
render();
}, 500);
