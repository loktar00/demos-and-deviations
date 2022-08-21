(function () {
	var utilities = new Utilities();	
	
	//constructor
    function Station(options)
    {  		
		Sprite.call(this, options);
		this.width = 32;
		this.height = 32;
		this.origin = new Vector(16,16,0);
		this.clickable = true;
		this.health = 100;
		this.owner = 0;
		
		// reference to the powerbar sprite so we can do the powa thingy
		this.powerBar = options.powerBar;
	}
	
	Station.prototype = new Sprite();
	this.Station = Station;

	Station.prototype.update = function(deltaTime)
    {	
		Sprite.prototype.update();
		this.startX = 32*this.owner;		
    };
	
	Station.prototype.clicked = function(ai){
		if(this.owner === 1 || ai){
			if(this.powerBar.visible){
				this.powerBar.visible = false;
				var ringTarget = 100+(16 * Math.round((this.powerBar.range-16)/16));
				
				if(ringTarget < 116){
					ringTarget = 116;
				}
				
				var asset = new Asset({x : this.x, y : this.y, z : 91, resource : Game.resourceManager.getResource('asset'), targetRadius : ringTarget, owner : this.owner});
				Game.addEntity(asset);
			}else{
				this.powerBar.dir = 1;
				this.powerBar.range = 0;
				this.powerBar.visible = true;
			}
		}
	}
})();