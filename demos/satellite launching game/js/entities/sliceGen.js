(function () {
	var utilities = new Utilities();	
	
	function Slice(options){
		this.sliceNumber = 2;
		this.numSlices = 10;
		this.radius = 600;
		this.width = 600;
		
		if(options.sliceNumber){
			this.sliceNumber = options.sliceNumber;
		}
		
		if(options.radius){
			this.radius = options.radius;
		}
		
		if(options.numSlices){
			this.numSlices = options.numSlices;
		}
		
		var tempCanvas = document.createElement('canvas'),
			tempCtx = tempCanvas.getContext("2d"),
			cX = 0,
			cY = 0,
			slice = 360/this.numSlices;
			
			tempCanvas.width = this.radius/2;
			tempCanvas.height = this.radius/2;
			
			tempCtx.fillStyle = "rgba(255,0,0,1)";
			tempCtx.beginPath();
			tempCtx.moveTo(cX, cY);
			tempCtx.arc(cX,cY,this.radius/2,0* Math.PI / 180,(slice)* Math.PI / 180);
			tempCtx.fill();
			tempCtx.lineTo(cX,cY);
			//tempCtx.stroke();
			tempCtx.closePath();

			document.body.appendChild(tempCanvas);
			var resource = {};
				resource.source = tempCanvas;
			utilities.preCalcRotation(resource, 10, this.radius/2, this.radius/3.33, 0);
	}
	
	this.Slice = Slice;

})();