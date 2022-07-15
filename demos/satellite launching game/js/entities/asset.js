(function () {
	var utilities = new Utilities();	
	
	//constructor
    function Asset(options)
    {  		
		Sprite.call(this, options);
		this.width = 16;
		this.height = 16;
		this.origin = new Vector(8,8,0);
		this.clickable = true;
		this.owner = options.owner;
		
		if(options.drawAngle){
			this.drawAngle = options.drawAngle;
		}else{
			this.drawAngle = 0;
		}
		
		this.type = 'asset';
		this.radius = 8;
		
		// nodes to hold points of interest
		this.startNode = {};
		this.endNode = {};

		this.inTransit = true;
		this.isHit = false;
		
		this.thrust = 0;
		
		// set the angle to the start position, offset by 90 degres
		this.angle = 90-Math.atan2(this.pos.x-(320+60),this.pos.y-240)/Math.PI*180;
		this.curRadius = 90;
		this.targetRadius = options.targetRadius;
		
	}
	
	Asset.prototype = new Sprite();
	this.Asset = Asset;

	Asset.prototype.setAngle = function(angle){
		this.angle = angle;
	}
	
	Asset.prototype.setCurRadius = function(radius){
		this.curRadius = radius;
		this.inTransit = false;
	}
	
	Asset.prototype.hit = function(){
		this.isHit = true;
		this.targetRadius = 500;
		this.inTransit = false;
	}
	
	Asset.prototype.startOrbit = function(){
		this.inTransit = false;
	}
	
	Asset.prototype.clicked = function(){
		if(Game.gameState.disrupt && this.owner !== 1 && Game.resources > 100){
			Game.resources -= 100;
			this.hit();
		}
	}
	
	Asset.prototype.update = function(deltaTime)
    {	
		Sprite.prototype.update();
		
		if(this.inTransit || this.isHit){
			this.vel.x = Math.cos(this.angle*Math.PI/180)*0.04;
			this.vel.y = Math.sin(this.angle*Math.PI/180)*0.04;
			this.pos.x += this.vel.x;
			this.pos.y += this.vel.y;
		}
		
		if(this.curRadius < (this.targetRadius-1) && this.inTransit){			// if we havent reached our start orbit yet and are still in transit
			this.curRadius+=(this.targetRadius -this.curRadius)/600;
		}else if(this.curRadius < this.targetRadius && !this.inTransit){	// if we havent reached orbit and we aren't in transit (were hit)
			this.curRadius+=0.1;
		}else if(this.inTransit){											// we are in transit and have reached our desitnation start orbit
			this.startOrbit();
		}
		
		if(this.isHit){
			this.angle+=0.005;
		}else{
			this.angle+=0.01;
		}			
		
		if(this.angle>360){
			this.angle = 0;
		}
		
		this.pos.x = (320+60) + Math.cos(this.angle*Math.PI/180) * this.curRadius;
		this.pos.y = 240 + Math.sin(this.angle*Math.PI/180) * this.curRadius;
		
		if(this.isHit){
			this.drawAngle += 0.03;
		}else{
			this.drawAngle += 0.005;
		}
		
		if(this.drawAngle > 44){
			this.drawAngle = 0;
		}
		
		this.startX = 16 * this.owner;	
		this.startY = 16 * Math.round(this.drawAngle); 		
		
		if(this.pos.x < 0 || this.pos.x > Game.bounds.width+32 && this.pos.y < 0 || this.pos.y > Game.bounds.height+32){
			this.live = false;
		}
    };
	
	Asset.prototype.render = function(context){
		context.save;
		context.drawImage(this.resource.source,this.startX,this.startY,this.width,this.height, this.pos.x-this.origin.x, this.pos.y-this.origin.y, this.width,this.height);
		context.restore();
	}
})();