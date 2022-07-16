(function () {
	var utilities = new Utilities();	
	
    function Shape(options)
    {  
		this.x = 0;
		this.y = 20;
		this.size = 50;
		
		if(options !== undefined){
			// Set x
			if(options.x !== undefined){
				this.x = options.x;
			}
			
			// Set y
			if(options.y !== undefined){
				this.y = options.y;
			}
			
			// Set circumferance
			if(options.size !== undefined){
				this.size = options.size;
			}
		}
    }
    
    this.Shape = Shape;
    
// public
    Shape.prototype.update = function(deltaTime)
    {		

    };
	
	// Draw
    Shape.prototype.draw = function(_context)
    {
		_context.save();
		_context.beginPath();
		_context.lineWidth = 5;
		_context.strokeStyle =  "rgb(255,255,255)";  
		_context.arc(this.x,this.y, this.size,0,Math.PI*2,true); // Outer circle  
		_context.stroke();
		_context.closePath();
		_context.restore();
    };	
})();