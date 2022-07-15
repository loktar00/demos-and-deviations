var global = this;

(function () {
	function imageData(_img, _size, _frames){
		this.imgSrc = _img;
		
		this.x = 0;
		this.y = 0;
		
		this.frameSize = _size;
		this.frameCount = _frames;
		
		this.width = 128;
		this.height = 128;
		
		//this.canvasTemp = document.getElementById("canvasTemp");
		
		this.canvasTemp = document.createElement("canvas");
		this.canvasTemp.width = 128;
		this.canvasTemp.height = 128;
		
		this.tempContext = this.canvasTemp.getContext("2d");
		this.tempContext.drawImage(this.imgSrc, 0,0, 128, 0); 
	}
	
	global.imageData = imageData;
	
	imageData.prototype.rotate = function (_context, _steps)
    {	
		var direction = 0,
			context = _context;
		
		for(var j=0; j<=this.frameCount; j++){
			for(var i=0; i<= this.frameCount; i++){
				this.tempContext.drawImage(this.imgSrc, i*this.frameSize,0, (i*this.frameSize) + this.frameSize, 0); 
				
				this.tempContext.save();
				this.tempContext.clearRect(0,0,this.frameSize,this.frameSize); 
				this.tempContext.translate((this.frameSize/2),(this.frameSize/2));		
				this.tempContext.rotate(direction * 0.0174532925);
				this.tempContext.drawImage(this.imgSrc, i*this.frameSize,0, this.frameSize, this.frameSize, -this.frameSize/2, -this.frameSize/2, this.frameSize, this.frameSize);
				this.tempContext.restore();
				
				var imageData = this.tempContext.getImageData(0,0,this.frameSize,this.frameSize);
				
				context.save();
				context.putImageData(imageData, i*this.frameSize,j*this.frameSize);
				context.restore();
			}
			direction += _steps;
		}
		
		return 
	}
	
})();

window.onload = function(){
	var canvas = document.createElement("canvas");
		context = canvas.getContext("2d"),
		direction = 0,
		checkLoaded = false,
		imageHldr = new Image(),
		zombieMan = "",
		newImage = new Image();
	
		imageHldr.src = 'images/zombies/zombie1_walk.png';
		
		imageHldr.onload = function(){	
			zombieMan  = new imageData(imageHldr, 128, 17);
			canvas.height = zombieMan.frameSize * 18;
			canvas.width = zombieMan.frameSize * 18;
			zombieMan.rotate(context, 23);
			
			newImage.src = canvas.toDataURL();
			document.getElementById("imgtest").src = newImage.src;	
		};
		
		if (imageHldr.complete) { imageHldr.onload(); }
}
