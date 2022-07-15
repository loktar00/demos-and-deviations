(function () {	
    function StarScape(options)
    {    
		var utilities = Game.utilities;	
		this.live = true;
		this.width = 0;
		this.height = 0;
		this.curSpeedCheck = 0;
		this.curSpeedMult = 0;
		this.width = Game.bounds.width;
		this.height = Game.bounds.width;
		
		// se if our width and height were passed not doing as much checking as I could because i know ill pass the right stuff!
		if(options !== undefined){
			if(options.width){
				this.width = options.width;
			}
			
			if(options.height){
				this.height = options.height;
			}
		}
		
		var starNum = utilities.getRandomRange(50,70),
			curY = 0,
			curX = 0;
		
		this.starNum = starNum;
		this.stars = [];
		
		for(var s = 0; s < starNum; s++){
			var curY = utilities.getRandomRange(0,this.height),
				curX = utilities.getRandomRange(0, this.width),
				curSpeed = utilities.fGetRandomRange(0.3, 0.8),
				curSize =  utilities.fGetRandomRange(1,2);

			var star = new Star({width: 2, height: 2, x : curX, y :curY, size : curSize, speed: curSpeed/100});
			this.stars.push(star);
			
			// Add entity to the renderer
			Game.addEntity(star);
		}
		
		Game.addEntity(this, true);
    }
    
    this.StarScape = StarScape;
    
// public
	StarScape.prototype.getSprites = function()
    {	
		return this.stars;
    };

	// updates the stars
	// This is not proper. need to fix where stars update handles this
    StarScape.prototype.update = function(deltaTime)
    {	
		var soundmult = 10;
		this.curSpeedCheck++;
		//if(this.curSpeedCheck % 10 == 0){
			if((soundmult*18) > this.curSpeedMult){
				this.curSpeedMult +=50;
			}else{
				// Adjust tpo 
				this.curSpeedMult --;
			}
		//}
		
		for(var star = 0; star < this.starNum; star++){
			this.stars[star].vel.y = this.stars[star].speed * this.curSpeedMult;
			
			if(this.stars[star].pos.y >= this.height){
				this.stars[star].pos.y = 0;
			}
		}
    };
})();