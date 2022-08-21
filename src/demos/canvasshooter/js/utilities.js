/*
 Copyright (c) 2010, Jason Brown
 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.

*/

var global = this;

(function () {

	function Utilities(){
		// Constructor
	}

	global.Utilities = Utilities;

	Utilities.prototype.getRandomRange = function(_min, _max){   
		return Math.floor(Math.random()*_max+_min)
	}
	
	// Tweak for z-ordering later on
	Utilities.prototype.sortByYPos = function(a, b){
		var x = a.y,
			y = b.y;
		
		return ((x < y) ? 1 : ((x > y) ? -1 : 0));
	}
	
	// Sort by x val
	Utilities.prototype.sortByXPos = function(a, b){
		var x = a.x,
			y = b.x;
		
		return ((x < y) ? 1 : ((x > y) ? -1 : 0));
	}
	
	Utilities.prototype.getDistance = function(a, b){
		return Math.sqrt(((b.globalX + b.width/2)-a.x)*((b.globalX + b.width/2)-a.x)+((b.globalY + b.height/2)-a.y)*((b.globalY + b.height/2)-a.y));
	}
	
	// Setup a 2d array
	Utilities.prototype.create2DArray = function(d1, d2) {
		var x = new Array(d1),
		i = 0,
		j = 0;
		
		for (i = 0; i < d1; i += 1) {
			x[i] = new Array(d2);
		}
	  
		for (i=0; i < d1; i += 1) {
			for (j = 0; j < d2; j += 1) {
				x[i][j] = 0;
			}
		}

		return x;
	}			
	
	Utilities.prototype.rotateImage = function(_steps, _srcImage, _frames, _frameSize){
		var direction = 180, // Starting direction
			eCanvas = document.createElement("canvas"),
			context = eCanvas.getContext("2d"),
			canvasTemp = document.createElement("canvas"),
			tempContext = canvasTemp.getContext("2d"),
			returnImg = new Image();
			
			tempContext.drawImage(_srcImage, 0,0, _frameSize, 0); 
						
			eCanvas.height = (_frameSize * parseInt(Math.ceil(360/_steps))) + 128;
			eCanvas.width = (_frameSize * _frames) + 128;

		for(var j=0; j<= parseInt(Math.ceil(360/_steps)); j++){
			for(var i=0; i<= _frames; i++){
				tempContext.drawImage(_srcImage, i*_frameSize,0, (i*_frameSize) + _frameSize, 0); 
				
				tempContext.save();
				tempContext.clearRect(0,0,_frameSize,_frameSize); 
				tempContext.translate((_frameSize/2),(_frameSize/2));		
				tempContext.rotate(direction * 0.0174532925);
				tempContext.drawImage(_srcImage, i*_frameSize,0, _frameSize, _frameSize, -_frameSize/2, -_frameSize/2, _frameSize, _frameSize);
				tempContext.restore();
				
				var imageData = tempContext.getImageData(0,0,_frameSize,_frameSize);

				context.save();
				context.putImageData(imageData, i*_frameSize,j*_frameSize);
				context.restore();
			}
			direction += _steps;
		}
		
		returnImg.src = eCanvas.toDataURL();
		$(eCanvas).remove();
		//alert(returnImg.width + " : " + returnImg.height);
		//document.getElementById("imgtest").src = returnImg.src;
		return returnImg.src;
	}
	
})();