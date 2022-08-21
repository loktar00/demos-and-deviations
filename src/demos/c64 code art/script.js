var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 500,
    height = 500;

function print10() {
    var chars = ["\u2571", "\u2572"],
        spacing = 32;

    for (var x = 0; x < width; x += spacing) {
        for (var y = 0; y < height+spacing; y += spacing) {
            ctx.fillText(chars[Math.round(Math.random())], x, y);
        }
    }
}

function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.font = "2em Arial bold";
    ctx.fillStyle = "#a0a0ff";
    print10();
}


setTimeout(init, 10);