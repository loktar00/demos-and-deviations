// Small Enemies
(function () {
	var utilities = new Utilities();	
	
	//constructor
    function Enemy(options)
    {  		
		Sprite.call(this, options);
		this.width = 32;
		this.height = 32;
		this.origin.x = this.width/2;
		this.origin.y = this.height/2;
		
		this.shotResource = options.shotResource;
		this.radius = 16;
		this.type = 'ship';
		this.colId = 2;
		this.enemyType = options.enemyType;
		this.lastFired = new Date().getTime();
		this.minFireDelay = 1000 - (this.enemyType * 100);
		this.shields = (this.enemyType * 10) + 1;
		
		this.pattern = options.pattern;
		this.target = 0;
		this.patternPoints = this.pattern.length-1;
		this.targetAngle = this.pattern[this.target].dir;
		this.angle = this.pattern[this.target].dir;
		this.prevPos = new Vector(this.pos.x, this.pos.y,0);
		
		if(this.thrust < 5){
			this.thrust = 5;
		}
		Game.addEntity(this);
	}
	
	Enemy.prototype = new Sprite();
	this.Enemy = Enemy;
	
	// shoot a missile little evil one!
	Enemy.prototype.shoot = function(){
		var projRes = Game.resourceManager.getResource(this.shotResource);
		
		new Projectile({x : (this.pos.x + this.width/2) - 6, y : this.pos.y + this.height, speed : 60, resource : projRes, colId : 2});
	}
	
	// Flash when the player is hit
	Enemy.prototype.hit = function(){
		if(this.shields > 0){
			var self = this;
			this.changeFrame(1);
			setTimeout(function(){self.changeFrame(0)}, 100);
			this.shields-=10;
		}else{
			this.live = false;
		}
	}
	
	Enemy.prototype.update = function(deltaTime)
    {	
		//this.vel.y = Math.sin(this.angle+=0.01)*10;
		Sprite.prototype.update();
		
		var dist = utilities.getDistance(this.prevPos, this.pos);
		
		if(this.angle < this.targetAngle){
			this.angle+=0.1;
		}else if(this.angle > this.targetAngle){
			this.angle-=0.1;
		}
		
		if(dist >= this.pattern[this.target].dist){
			this.prevPos.x = this.pos.x;
			this.prevPos.y = this.pos.y;
			
			if(this.target < this.patternPoints){
				this.target ++;
			}else{
				this.target =0;
			}
			
			this.targetAngle = this.pattern[this.target].dir;
			//this.angle = this.pattern[this.target].dir;
		}
		
		this.vel.x = (Math.cos(((this.angle)) *  Math.PI / 180) * this.thrust * deltaTime);
		this.vel.y = (Math.sin(((this.angle)) *  Math.PI / 180) * this.thrust * deltaTime);	
		
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
		
		//if(Math.random()*10 > 9.999){
		var curTime = new Date().getTime();
		if(curTime > this.lastFired + this.minFireDelay){
			this.lastFired = curTime;
			this.shoot();
		}
		
		if(this.pos.y < -16 || this.pos.y > Game.bounds.y + Game.bounds.height + 16){
			this.live = false;
		}
		if(this.pos.x < -16 || this.pos.x > Game.bounds.x + Game.bounds.width + 16){
			this.live = false;
		}
		
		//}
    };
})();