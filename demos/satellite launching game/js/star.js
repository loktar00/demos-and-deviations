// Stars
(function () {
	
	//constructor
    function Star(options)
    {  		
		Sprite.call(this, options);

		if(options !== undefined){ 
			// Set an extra param for the heck of it.
			if(options.speed === undefined){
				this.speed = 2;
			}else{
				this.speed = options.speed;
			}
			
			if(options.size === undefined){
				this.size = 2;
			}else{
				this.width = options.size;
				this.height = options.size;
			}
		}else{
			this.speed = 2;
			this.width = 2;
			this.height = 2;
		}
		
		this.bg = true;
		this.bgIndex = -1;
	}
	
	Star.prototype = new Sprite();
	this.Star = Star;
	
	// public
	Star.prototype.update = function(deltaTime)
    {
		this.pos.x += this.vel.x * deltaTime;
		this.pos.y += this.vel.y * deltaTime;
    };
})();