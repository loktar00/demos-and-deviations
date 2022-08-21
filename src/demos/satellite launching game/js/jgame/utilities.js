(function () {

	function Utilities(){
		// Constructor
	}

	this.Utilities = Utilities;

	Utilities.prototype.getRandomRange = function(_min, _max){   
		return Math.floor(Math.random()*_max+_min);
	}
	
	Utilities.prototype.fGetRandomRange = function(_min, _max){   
		return Math.random()*_max+_min;
	}
	
	Utilities.prototype.getDistance = function(a, b){
		return Math.sqrt((b.x - a.x) *(b.x - a.x) + (b.y - a.y) * (b.y - a.y));
	}
	
	Utilities.prototype.mouse = function(ev)
	{
		if(ev.pageX || ev.pageY){
			return {x:ev.pageX, y:ev.pageY};
		}
		return {
			x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
			y:ev.clientY + document.body.scrollTop  - document.body.clientTop
		};
	}
	
	Utilities.prototype.getGradColor = function(startColor, endColor, height, width){
		  var scale = -(width-height)/6,
			  r = startColor.r + scale*(endColor.r - startColor.r);
			  b = startColor.b + scale*(endColor.b - startColor.b);
			  g = startColor.g + scale*(endColor.g - startColor.g);

		  return "rgb(" +  Math.round( Math.min(255,  Math.max(0, r))) + "," +  Math.round( Math.min(255,  Math.max(0, g))) + "," +  Math.round( Math.min(255,  Math.max(0, b))) + ")";
	}
	
	Utilities.prototype.preCalcRotation = function(resource, numRotations, frameWidth, frameHeight, offsetAngle){
		var tempCanvas = document.createElement("canvas"),
			tempCtx = tempCanvas.getContext("2d"),
			frameCanvas = document.createElement("canvas"),
			frameCtx = frameCanvas.getContext("2d"),
			frames =  resource.source.width/frameWidth,
			angleIncrement = 360/numRotations;
			startAngle = 0;

		if(offsetAngle){
			startAngle = offsetAngle;
		}
		
		tempCanvas.width = resource.source.width;
		tempCanvas.height = Math.ceil(frameHeight * 360/angleIncrement);
		frameCanvas.width = frameWidth;
		frameCanvas.height = frameHeight;
		
		// goes through each frame and rotates it adding it vertically
		for(var y = 0; y < numRotations; y++){
			for(var x = 0; x < frames; x++){
				frameCtx.clearRect(0,0,frameWidth,frameHeight);
				frameCtx.save();
				frameCtx.translate(frameCanvas.width/2, frameCanvas.height/2);
				frameCtx.rotate((startAngle + angleIncrement*y)*Math.PI/180);
				frameCtx.drawImage(resource.source,frameWidth*x,0,frameWidth,frameHeight,-frameWidth/2,-frameHeight/2,frameWidth,frameHeight); 
				frameCtx.restore();
				tempCtx.drawImage(frameCanvas,0,0,frameWidth,frameHeight,x*frameWidth,y*frameHeight,frameWidth,frameHeight); 
			}
		}
		//document.body.appendChild(tempCanvas);
		resource.source = tempCanvas;
	}
})();