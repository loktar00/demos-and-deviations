// Main player
(function () {
	var utilities = new Utilities();	
	
	//constructor
    function ProgressBar(options)
    {  		
		Sprite.call(this, options);
		this.track = options.track;
		this.max = options.max;
		
		this.maxWidth = this.width;
		this.origin.x = this.width/2;
		this.origin.y = this.height/2;
	}
	
	ProgressBar.prototype = new Sprite();
	this.ProgressBar = ProgressBar;
	
	ProgressBar.prototype.update = function(deltaTime)
    {	
		Sprite.prototype.update(deltaTime);	
		this.width = ((this.maxWidth/100) * (Game.gameState.time/this.max))*100;
		this.origin.x = this.width/2;
		this.origin.y = this.height/2;
    };
})();