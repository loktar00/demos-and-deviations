var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

canvas.width = 512;
canvas.height = 512;

var map = [],
    width = 64,
    height = 64;

for(var y = 0; y < height; y++){
    map[y] = [];
    for(var x = 0; x < width; x++){
        map[y][x] = 0;
    }
}

//How many rooms?
var minimum_rooms = 5,
    maximum_rooms = 10,
    room_count = Math.floor(Math.random()*maximum_rooms) + minimum_rooms;

//Room sizes?
var width_root = Math.sqrt(width * 2),
    height_root = Math.sqrt(height * 2),
    minimum_width = 4,
    maximum_width = 10,
    minimum_height = 4,
    maximum_height = 10;

//Create rooms
roomList = [];

for (var i = 0 ; i < room_count; i++){
   var ok = false;

   //This while loop runs until we find somewhere the room fits
   //There are faster ways of doing this but for the map sizes I'm
   //using, it serves my needs and is fast enough.

    while (!ok)
    {
        var room = {};

        room.x = ~~(Math.random() * width);
        room.y = ~~(Math.random() * height);
        room.w = ~~(Math.random()*maximum_width) + minimum_width;
        room.h = ~~(Math.random()*maximum_height) + minimum_height;


        // check bounds
        if(room.x + room.w >= width || room.y + room.h >= height){
                continue
        }


        // check against other rooms
        for(var r = 0; r < roomList.length; r++){
            if(room.x > roomList[r].x &&
                room.x < roomList[r].x + room.w &&
                room.y > roomList[r].y &&
                room.y < roomList[r].y + room.h){
                    ok = false;
                    break;
            }
        }


        ok = true;
        roomList.push(room);
   }
}

//Connect Rooms
var connectionCount = roomList.length,
    connectedCells = [];

for (i = 0; i < connectionCount; i++)
{
   var roomA = roomList[i],
       roomNum = i;

       while(roomNum == i){
           roomNum = ~~(Math.random()*roomList.length);
       }

       roomB = roomList[roomNum];

   //Increasing this number will make hallways straighter
   //Decreasing this number will make halways skewer
   var sidestepChance = 10,
       pointA = {x : ~~(Math.random()*roomA.w) + roomA.x,
                 y : ~~(Math.random()*roomA.h) + roomA.y},
       pointB = {x : ~~(Math.random()*roomB.w) + roomB.x,
                 y : ~~(Math.random()*roomB.h) + roomB.y};

   //This is a type of drunken/lazy walk algorithm
    while (pointB.x !== pointA.x || pointB.y !== pointA.y){
        var num = Math.random()*100;

        if (num < sidestepChance){
            if (pointB.x !== pointA.x){
                if(pointB.x > pointA.x){
                    pointB.x--;
                }else{
                    pointB.x++;
                }
            }
        }else if(pointB.y !== pointA.y){
                if(pointB.y > pointA.y){
                    pointB.y--;
                }else{
                    pointB.y++;
                }
        }

        if(pointB.x < width && pointB.y < height){
            connectedCells.push({x:pointB.x, y:pointB.y});
        }
    }
}

// set the room fill data
for(i = 0; i < roomList.length; i++){
    for(var y = roomList[i].y; y < roomList[i].y + roomList[i].h; y++){
        for(var x = roomList[i].x; x < roomList[i].x + roomList[i].w; x++){
            //console.log(y + " : " + x);
            map[y][x] = 1;
        }
    }
}

// set the connection data
for(i = 0; i < connectedCells.length; i++)
{
      map[connectedCells[i].y][connectedCells[i].x] = 2;
}

// color the walls
for(var y = 0; y < height; y++){
    for(var x = 0; x < width; x++){
        if(map[y][x] == 0){
            var wall = false;
            for(var yy = y-2; yy < y+2;yy++){
                for(var xx = x-2; xx < x+2;xx++){
                    if(xx > 0 && yy > 0 && xx < width && yy < height){
                        if(map[yy][xx] == 1 || map[yy][xx] == 2){
                            map[y][x] = 3;
                            wall = true;
                        }
                    }
                }
                if(wall){
                    break;
                }
            }
        }
    }
}

// render the map;
var scaler = canvas.width / width;

for(var y = 0; y < height; y++){
    for(var x = 0; x < width; x++){
        switch(map[y][x]){
            case 0:
                ctx.fillStyle = "#000";
                break;
            case 1:
                ctx.fillStyle = "rgb(150,100,150)";
                break;
            case 2:
                ctx.fillStyle = "rgb(150,100,150)";
                break;
            case 3:
                ctx.fillStyle = "rgb(1000,100,100)";
                break;
        }
        ctx.fillRect(x*scaler,y*scaler,scaler,scaler);
    }
}
