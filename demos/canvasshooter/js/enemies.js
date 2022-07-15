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

// class variables
    var idCounter = 0;
	
// constructor
    function Enemy (_x, _y, _imgSrc, _totalFrames, _width, _height, _currentLevel)
    {
		this.id = idCounter+=1; 
        
		// Local position
		this.x  = _x;
        this.y  = _y;
		
		this.speed = 15;
		
		this.health = 100;
		
		this.currentLevel = _currentLevel; 
		this.globalX = _currentLevel.x;	// Global positioning.. im all GPS on yo ass!
		this.globalY = _currentLevel.y
		
		this.image = _imgSrc;
		this.width = _width;
		this.height = _height;
		this.frameSize = _width;
		
		this.angle = 0;
		this.direction = utilities.getRandomRange(0,300);
		
		// Handles the animation
		this.totalFrames = _totalFrames;
		this.currentFrame = 1;
		this.frameDelay = 35;
		this.time  = 0;
		
		//Setup the prerendered rotated images
		//this.rotate(23);

    }
    
    global.Enemy = Enemy;
    
// public

	Enemy.prototype.getRotation = function(){
		var pX = player.x - this.globalX,
			pY = player.y - this.globalY;

		return Math.atan2(pX,-pY)/(0.0174);
	}
	
    Enemy.prototype.update = function(deltaTime)
    {
		if(this.health != 0){
			if( ((new Date()).getTime() - this.time) > this.frameDelay){
				this.time = (new Date()).getTime();
				if(this.currentFrame <= this.totalFrames){
					this.currentFrame+=1;
				}else{
					if(this.health != -1){
						this.currentFrame = 1;
					}else{
						//removeEntity(this);
						//this.currentFrame = this.totalFrames+1;
					}
				}				
			}
			
			if(this.health > 0){
				this.direction = this.getRotation();
				this.x += (Math.cos(((-this.direction)-90) *  Math.PI / 180) * this.speed * deltaTime);
				this.y -= (Math.sin(((this.direction)-90) *  Math.PI / 180) * this.speed * deltaTime);
			}
			
				this.globalX = (currentLevel.x - this.x);
				this.globalY = (currentLevel.y - this.y);
		}else{
			this.image = zombie1Death.source;
			this.totalFrames = 21;
			this.health = -1;
			this.currentFrame = 1;
		}
    };
	
    Enemy.prototype.draw = function(_context)
    {	
		if (this.globalX >= -this.width && this.globalX <= this.currentLevel.width){
			if (this.globalY >= -this.height && this.globalY <= this.currentLevel.height){
				_context.save();
				_context.translate(this.globalX + (this.width/2), this.globalY + (this.height/2));		
				//_context.rotate(this.direction * 0.0174532925);
				if(this.health != -1){
					_context.drawImage(this.image, (this.width * this.currentFrame)-this.width, this.height * parseInt(Math.round(((this.direction) + 180)/23)), this.width, this.height, (this.globalX-this.globalX)-this.width/2, (this.globalY-this.globalY)-this.height/2, this.width,this.height);
				}else{
					_context.rotate(this.direction * 0.0174532925);
					_context.drawImage(this.image, (this.width * this.currentFrame)-this.width, 0, this.width, this.height, (this.globalX-this.globalX)-this.width/2, (this.globalY-this.globalY)-this.height/2, this.width,this.height);
				}
				_context.restore();
			}
		}
    };	
})();