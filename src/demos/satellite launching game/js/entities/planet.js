// Center planet
(function () {
	var utilities = new Utilities();	
	
	//constructor
    function Planet(options)
    {  		
		Sprite.call(this, options);
		this.width = 128;
		this.height = 128;
		
		// add scaling to the main sprite ?? maybe
		this.scaleX = 0;
		this.scaleY = 0;
		
		Game.addEntity(this);
	}
	
	Planet.prototype = new Sprite();
	this.Planet = Planet;

	Planet.prototype.update = function(deltaTime)
    {	
		Sprite.prototype.update();		
		this.origin.x = (this.width)/2;
		this.origin.y = (this.height)/2;
    };
	
	Planet.prototype.render = function(context)
    {	
		var source = this.resource.source;
		context.drawImage(source,this.startX,this.startY,this.width,this.height, this.pos.x-this.origin.x, this.pos.y-this.origin.y, this.width, this.height);	
    };
})();