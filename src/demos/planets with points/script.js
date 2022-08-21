var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d'),
    width = 0,
    height = 0,
    planets = [];

function drawPlanet(rad, xc, yc, color) {
    color = color || {
        r: 0,
        g: 100,
        b: 160
    };
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(xc, yc, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";

    for (var y = -rad; y < rad; y++) {
        var x1 = parseInt(Math.sqrt(rad * rad - y * y));
        for (var x = -x1; x < x1; x++) {
            var n = parseInt(Math.random() * x1)/1.5;

            if (n > x1 + x) {
                ctx.fillRect(x + xc, y + yc, 1, 1);
            }

        }
    }
}

function render() {
    for (var p = 0; p < planets.length; p++) {
        var planet = planets[p];
        drawPlanet(planet.rad, planet.x, planet.y, planet.color);
    }
}

setTimeout(function () {
    width = canvas.width = window.innerWidth,
    height = canvas.height = document.body.offsetHeight;

    // first planet is large
    planets.push({
        rad: ~~ (height / 2) - 20,
        x: ~~ (width / 2),
        y: ~~ (height / 2),
        color: {
            r: ~~ (Math.random() * 255),
            g: ~~ (Math.random() * 255),
            b: ~~ (Math.random() * 255)
        }
    });
    // moons.
    for (var p = 0; p < 3; p++) {
        var r = ~~ (Math.random() * 255),
            g = ~~ (Math.random() * 255),
            b = ~~ (Math.random() * 255),
            rad = ~~ (Math.random() * width / 6)+10,
            x = ~~ ((width / 2) + (Math.random() * width / 2) - width / 4),
            y = ~~ ((height / 2) + (Math.random() * height / 2) - height / 4);

        planets.push({
            rad: rad,
            x: x,
            y: y,
            color: {
                r: r,
                g: g,
                b: b
            }
        });
    }

    render();
}, 100);