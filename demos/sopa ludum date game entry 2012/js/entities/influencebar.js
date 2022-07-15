// Main player
(function () {
	var utilities = new Utilities();	
	
	//constructor
    function InfluenceBar(options)
    {  		
		Sprite.call(this, options);
		this.track = options.track;
		this.max = options.max;
		
		this.maxWidth = this.width;
		this.origin.x = this.width/2;
		this.origin.y = this.height/2;
	}
	
	InfluenceBar.prototype = new Sprite();
	this.InfluenceBar = InfluenceBar;
	
	InfluenceBar.prototype.update = function(deltaTime)
    {	
		Sprite.prototype.update(deltaTime);	
		this.width = ((this.maxWidth/100) * Game.gameState.influence)*100;
    };
})();