	function Selection(options) {  	
		Sprite.call(this, options);
		this.angle = 0;
		options = options || {};
		
		this.width = 40;
		this.height = 40;
		
		this.origin.x = this.width/2;
		this.origin.y = this.height/2;
		
		this.visible = false;
		Game.addEntity(this);
	}
	
	Selection.prototype = new Sprite();
	this.Selection = Selection;
	
	Selection.prototype.update = function(deltaTime){
		Sprite.prototype.update.call(this, deltaTime);
	}
	