var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

// map array
var map = [],
    mapWidth = 50,
    mapHeight = 50;

canvas.width = mapWidth * 10;
canvas.height = mapHeight * 10;

for(var x = 0; x < mapWidth; x++){
    map[x] = [];
    for(var y = 0; y < mapHeight; y++){
        // food or nothing.
        if(Math.random()*100 > 99){
             map[x][y] = 2;
        }else{
            map[x][y] = 0;
        }
    }
}

// snake stuff
var startX = Math.ceil((mapWidth*10)/2),
    startY = Math.ceil((mapHeight*10)/2);
    snake = {
        x : startX,
        y : startY,
        parts : [],
        dir : 0,
        speed : 1.5
    };

snake.parts.push({x : startX, y: startY});

// draw
function render(){
    ctx.clearRect(0,0,canvas.width, canvas.height);

    // move snake
    switch(snake.dir){
        case 0: // north
            snake.y -= snake.speed;
            break;
        case 1: // east
            snake.x += snake.speed;
            break;
        case 2: // south
            snake.y += snake.speed;
            break;
        case 3:  // west
            snake.x -= snake.speed;
            break;
    }

    // add a part
    snake.parts.push({x : snake.x, y: snake.y});

    // check for food ect.
    var squareX = Math.round(snake.x/10),
        squareY = Math.round(snake.y/10);

    var curSquare = map[squareX][squareY];

    if(curSquare !== 0){
        // add wall/food check
        switch(curSquare){
            case 2:
                map[squareX][squareY] = 0;
                // spawn another
                break;
        }
    }else{
        snake.parts.splice(0,1);
    }

    ctx.fillStyle = "rgb(0,0,0)";
    for(var part = 0; part< snake.parts.length; part++){
        var curPart = snake.parts[part];
        ctx.fillRect(curPart.x,curPart.y,10,10);
    }


    for(var x = 0; x < mapWidth; x++){
        for(var y = 0; y < mapHeight; y++){
            if(map[x][y] !== 0){
                switch(map[x][y]){
                    case 1:
                        ctx.fillStyle = "rgb(0,0,0)";
                        break;
                    case 2:
                        ctx.fillStyle = "rgb(0,255,0)";
                        break;
                }
                ctx.fillRect(x*10,y*10,10,10);
            }
        }
    }
    setTimeout(render,10);
}

render();

window.addEventListener("keydown", function(e){
    switch(e.keyCode){
        case 37:
            snake.dir = 3;
            break;
        case 38:
            snake.dir = 0;
            break;
        case 39:
            snake.dir = 1;
            break;
        case 40:
            snake.dir = 2;
            break;
    }
}, true);
