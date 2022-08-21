var mapCanvas= document.getElementById("canvas"),
ctx = mapCanvas.getContext("2d"),
map = [],
unitSize = 1,
mapDimension = 256;

mapCanvas.height=canvas.width = mapDimension;

// make a mayan temple
for(var x = 0; x < mapDimension; x++){
map[x] = [];
 for(var y = 0; y < mapDimension; y++){
    var startingBound = mapDimension/4,
        endingBound = (mapDimension/4)*3;

    if(y > startingBound && y < endingBound && x > startingBound && x < endingBound){
        var base = endingBound - startingBound,
            sections = 10,
            sectionSize = base/sections,
            baseHeight = 0.2;
            colIncr = (1-baseHeight)/sections;

        for(var i = 0; i <sections; i++){
           if(y > startingBound && y < endingBound && x > startingBound && x < endingBound){
               map[x][y] = (i*colIncr) + baseHeight;
           }
           startingBound += sectionSize/2;
           endingBound -= sectionSize/2;
        }
    }else{
        map[x][y] = Math.random()*0.1;
    }
}
}

colorMap();
drawShadowMap(mapDimension, 512,256,2);
//drawShadowMap(mapDimension, 512,-256,3);
drawRenderedMap(mapDimension, 300, 4, 200, mapDimension / 2, mapDimension + 50);
// size, viewAngle, yaw, camHeight, camX, camY
function colorMap(){
for(var x = 0; x < mapDimension; x++){
    for(var y = 0; y < mapDimension; y++){
        var color = parseInt(map[x][y] * 100)+100;

        if(color==0 || color< 0){
            color = 110;
        }

        ctx.fillStyle = "rgb(" + color + "," +  color + "," + Math.floor(color*.8) +")";
        ctx.fillRect (x, y, 1, 1);
    }
}
}
//Create Shadowmap
function drawShadowMap(size, sunPosX, sunPosY, sunHeight){
    var ctx = mapCanvas.getContext("2d"),
    x = 0, y = 0,
    idx,
    colorFill = 0,
    sunX, sunY, sunZ,
    pX, pY, pZ,
    mag, dX, dY, dZ;

    // Suns position
    sunX = sunPosX;
    sunY = sunPosY;
    sunZ = sunHeight;

    for(x = 0; x <= mapDimension-1; x += unitSize){
        for(y = 0; y <=  mapDimension-1; y += unitSize){
            dX = sunX - x;
            dY = sunY - y;
            dZ = sunZ - map[x][y];

            mag = Math.sqrt(dX * dX + dY * dY + dZ * dZ);

            dX = (dX / mag);
            dY = (dY / mag);
            dZ = (dZ / mag);

            pX = x;
            pY = y;
            pZ = map[x][y];

            while(pX >= 0 && pX < mapDimension && pY >= 0 && pY < mapDimension && pZ <= sunZ){

                var rPx = round(pX),
                    rPy = round(pY);

                if(rPx < mapDimension && rPx > 0 && rPy < mapDimension && rPy > 0){
                    if((map[round(pX)][round(pY)]) > pZ){
                        ctx.fillStyle = "rgba(" + 0 + "," +  0 + "," + 0 +"," + 0.6 + ")";
                        ctx.fillRect (x, y, unitSize, unitSize);
                        break;
                    }
                }
                    pX += (dX * unitSize);
                    pY += (dY * unitSize);
                    pZ += (dZ * unitSize);

            }
        }
    }
}

//Create Voxel View
function drawRenderedMap(size, viewAngle, yaw, camHeight, camX, camY){
var voxCanvas = document.getElementById("voxCanvas"),
ctx = voxCanvas.getContext("2d"),
sCtx = mapCanvas.getContext("2d"),
sCanvasData = sCtx.getImageData(0, 0, mapDimension, mapDimension),
idx;

ctx.clearRect(0,0,mapDimension,mapDimension);
voxCanvas.width = voxCanvas.height = mapDimension;

document.onkeydown = function(evt){
if (evt.keyCode === 39){
drawRenderedMap(size, viewAngle+=.01, yaw, camHeight, camX, camY);
}else if (evt.keyCode === 37){
drawRenderedMap(size, viewAngle-=.01, yaw, camHeight, camX, camY);
}else if (evt.keyCode === 38){
drawRenderedMap(size, viewAngle, yaw, camHeight, camX, camY-=5);
}else if (evt.keyCode === 40){
drawRenderedMap(size, viewAngle, yaw, camHeight, camX, camY+=5);
}else if (evt.keyCode === 107){
drawRenderedMap(size, viewAngle, yaw, camHeight-=5, camX, camY);
}else if (evt.keyCode === 109){
drawRenderedMap(size, viewAngle, yaw, camHeight+=5, camX, camY);
}
};


var Ray = 0, AngRay, iRay, ix, iy, iz, px, py, pz, dx, dy, dz, idz, fov, Highest, VxHigh, ScreenAt, MidOut, vy;

//Field of view
fov = 1;
iRay = fov / mapDimension;

// Gets the distance multiplier for the camera
ScreenAt = parseInt((mapDimension / 2) * Math.tan(fov / 2));

// Angle of view
vy = viewAngle;

// Camera height
MidOut = yaw;

for (AngRay=(vy-(fov/2)); Ray < mapDimension; Ray+=unitSize, AngRay+=iRay) {

// Camera position
px = camX;
py = camY;

// how much to increment based on the angle for the ray
ix = Math.cos (AngRay);
iy = Math.sin (AngRay);

idy = Math.cos (AngRay - (vy));
dy = idy;

// Set the current position at the bottom of the image
Highest = mapDimension;

while (px>=0 && px<mapDimension-1 && py>=0 && py<(mapDimension+mapDimension*2)) {

VxHigh = (((map[round(px)][round(py)]* camHeight)  * (ScreenAt  / dy)) + MidOut) / map[round(px)][round(py)] ;

/* If it's above the highest point drawn so far. */
 if (VxHigh < Highest) {

    idx = (round(px) + round(py) * mapDimension) * 4;
    ctx.fillStyle = "rgb(" + sCanvasData.data[idx + 0] + "," +  sCanvasData.data[idx + 1] + "," + sCanvasData.data[idx + 2] +")";
    ctx.fillRect(Ray, VxHigh, unitSize,  Highest - VxHigh);

    // Uncomment this line to see the overhead perspective of what your looking at

     //ctx.fillRect (round(px), round(py), unitSize, unitSize);

    if (VxHigh < 0){
        break;
    }

    Highest = VxHigh + 1;
 }

px += ix;
py += iy;
dy += idy;
}
}

}


// Round to nearest pixel
function round(n)
{
    if (n-(parseInt(n)) >= 0.5){
        return parseInt(n)+1;
    }else{
        return parseInt(n);
    }
}