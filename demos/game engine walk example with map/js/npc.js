function NPC(settings){
    Jest.Sprite.call(this, settings);
    this.width = 60;
    this.height = 64;

    this.angle = 0;
    this.startY = 0;
    this.addAnimation([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], "walk");
    
    this.map = settings.map;

    var globalX =0,
        globalY = 0,
        collision = true;

    while(collision){
        globalX = ~~(Math.random() * this.map.width);
        globalY = ~~(Math.random() * this.map.height);
        collision = this.colCheck(globalX,globalY);
    }

    this.global  = {
        x : globalX * this.map.tileSize,
        y : globalY * this.map.tileSize
    };

    this.tilePos = {x : globalX, y : globalY};

    this.pos.x = this.global.x + this.map.offsetX;
    this.pos.y = this.global.y + this.map.offsetY;

    this.colId = 1;
    this.speed = 8 + Math.random()*4;

    this.path = [];
    this.currentTarget = null;
    this.pathFinder = settings.pathFinder;

    this.getPath();

    Game.addEntity(this);
}

NPC.prototype = new Jest.Sprite();

NPC.prototype.update = function(deltaTime){
    Jest.Sprite.prototype.update.call(this, deltaTime);   
    
    this.pos.x = this.global.x + this.map.offsetX;
    this.pos.y = this.global.y + this.map.offsetY;
    
    this.tilePos = {x : ~~(this.global.x/this.map.tileSize), y : ~~(this.global.y/this.map.tileSize)};

    // update path
    if(this.path.length === 0 && this.currentTarget == null){
        // find new paths
        this.getPath();
    }else{
        // move towards current target
        var tx = this.currentTarget.x - this.global.x,
            ty = this.currentTarget.y - this.global.y,
            dist = Game.Utilities.getDistance(this.global, this.currentTarget),
            angle = Game.Utilities.getAngle(this.global, this.currentTarget);
        
        //angle = (angle) % 360;
        //if (angle < 1){angle += 360};
        //if (angle > 360){angle -= 360};

        //this.startY = this.height*Math.floor(Math.abs(angle/8));

        if(dist > 10){
            this.vel.x = (tx/dist)*this.speed * deltaTime;
            this.vel.y = (ty/dist)*this.speed * deltaTime;

            this.global.x += this.vel.x; 
            this.global.y += this.vel.y; 
        }else{
            if(this.path.length > 0){
                this.currentTarget = this.path.pop();
                this.currentTarget.x *= this.map.tileSize;
                this.currentTarget.y *= this.map.tileSize;
                this.currentTarget.x += this.map.tileSize/2 - this.width/2;
                this.currentTarget.y += this.map.tileSize/2 - this.height/2;
            }else{
                this.currentTarget = null;
            }
        }
    }

    if(!this.isAnimating){
       this.playAnimation("walk",50);
    }
};

NPC.prototype.getPath = function(){
    var x = ~~(Math.random()*this.map.width),
        y = ~~(Math.random()*this.map.height);

    while(this.map.data[y][x] == 1){
        x = ~~(Math.random()*this.map.width);
        y = ~~(Math.random()*this.map.height);
    }

    this.path = this.pathFinder.getPath(this.tilePos, {x : x, y : y});
    this.currentTarget = this.path.pop();
    this.currentTarget.x *= this.map.tileSize;
    this.currentTarget.y *= this.map.tileSize;

    this.currentTarget.x += this.map.tileSize/2 - this.width/2;
    this.currentTarget.y += this.map.tileSize/2 - this.height/2;
};

NPC.prototype.colCheck = function(x,y){
    var collision = false;

    if(this.map.data[y][x]){
        collision = true;
    }
    return collision;
};

NPC.prototype.resolve = function(offset){
    this.global.x += offset.x;
    this.global.y += offset.y;

    this.pos.x = this.global.x + this.map.offsetX;
    this.pos.y = this.global.y + this.map.offsetY;

    this.tilePos = {x : ~~(this.pos.x/this.map.tileSize), y : ~~(this.pos.y/this.map.tileSize)};
};
