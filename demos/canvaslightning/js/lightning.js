(function () {
	var utilities = new Utilities();	
	
    function Lightning(options)
    {   
		this.x = 0;
		this.y = 20;
		this.tx = 640;
		this.ty = 20;
		this.behaviour = 1;
		this.thickness = 0;
		
		if(options !== undefined){
			// Set x
			if(options.x !== undefined){
				this.x = options.x;
			}
			
			// Set y
			if(options.y !== undefined){
				this.y = options.y;
			}
			
			if(options.tx !== undefined){
				this.tx = options.tx;
			}
			
			// Set y
			if(options.ty !== undefined){
				this.ty = options.tx;
			}
			
			if(options.behaviour !== undefined){
				this.behaviour = options.behaviour;
			}
			
			if(options.thickness !== undefined){
				this.thickness = options.thickness;
			}
			
			// Set bolt length
			if(options.boltLength !== undefined){
				this.boltLength = options.boltLength;
			}
			
			// Set bolt rotation speed
			if(options.speed !== undefined){
				this.speed = options.speed;
			}
		}
		
		this.startColor = "36ff00";
		this.endColor = "f0ff00";
		this.colorArr = utilities.fadeColor(this.startColor, this.endColor, 15);
		this.angle = utilities.getRandomRange(1,360);
    }
    
    this.Lightning = Lightning;
    
// public
	// Update the lightning
    Lightning.prototype.update = function(deltaTime)
    {		
		switch(this.behaviour){
		case 1:
			this.tx = Glow.events.mX;
			this.ty = Glow.events.mY;
			break;
		case 2:
			var dx = this.tx - Glow.events.mX,
				dy = this.ty - Glow.events.mY,
				dist = Math.sqrt (dx * dx + dy * dy);
			
			dx = this.x - Glow.events.mX;
			dy = this.y - Glow.events.mY;
			var dist2 = Math.sqrt (dx * dx + dy * dy);
				
			if(dist < this.boltLength && dist2 < this.boltLength){
				this.tx = Glow.events.mX;
				this.ty = Glow.events.mY;
			}else{
				this.angle+=this.speed;
				this.tx = this.boltLength * Math.sin((this.angle * Math.PI / 180));
				this.ty = this.boltLength * Math.cos((this.angle * Math.PI / 180));
				
				this.tx += this.x;
				this.ty += this.y;
			}
			break;
		}
    };
	
	// Draw
    Lightning.prototype.draw = function(_context)
    {
		_context.save();
		_context.beginPath();
		for(var i =0; i<=this.thickness; i++){
			if (Math.random() < .3)
			{
				var dx = this.x - this.tx,
					dy = this.y - this.ty,
					dist = Math.sqrt (dx * dx + dy * dy),
					radians = Math.atan2 (dy, dx),
					theAngle = radians * 180 / Math.PI,
					traveled = 0,
					linethickness = 4,
					alpha = .1,
					theX = this.x,
					theY = this.y,
					segment = 0;
				
				while (traveled < dist - 20)
				{
					_context.beginPath();
					_context.moveTo (theX, theY);
				
					var speed = Math.random() *2 + 30,
						tmpAngle = theAngle * Math.PI / 180,
						bx = traveled * Math.cos(tmpAngle),
						by = traveled * Math.sin(tmpAngle),
						theX = (this.x - bx) + Math.random () * 25 - 13,
						theY = (this.y - by) + Math.random () * 25 - 13;
					
					segment+=1;					
					traveled += speed;
					alpha += .4;					
					if(linethickness > 1){
						linethickness--;
					}else{
						linethickness = 1;
					}
					
					_context.lineWidth = linethickness;
					_context.strokeStyle = "rgb(" + this.colorArr[segment] + ")";
					//_context.strokeStyle = "rgba(160,160,255," + alpha + ")";  
					_context.lineTo (theX, theY);	
					_context.stroke();
					_context.closePath();
				}
				
				_context.beginPath();
				_context.moveTo (theX, theY);
				_context.lineTo (this.tx, this.ty);
			}
		}
		_context.stroke();
		_context.closePath();
		_context.restore();
    };	
})();