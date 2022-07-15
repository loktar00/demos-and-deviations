	function ResourceBar(options)
    {  		
		Sprite.call(this, options);	
		this.maxPoints = 1500;
		this.maxWidth = 400;
		this.width = 0;
		this.currentPoints = 0;
		this.label = {};
		
		Game.addEntity(this);
	}
	
	ResourceBar.prototype = new Sprite();
	this.ResourceBar = ResourceBar;
	
	ResourceBar.prototype.addPoints = function(points){
		this.currentPoints+=points;
		
		if(this.currentPoints > this.maxPoints){
			this.currentPoints = this.maxPoints;
		}
		Game.gameState.resources = this.currentPoints;
	}	
	
	ResourceBar.prototype.removePoints = function(points){
		this.currentPoints-=points;
		Game.gameState.resources = this.currentPoints;
	}
	
	ResourceBar.prototype.update = function(deltaTime)
    {	
		Sprite.prototype.update(deltaTime);	
		this.width = (this.currentPoints/this.maxPoints)*this.maxWidth;
		
		var label = this.label;
		
		label.text = this.currentPoints + " / " + this.maxPoints;
		label.pos.x = this.pos.x + (this.maxWidth/2) - (this.label.getWidth()/2);
    };