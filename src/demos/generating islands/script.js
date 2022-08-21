// Setup the map array for use
var map = [],
    mapDimension = 512,
    roughness = 6,
    unitSize = 4,
    canvas = document.getElementById("canvas");

    canvas.height = canvas.width = 512;

for(var x = 0; x < mapDimension+1; x++){
    for(var y = 0; y < mapDimension+1; y++){
        map[x] = [];
    }
}

// Starts off the map generation, seeds the first 4 corners
function startDisplacement(){
    var x = mapDimension,
        y = mapDimension,
        tr, tl, t, br, bl, b, r, l, center;

    // top left
    map[0][0] = Math.random(1.0);
    tl = map[0][0];

    // bottom left
    map[0][mapDimension] = Math.random(1.0);
    bl = map[0][mapDimension];

    // top right
    map[mapDimension][0] = Math.random(1.0);
    tr = map[mapDimension][0];

    // bottom right
    map[mapDimension][mapDimension] = Math.random(1.0);
    br = map[mapDimension][mapDimension]

    // Center
    map[mapDimension / 2][mapDimension / 2] = map[0][0] + map[0][mapDimension] + map[mapDimension][0] + map[mapDimension][mapDimension] / 4;
    map[mapDimension / 2][mapDimension / 2] = normalize(map[mapDimension / 2][mapDimension / 2]);
    center = map[mapDimension / 2][mapDimension / 2];

    map[mapDimension / 2][mapDimension] = bl + br + center / 3;
    map[mapDimension / 2][0] = tl + tr + center / 3;
    map[mapDimension][mapDimension / 2] = tr + br + center / 3;
    map[0][mapDimension / 2] = tl + bl + center / 3;

    // Call displacment
    midpointDisplacment(mapDimension);

    // Draw everything after the terrain vals are generated
    drawMap(mapDimension, "canvas", map);
}

// Workhorse of the terrain generation.
    function midpointDisplacment(dimension){
        var newDimension = dimension / 2,
            top, topRight, topLeft, bottom, bottomLeft, bottomRight, right, left, center,
            i, j;

        if (newDimension > unitSize){
            for(i = newDimension; i <= mapDimension; i += newDimension){
                for(j = newDimension; j <= mapDimension; j += newDimension){
                    x = i - (newDimension / 2);
                    y = j - (newDimension / 2);

                    topLeft = map[i - newDimension][j - newDimension];
                    topRight = map[i][j - newDimension];
                    bottomLeft = map[i - newDimension][j];
                    bottomRight = map[i][j];

                    // Center
                    map[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(dimension);
                    map[x][y] = normalize(map[x][y]);
                    center = map[x][y];

                    // Top
                    if(j - (newDimension * 2) + (newDimension / 2) > 0){
                        map[x][j - newDimension] = (topLeft + topRight + center + map[x][j - dimension + (newDimension / 2)]) / 4 + displace(dimension);;
                    }else{
                        map[x][j - newDimension] = (topLeft + topRight + center) / 3+ displace(dimension);
                    }

                    map[x][j - newDimension] = normalize(map[x][j - newDimension]);

                    // Bottom
                    if(j + (newDimension / 2) < mapDimension){
                        map[x][j] = (bottomLeft + bottomRight + center + map[x][j + (newDimension / 2)]) / 4+ displace(dimension);
                    }else{
                        map[x][j] = (bottomLeft + bottomRight + center) / 3+ displace(dimension);
                    }

                    map[x][j] = normalize(map[x][j]);


                    //Right
                    if(i + (newDimension / 2) < mapDimension){
                        map[i][y] = (topRight + bottomRight + center + map[i + (newDimension / 2)][y]) / 4+ displace(dimension);
                    }else{
                        map[i][y] = (topRight + bottomRight + center) / 3+ displace(dimension);
                    }

                    map[i][y] = normalize(map[i][y]);

                    // Left
                    if(i - (newDimension * 2) + (newDimension / 2) > 0){
                        map[i - newDimension][y] = (topLeft + bottomLeft + center + map[i - dimension + (newDimension / 2)][y]) / 4 + displace(dimension);;
                    }else{
                        map[i - newDimension][y] = (topLeft + bottomLeft + center) / 3+ displace(dimension);
                    }

                    map[i - newDimension][y] = normalize(map[i - newDimension][y]);
                }
            }
            midpointDisplacment(newDimension);
        }
    }


// Draw the map
    function drawMap(size, canvasId, mapData){
        var canvas = document.getElementById(canvasId),
        ctx = canvas.getContext("2d"),
        canvasData = ctx.getImageData(0, 0, mapDimension, mapDimension),
        x = 0,
        y = 0,
        r = 0, g = 0, b = 0, gamma = 500,
        colorFill = 0;

        for(x = 0; x <= size; x += unitSize){
            for(y = 0; y <= size; y += unitSize){
                if(map[x][y]>0.6){
                    colorFill = 100;
                }else{
                     colorFill = 0;
                }
                ctx.fillStyle = "rgb(" + colorFill + "," +  colorFill + "," + colorFill +")";
                ctx.fillRect (x, y, unitSize, unitSize);
            }
        }
    }

// Normalize the value to make sure its within bounds
    function normalize(value){
        if( value > 1){
            value = 1;
        }else if(value < 0){
            value = 0;
        }
        return value;
    }

// Random function to offset the center
    function displace(num){
        var max = num / (mapDimension + mapDimension) * roughness;
        return (Math.random(1.0)- 0.5) * max;
    }


startDisplacement();