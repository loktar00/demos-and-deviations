// Projectile
(function () {
	
	//constructor
    function Projectile(options)
    {  		
		Sprite.call(this, options);

		if(options !== undefined){ 
			// Set an extra param for the heck of it.
			if(options.speed === undefined){
				this.speed = -10;
			}else{
				this.speed = options.speed;
			}
			
			if(options.colId === undefined){
				this.colId = 2;
			}else{
				this.colId = options.colId;
			}
		}else{
			this.speed = 10;
			this.id = 2;
		}

		this.vel.y = this.speed;
		this.width = 16;
		this.height = 16;
		
		this.origin.x = this.width/2;
		this.origin.y = this.height/2;
		
		this.radius = 8;
		this.type = 'projectile';
		
		Game.addEntity(this);
	}
	
	Projectile.prototype = new Sprite();
	this.Projectile = Projectile;
	
	// public
	Projectile.prototype.update = function(deltaTime)
    {
		this.pos.x += this.vel.x * deltaTime;
		this.pos.y += this.vel.y * deltaTime;
				
		if(this.pos.y < 5 || this.pos.y > Game.bounds.y + Game.bounds.height){
			this.live = false;
		}
		//Sprite.prototype.update();
    };
})();