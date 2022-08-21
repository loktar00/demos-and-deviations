// Main player
(function () {
	var utilities = new Utilities();	
	
	//constructor
    function Player(options)
    {  		
		Sprite.call(this, options);
		this.width = 32;
		this.height = 32;
		this.origin.x = this.width/2;
		this.origin.y = this.height/2;
		this.radius = 16;
		this.type = 'ship';
		this.colId = 1;
		this.fireSpeed = 500;
		this.fireMult = 0;
		this.lastFired = new Date().getTime();
		this.shields = 100;
		this.lastBeatCount = 0;
		
		this.clickable = true;
		Game.addEntity(this);
	}
	
	Player.prototype = new Sprite();
	this.Player = Player;
	
	// shoot a missile young one!
	Player.prototype.shoot = function(){
		var projRes = Game.resourceManager.getResource("PlayerProjectile");
		new Projectile({x : (this.pos.x + this.width/2) - 6, y : this.pos.y, speed : -60, resource : projRes, colId: 1});
		new Projectile({x : (this.pos.x + this.width/2) - 24, y : this.pos.y, speed : -60, resource : projRes, colId: 1});
	}
	
	// Flash when the player is hit
	Player.prototype.hit = function(){
		if(this.shields > 0){
			var self = this;
			this.changeFrame(1);
			setTimeout(function(){self.changeFrame(0)}, 100);
			this.shields--;
		}else{
			this.live = false;
		}
	}
	
	Player.prototype.clicked = function(){
		Sprite.prototype.clicked();
		this.hit();
	}
	
	Player.prototype.update = function(deltaTime)
    {	
		Sprite.prototype.update();
		
		/*var newBeat = Game.audioMan.getQuarterBeatCounter();
		if(newBeat !== this.lastBeatCount){
			this.shoot();
			this.lastBeatCount = newBeat;
		}*/
		
		if(this.fireMult>0){
			this.fireMult--;
		}
		var soundmult = 40;
		if(soundmult*8 > this.fireMult){
			this.fireMult+=2;
		}
		
		var curTime = new Date().getTime(),
			fireTime = 0;
			
		if(this.fireSpeed - this.fireMult >70){
			fireTime = this.fireSpeed - this.fireMult;
		}else{
			this.fireMult = (this.fireSpeed-70);
			fireTime = 70;
		}

		if(curTime > (this.lastFired + fireTime)){
			this.lastFired = curTime;
			this.shoot();
		}
		
		/*var fireTime = new Date().getTime();
		if(fireTime > this.lastFired + this.fireSpeed){
			this.shoot();
			this.lastFired = fireTime;
		}*/
		
		if(Game.mouseX < Game.width-32){
			this.pos.x = Game.mouseX;
		}
		
		if(Game.mouseY < Game.height-32){
			this.pos.y = Game.mouseY;
		}
		
		
    };
})();