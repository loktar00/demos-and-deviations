(function () {
	var utilities = new Utilities();	
	
	function Slice(options){
		Sprite.call(this, options);
		this.x = Game.bounds.width/2;
		this.y = Game.bounds.height/2;
		this.slices = 10;
	}
	
	Slice.prototype = new Sprite();
	this.Slice = Slice;

	Slice.prototype.render = function(context){
		var slice = 360/this.slices;

		for(var i = 0; i < this.slices; i++){		  
			context.fillStyle = "rgba(255,255,255,0.1)";
			context.beginPath();
			context.moveTo(this.x,this.y);
			context.arc(this.x,this.y,300,(slice*i)*Math.PI/180,((slice*i)+slice-0.5)*Math.PI/180);
			context.fill();			
		}
	};
})();