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
    function Player (_x, _y, _torsoSrc, _legSrc, _totalFrames, _width, _height, _currentLevel)
    {
        this.id = idCounter+=1; 
        
		// Local position
		this.x  = _x- _width/2;
        this.y  = _y- _height/2;
		
		// Used for shooting, stores the projected coordinates
		this.pointX = 0;
		this.pointY = 0;
		
		//Use if the player is unlocked from the map
		this.xSpeed = 0;
		this.ySpeed = 0;
		
		this.currentLevel = _currentLevel; 			// passed reference for current level
		this.globalX = this.x - _currentLevel.x;	// Global coordiantes of the player, combination of where the player is located plus the maps location
		this.globalY = this.y - _currentLevel.y
		
		// Images for torso and legs, because for the player they are detached
		this.torso = _torsoSrc;
		this.legs = _legSrc;
		this.width = _width;
		this.height = _height;
		this.angle = 0;
		this.direction = 0;
		this.range = 400; 
		
		// Handles the animation
		this.totalFrames = _totalFrames;
		this.currentFrame = 1;
		this.frameDelay = 65;
		this.time  = 0;
		
		// Vars for gamelogic
		this.lives = 2;
		this.score = 0;
    }
    
    global.Player = Player;
    
// public

    Player.prototype.update = function (deltaTime)
    {	
		// Determines if the player should be animated or not
		if(rightDown === true || leftDown === true || upDown === true || downDown === true){
			if( ((new Date()).getTime() - this.time) > this.frameDelay){
				this.time = (new Date()).getTime();
				if(this.currentFrame <= this.totalFrames){
					this.currentFrame+=1;
				}else{
					this.currentFrame = 1;
				}
			}
		}
		
		// Determines what direction the bottom half should be facing, calculates speed
		if (rightDown === true && this.x < this.currentLevel.width - this.width){
			this.direction = 90;
			this.xSpeed = this.currentLevel.speed;
		}
		
		if (leftDown === true && this.x > 0){
			this.direction = -90;
			this.xSpeed = -this.currentLevel.speed;
		}
		
		if(upDown === true && this.y > 0){
			this.direction = 0;
			this.ySpeed = -this.currentLevel.speed;
		}
		
		if(downDown === true && this.y < (this.currentLevel.height - this.height)){
			this.direction = 180;
			this.ySpeed = this.currentLevel.speed;
		}
		
		if(upDown === true && rightDown === true){
			this.direction = 45;
		}
		
		if(upDown === true && leftDown === true){
			this.direction = -45;
		}
		
		if(downDown === true && rightDown === true){
			this.direction = 135;
		}
		
		if(downDown === true && leftDown === true){
			this.direction = -135;
		}
		
		// Handles player movement if the map is locked, meaning its gone to the edge of its viewable boundaries.
		if (this.currentLevel.lockUp === true || this.currentLevel.lockDown === true){
			this.y += this.ySpeed * deltaTime;
		}
				
		if (this.currentLevel.lockRight === true || this.currentLevel.lockLeft === true){
				this.x += this.xSpeed * deltaTime; 
		}
		
		
		// checks all 4 directions to see if the player has moved back to the center of the map, if so then scroll the map as normal.
		if(this.currentLevel.lockRight === true){
			if(this.x <= (this.currentLevel.width / 2)-this.width/2){
				this.currentLevel.lockRight = false;
			}
		}
		if(this.currentLevel.lockLeft === true){
			if(this.x >= (this.currentLevel.width / 2)-this.width/2){
				this.currentLevel.lockLeft = false;
			}
		}
		if(this.currentLevel.lockUp === true){
			if(this.y >= (this.currentLevel.height / 2)-this.height/2){
				this.currentLevel.lockUp = false;
			}
		}
		if(this.currentLevel.lockDown === true){
			if(this.y <= (this.currentLevel.height / 2)-this.height/2){
				this.currentLevel.lockDown = false;
			}
		}
		
		// Update the players global coordinates
		this.globalX = this.x - this.currentLevel.x;	
		this.globalY = this.y - this.currentLevel.y
		
		// reset the speeds
		this.xSpeed = 0;		
		this.ySpeed = 0;
		
		// Check for mouse events
		if(mouseDown){
			// Implement shooting logic here
		}
		
    };
	
	// Return the players current rotation in relation to the mouse pointer
	Player.prototype.getRotation = function(){
		var pX = mouseX - this.x - this.width/2,
			pY = mouseY - this.y - this.height/2;

		return Math.atan2(pX,-pY);
	}
	
	// Return point directly in front of the player by a specified radius
	Player.prototype.getLineOfSight = function(_playerX, _playerY, _radius, _angle){
		var lineOfSight = new Object,
			rad =  Math.PI / 180
		
        lineOfSight.x = _playerX + _radius * Math.cos(-_angle * rad);
        lineOfSight.y = _playerY + _radius * Math.sin(_angle * rad);
       
	   return lineOfSight;
	}
	
	// Draw the players torso and legs
	Player.prototype.draw = function(_context){
		_context.save();
		_context.translate(this.x + (this.width/2), this.y + (this.height/2));		
		_context.rotate(this.direction * 0.0174532925);
		_context.drawImage(this.legs, (this.width * this.currentFrame)-this.width, 0, this.width, this.height, (this.x-this.x)-this.width/2, (this.y-this.y)-this.height/2, this.width,this.height);
		_context.restore();
		
		_context.save();
		_context.translate(this.x + (this.width/2), this.y + (this.height/2));
		_context.rotate(this.getRotation());
		_context.drawImage(this.torso, (this.width * this.currentFrame)-this.width, 0, this.width, this.height, (this.x-this.x)-this.width/2, (this.y-this.y)-this.height/2, this.width,this.height);
		_context.restore();
		
		// Player is shooting, so lets check collisions
		if(mouseDown === true){			
			var lineOfSight = this.getLineOfSight(this.x + (this.width/2), this.y + (this.height/2), this.range,(this.getRotation() * (180 / Math.PI)) - 90); 		
			
			// For debugging purposes to see the line of fire
			/*_context.beginPath();  
			_context.moveTo(this.x + (this.width/2), this.y + (this.height/2));  
			_context.lineTo(lineOfSight.x, lineOfSight.y);   
			_context.closePath();  
			_context.stroke();  
			*/

			for (var p=0; p <= this.range; p += 20 ){
				lineOfSight = this.getLineOfSight(this.x + (this.width/2), this.y + (this.height/2), p,(this.getRotation() * (180 / Math.PI)) - 90); 		
				for (var id in entities){
					var object = entities[id];
					if(object !== this && object.health !== -1){
						if(utilities.getDistance(lineOfSight, object) <= 20){
							object.health -= 25;
							mouseDown = false;
							p = this.range + 1;
							break;
						}
					}
				}
			}
			mouseDown = false;
		}
	}
	
})();