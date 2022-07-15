function Player(settings){
    Jest.Sprite.call(this, settings);
    this.width = 60;
    this.height = 64;

    this.pos.x = Game.bounds.width/2;
    this.pos.y = Game.bounds.height/2;
    this.origin  = {x : 30, y : 32}
    this.angle = 0;
    this.startY = 0;
    this.addAnimation([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], "walk");
    this.radius = 32;
    this.radDist = 10;
    this.colId = 1;
    
    Game.addEntity(this);
}

Player.prototype = new Jest.Sprite();

Player.prototype.update = function(deltaTime){
    Jest.Sprite.prototype.update.call(this, deltaTime);   
    this.dirX = 0;
    this.dirY = 0;

    // right
    if(Game.getKey(39) || Game.getKey(68)){
        this.dirX = -1;
        this.angle = 90;
    }

    // left
    if(Game.getKey(37) || Game.getKey(65)){
        this.dirX = 1;
        this.angle = 270;
    }

    // up
    if(Game.getKey(38) || Game.getKey(87)){
        this.dirY = 1;
        this.angle = 0;
    }

    // down
    if(Game.getKey(40) || Game.getKey(83)){
        this.dirY = -1;
        this.angle = 180;
    }

    if(this.dirX !== 0 || this.dirY !== 0){
        if(this.dirX !== 0 && this.dirY !== 0){
            if(this.dirX === 1){
                if(this.dirY === 1){
                    this.angle = 315;
                }else{
                    this.angle = 225;
                }
            }else{
                if(this.dirY === 1){
                    this.angle = 45;
                }else{
                    this.angle = 135;
                }
            } 
        }

        if(!this.isAnimating){
           this.playAnimation("walk",50);
        }
    }else{
        this.stopAnimation();
    }
};

Player.prototype.render = function(ctx){
    Jest.Sprite.prototype.render.call(this, ctx); 
    this.startY = (this.angle/45) * this.height;  
   /* if(this.radius){
        var checkX = this.pos.x + this.radDist * Math.cos((this.angle-90)*Math.PI / 180),
            checkY = this.pos.y + this.radDist * Math.sin((this.angle-90)*Math.PI / 180);
            ctx.strokeStyle = "rgb(255,0,0)";
            ctx.beginPath();
            ctx.arc(checkX, checkY, this.radius, 0, Math.PI*2, true); 
            ctx.closePath();
            ctx.stroke();
    }*/
}
