var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight;

canvas.width = width;
canvas.height = height;


var map = [],
    cycle = 0,
    ox = 0,
    oy = 0,
    timeOut = null,
    settings = {
        mapWidth: 250,
        mapHeight: 250,
        wallPerc: 45,
        neighbors: 4,
        cycles: 6,
        color : "#000",
        background : "#fff",
        speed: 1,
        Generate: function () {
            clearTimeout(timeOut);
            init();
        }
    };

function init() {
    document.body.style.background = settings.background;
    ctx.fillStyle = settings.color;
    for (var x = 0; x <= settings.mapWidth; x++) {
        map[x] = [];
        for (var y = 0; y <= settings.mapHeight; y++) {
            if (y == 0 || x == 0 || y == settings.mapHeight || x == settings.mapWidth) {
                map[x][y] = 1;
            } else if (Math.random() * 100 < settings.wallPerc) {
                map[x][y] = 1;
            } else {
                map[x][y] = 0;
            }
        }
    }
    cycle = 0;
    render();
    process(1);
}

// process
function process(oy) {
    var walls = 0;

    for (var x = 1; x < settings.mapWidth; x++) {
        map[x][oy] = getWalls(x, oy, 1, 1);
    }
    timeOut = setTimeout(function () {
        renderRow(oy);
        if (oy <= settings.mapHeight) {
            oy++;
            process(oy);
        } else {
            oy = 1;
            cycle++;
            if (cycle < settings.cycles) {
                process(oy);
            }
        }
    }, 10);

}

function getWalls(x, y) {
    var walls = 0;

    for (var yy = y-1; yy <= y+1; yy++) {
        for (var xx = x-1; xx <= x+1; xx++) {
            if (!(xx == x && yy == y)) {
                if (map[xx][yy]) {
                    walls++;
                }
            }
        }
    }

    if (map[x][y] == 1) {
        if (walls >= settings.neighbors) {
            return 1;
        } else if (walls <= 2) {
            return 0;
        }
    } else {
        if (walls >= 5) {
            return 1;
        }
    }
    return 0;
}

function renderRow(y) {
    var pW = (0.5 + (width / settings.mapWidth)) << 0,
        pH = (0.5 + (height / settings.mapHeight)) << 0;

    ctx.clearRect(0, y * pH, width, pH);
    for (var x = 0; x < settings.mapWidth; x++) {
        if (map[x][y] === 1) {
            ctx.fillRect(x * pW, y * pH, pW, pH);
        }
    }
}

function render() {
    var pW = (0.5 + (width / settings.mapWidth)) << 0,
        pH = (0.5 + (height / settings.mapHeight)) << 0;

    ctx.clearRect(0, 0, width, height);
    for (var x = 0; x < settings.mapWidth; x++) {
        for (var y = 0; y < settings.mapHeight; y++) {
            if (map[x][y] === 1) {
                ctx.fillRect(x * pW, y * pH, pW, pH);
            }
        }
    }
}

setTimeout(function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.body.offsetHeight;
    settings.mapWidth = ~~(width/2);
    settings.mapHeight = ~~(height/2);
    init();
}, 150);

var gui = new dat.GUI();
gui.add(settings, 'mapWidth').listen();
gui.add(settings, 'mapHeight').listen();
gui.add(settings, 'wallPerc');
gui.add(settings, 'neighbors');
gui.add(settings, 'cycles');
gui.addColor(settings, 'color');
gui.addColor(settings, 'background');
gui.add(settings, 'Generate');