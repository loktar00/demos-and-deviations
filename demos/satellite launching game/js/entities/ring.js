(function () {

	function Ring(options){
		Sprite.call(this, options);
		this.size = 640;
		this.color = "rgb(0,0,255)";
		this.scaleX = 0.3;
		this.scaleY = 1;
		
		if(options.size){
			this.size = options.size;
		}
		
		if(options.color){
			this.color = options.color;
		}
		
		
		Game.addEntity(this);
	}
	
	Ring.prototype = new Sprite();
	this.Ring = Ring;
	
	Ring.prototype.update = function(deltaTime){
		Sprite.prototype.update();
	}
	
	Ring.prototype.render = function(context){
		context.strokeStyle = this.color;
		context.beginPath();
		context.arc(this.pos.x,this.pos.y,this.size,0,Math.PI*2, true);
		context.stroke();
	}
})();