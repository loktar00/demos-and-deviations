function MiniMap(settings){
    Jest.Sprite.call(this, settings);

    this.map = settings.map;
    this.npcs = settings.npcs || {};

    this.mapCanvas = document.createElement("canvas");
    this.updateCanvas = document.createElement("canvas");
    this.updateCtx = this.updateCanvas.getContext("2d");

    var ctx = this.mapCanvas.getContext("2d");

    this.tileSize = 3;

    this.width = this.updateCanvas.width = this.mapCanvas.width = this.map.width * this.tileSize;
    this.height = this.updateCanvas.height = this.mapCanvas.height = this.map.height * this.tileSize;
    this.pos = {x : Game.bounds.width - this.width, y : Game.bounds.height - this.height};

    ctx.fillStyle = "#ececec";
    ctx.fillRect(0,0,this.width, this.height);

    // create the minimap
    ctx.fillStyle = "#000";
    for(var x = 0; x < this.map.width; x++){
        for(var y = 0; y < this.map.height; y++){
            if(this.map.data[y][x] !== 0){
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }

    // get player offset
    this.playerOffsets = {x : (Game.bounds.width/this.map.tileSize)/2, y : (Game.bounds.height/this.map.tileSize)/2};

    this.updateCtx.drawImage(this.mapCanvas, 0, 0);
    this.resource.source = this.updateCanvas;
    this.shape = false;

    Game.addEntity(this);
}

MiniMap.prototype = new Jest.Sprite();

MiniMap.prototype.render = function(context){
    context.save();

    // copy original map image
    this.updateCtx.drawImage(this.mapCanvas, 0, 0);

    this.updateCtx.fillStyle = "blue";
    for(var n = 0; n < this.npcs.length; n++){
        this.updateCtx.fillRect((this.npcs[n].global.x/this.map.tileSize) * this.tileSize, (this.npcs[n].global.y/this.map.tileSize) * this.tileSize, this.tileSize/3,this.tileSize/3);
    }

    // plot player
    this.updateCtx.fillStyle = "red";
    var playerX = (-(this.map.offsetX/this.map.tileSize) + this.playerOffsets.x) * this.tileSize,
        playerY = (-(this.map.offsetY/this.map.tileSize) + this.playerOffsets.y) * this.tileSize;

    this.updateCtx.fillRect(playerX, playerY, this.tileSize/2,this.tileSize/2);
    // render to the nearest full pixel
    var cX = (0.5 + (this.pos.x-this.origin.x)) << 0,
        cY = (0.5 + (this.pos.y-this.origin.y)) << 0;

    context.drawImage(this.resource.source,this.startX,this.startY,this.width,this.height, cX, cY, this.width,this.height);

    context.restore();
}