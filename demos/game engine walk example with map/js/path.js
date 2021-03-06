var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    tileSize = 16,
    mapData = [],
    startTime = 0,
    totalTime = 0;

canvas.width = 960
canvas.height =400;

for(var x = 0; x < canvas.width/16; x++){
    mapData[x] = [];
    for(var y = 0; y < canvas.height/16; y++){

        if(Math.random()*10>8){
            mapData[x][y] = {'x' : x, 'y' : y, 'type' : 1};
            ctx.fillStyle = "rgb(0,0,150)";  
        }else{
            mapData[x][y] = {'x' : x, 'y' : y, 'type' : 0};
            ctx.fillStyle = "rgb(0,100,0)";  
        }
        ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize); 
    } 
}

mapData[0][0].type = 0;
ctx.fillStyle = "rgb(0,100,0)";
ctx.fillRect(0, 0, tileSize, tileSize);

var playerObj = {};

playerObj.x = Math.floor(Math.random()*canvas.width/16);
playerObj.y = Math.floor(Math.random()*canvas.height/16);

ctx.fillStyle = "rgb(200,0,0)";
ctx.fillRect(playerObj.x*tileSize, playerObj.y*tileSize, tileSize, tileSize);

canvas.onclick = function(e){
    var x,y;
    
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }else{ 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    
    x = Math.floor(x/ tileSize) * tileSize;
    y = Math.floor(y/ tileSize) * tileSize;
    
    x /= 16;
    y /= 16;

    pathFinding(mapData, playerObj, mapData[x][y]);
}
    
function pathFinding(data, start, end){
    startTime = new Date().getTime();
    var openList = [],
        closedList = [],
        startObj = {};
    
    for(var x = 0; x < canvas.width/16; x++){
        for(var y = 0; y < canvas.height/16; y++){
            data[x][y].g = 0;
            data[x][y].h = 0;
            data[x][y].f = 0;
            data[x][y].open = false;
            data[x][y].checked = false;
            data[x][y].parent = null;
        }
    }
    
    startObj.parent = null;
    startObj.g = 0;
    startObj.h = getHur(startObj, end);
    startObj.f = startObj.g + startObj.h;
    startObj.open = true;
    startObj.x = start.x;
    startObj.y = start.y;
    openList.push(startObj);
    
    while(openList.length > 0){
        var curNode = openList.pop();

        if(curNode.x === end.x && curNode.y === end.y){
            // build path 
            var cur = curNode,
                path = [];
            
            while(cur.parent) {
                path.push(cur);
                cur = cur.parent;
            }
            path.push(cur);
            
            totalTime = new Date().getTime() - startTime;
            console.log(totalTime);
            
            movePlayer(path.reverse(),0);
            return true;
      
        }else{
            curNode.checked = true;
            curNode.open = false;
            
            var neighbors = getNeighbors(data, curNode);   
            for(var i = 0; i < neighbors.length; i++){
                var neighbor = neighbors[i];
                if(neighbor.checked || neighbor.type !== 0){
                    continue;   
                }
                
                var gScore = curNode.g + 1,
                    betterGScore = false;
                
                if(!neighbor.open){
                    betterGScore = true;
                    neighbor.h = getHur(neighbor, end);
                    neighbor.open = true;
                    openList.push(neighbor);
                    openList.sort(sortByF);
                }else if(gScore < neighbor.g){
                    betterGScore = true;
                }
                
                if(betterGScore){
                    neighbor.parent = curNode;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    openList.sort(sortByF);
                }
            }
        }
    }
}

function getHur(pos0, pos1) {
        // This is the Manhattan distance
        var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        return d1 + d2;
}

function getNeighbors(data, node) {
    var ret = [],
        x = node.x,
        y = node.y;
    
    if(data[x-1] && data[x-1][y]) {
        ret.push(data[x-1][y]);
    }
    if(data[x+1] && data[x+1][y]) {
        ret.push(data[x+1][y]);
    }
    if(data[x][y-1] && data[x][y-1]) {
        ret.push(data[x][y-1]);
    }
    if(data[x][y+1] && data[x][y+1]) {
        ret.push(data[x][y+1]);
    }
    return ret;
}

// sort by the g value
function sortByF(a, b){
    var aa = a.f,
        bb = b.f;
    
    return ((aa < bb) ? 1 : ((aa > bb) ? -1 : 0));
}
    
function drawPath(data){
    for(var i = 0; i < data.length; i++){
        var x = data[i].x * 16,
            y = data[i].y * 16;
        
         ctx.strokeRect(x,y,tileSize,tileSize);
    }  
}
    
function movePlayer(data, step){
    step++;
    if(step >= data.length){
        return false;   
    }
    
    if(mapData[playerObj.x][playerObj.y].type == 0){
         ctx.fillStyle = "rgb(0,100,0)";
    }else{
       ctx.fillStyle = "rgb(0,0,150)"; 
    }
     
    ctx.fillRect(playerObj.x*tileSize, playerObj.y*tileSize, tileSize, tileSize);
    
    playerObj.x = data[step].x;
    playerObj.y = data[step].y; 
    
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(playerObj.x*tileSize, playerObj.y*tileSize, tileSize, tileSize);
    
    setTimeout(function(){movePlayer(data,step)},10);
}