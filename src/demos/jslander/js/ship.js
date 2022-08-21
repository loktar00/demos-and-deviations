(function () {
	var utilities = new Utilities();	
	
    function Ship (width, height, terrainObj)
    {    
		// Local position
		this.thrust = 0;
		this.vel = new Vector(width / 2, 10, 0);
		this.acc = new Vector(0,0,0);
		this.pos = this.vel;
		this.scaler = 0.2;
		this.isThrusting = false;
		this.screenW = width;
		this.screenH = height;
		this.zoomed = false;
		this.fuel = 500;
		this.score = 0;
		
		var d = new Date();
		this.startTime = d.getTime();
		this.time = d.getTime();
		this.elapsedTime = this.time - this.startTime;
		
		this.xVel = 0;
		this.yVel = 0;
		
		this.speedLimit = 1;
		
		this.zX = 0;
		this.zY = 0;
		
		// Start the lander facing upward
		this.rot = -90;
		
		// Assign a referance to the terrain
		this.terrain = terrainObj;
		this.landingPads = terrainObj.landingPads;
		
		// Used when the ship explodes
		this.expLines = [];
		this.crashed = false;
		this.landed = false;
		
		this.message = "";
    }
    
    this.Ship = Ship;
    
// public
	Ship.prototype.checkCrashed = function(){
		return this.crashed;
	}
	
	// Resets the ship for new levels, etc
	Ship.prototype.reset = function(){
		// Check if we are doing a reset because the ship crashed.
		if(this.crashed){
			this.fuel = 500;
			this.score = 0;
		}
		
		var d = new Date();
		this.startTime = d.getTime();
		this.time = d.getTime();
		this.elapsedTime = Math.round((this.time - this.startTime)/1000);
		
		this.thrust = 0;
		this.vel = new Vector(this.screenW / 2, 10, 0);
		this.acc = new Vector(0,0,0);
		this.pos = this.vel;
		this.scaler = 0.2;
		this.isThrusting = false;
				
		this.xVel = 0;
		this.yVel = 0;
		
		this.zX = 0;
		this.zY = 0;
		
		// Start the lander facing upward
		this.rot = -90;
		
		// Used when the ship explodes
		this.expLines = [];
		this.crashed = false;
		this.landed = false;
		
		// Reset zooming
		this.zoomed = false;
		Lander.settings.zoom = 1;
		Lander.settings.zx = 1;
		Lander.settings.zy = 1;
		
		this.terrain.draw(1, 1, 1);
		this.landingPads = this.terrain.landingPads;
		this.curPad = undefined;
	}
	
	// Handles updating the ship
    Ship.prototype.update = function(deltaTime)
    {
		var landerEvents = Lander.events,
			gravity = Lander.settings.gravity,
			dX = 0,
			dY = 0;
			
		if(!this.crashed && !this.landed){
			var d = new Date();
			this.time = d.getTime();
			
			if(landerEvents.up){
				if(this.fuel > 0){
					if(this.zoomed){
						if(this.thrust < 0.03){
							this.thrust += 0.0002;
						}	
					}else{
						if(this.thrust < 0.015){
							this.thrust += 0.0001;
						}		
					}
				}else{
					this.thrust = 0;
				}
			}else if(landerEvents.down){
				if(this.zoomed){
					if(this.thrust > 0){
						this.thrust -= 0.0002;
					}	
				}else{
					if(this.thrust > 0){
						this.thrust -= 0.0001;
					}		
				}
			}
			
			// Check if the lander is thrusting "OH YEAH!"
			if(this.thrust > 0 && this.fuel > 0){
				this.fuel -= this.thrust * 100/20;
				this.isThrusting = true;
			}else{
				this.isThrusting = false;
			}
			
			
			this.acc.x += (Math.cos(((this.rot)) *  Math.PI / 180) * this.thrust * deltaTime);
			this.acc.y += (Math.sin(((this.rot)) *  Math.PI / 180) * this.thrust * deltaTime);	

			if(landerEvents.left){
				if(this.rot > -150){
					this.rot -= 1;
				}else{
					this.rot = -150;
				}
			}
			
			if(landerEvents.right){
				if(this.rot < -30){
					this.rot += 1;
				}else{
					this.rot = -30;
				}
			}
			
			var padsLen = this.landingPads.length,
				pads = this.landingPads;

			if(!this.zoomed){

				for(var i = 0; i< padsLen; i++){
					dX = (pads[i].x +  pads[i].padLength/ 2) - this.pos.x;
					dY = pads[i].y - this.pos.y;
					
					if(Math.sqrt((dX * dX) + (dY * dY)) < 60){
						this.zoomed = true;
						
						Lander.settings.zoom = 3;
						Lander.settings.zx = this.pos.x - ((this.screenW / 2)/3);
						Lander.settings.zy = (this.pos.y * 2) - 10;
						
						this.acc.x *= 2;
						this.acc.y *= 2;
						
						this.curPad = i;
						this.terrain.draw(3, this.pos.x - ((this.screenW / 2)/3), (this.pos.y * 2) - 10);
						this.offsetX = this.pos.x - ((this.screenW / 2)/3);
						this.offsetY = (this.pos.y * 2) - 10;
						
						this.zX = this.screenW / 2;
						this.zY = this.pos.y * 2;

						this.pos.x = this.zX;
						this.scaler = 0.5;
						break;
					}
				}
			}else{
				
				dX = ((pads[this.curPad].x - this.offsetX) * 3) - this.pos.x;
				dY = ((pads[this.curPad].y * 3)- this.offsetY + 10)- this.pos.y;
							
				if(Math.sqrt((dX * dX) + (dY *dY)) > 250){
						this.zoomed = false;
						Lander.settings.zoom = 1;
						Lander.settings.zx = 1;
						Lander.settings.zy = 1;
						
						this.acc.x *= .5;
						this.acc.y *= .5;
						
						this.terrain.draw(1, 1, 1);
						this.pos.x = pads[this.curPad].x - (((pads[this.curPad].x - this.offsetX) * 3) - this.pos.x)/3;
						this.pos.y = 10 + (pads[this.curPad].y - (this.offsetY - this.pos.y) / 3);
						
						this.scaler = 0.2;					
						this.curPad = undefined;
					}
			}
			
			if(!this.checkCollision(this.pos.x-18*this.scaler, this.pos.y + (34) * this.scaler)){
				this.acc.x *= .998;
				this.acc.y *= .995;	
				this.vel.x += this.acc.x;
				
				if(this.zoomed){
					this.vel.y += this.acc.y + gravity * 2;
				}else{
					this.vel.y += this.acc.y + gravity;
				}
					
				this.pos = this.vel;
				
				// Screen bounds check
				if(this.pos.x > this.screenW && !this.zoomed){
					this.pos.x=0;
				}else if(this.pos.x < 0  && !this.zoomed){
					this.pos.x = this.screenW-10;
				}
				
			}else{
				// Check if its on one of the pads				
				for(var i = 0; i< padsLen; i++){		
					if(this.pos.x >= ((pads[i].x - this.offsetX) * 3) && this.pos.x <= ((pads[i].x - this.offsetX) * 3) + pads[i].padLength * 3 && this.pos.y  > ((pads[i].y * 3) - this.offsetY)-21 ){
						if(this.rot > -95 && this.rot < -85 && this.yVel >= -6  && this.yVel <= 6){ 
							var score = 0;
							
							if(this.yVel >= -3  && this.yVel <= 3){
								score = 500 * pads[i].multiplier - this.elapsedTime*2;
								this.score += score;
								this.message = "Perfect Landing! " + score + " points scored!";
							}else{
								score = 100 * pads[i].multiplier - this.elapsedTime*2;
								this.message = "Hard Landing, " + score + " points scored.";
								this.score += score;
							}
							
							this.landed = true;
							break;
						}
					}
				}
				
				if(!this.landed){
					for(var lines = 0; lines < 20; lines++){
						var newLine = [];
						
						newLine.x1 = utilities.getRandomRange(-25,25);
						newLine.x2 = utilities.getRandomRange(-25,25);
						newLine.y1 = utilities.getRandomRange(-25,25);
						newLine.y2 = utilities.getRandomRange(-25,25);
						newLine.speedX = utilities.getRandomRange(-2,5);
						newLine.speedY = utilities.getRandomRange(-2,5);
							
						this.expLines.push(newLine);
					}
					
					this.crashed = true;
					
					Lander.message.messageObj.updateMessage("Press Space to Try Again");
					Lander.settings.beginGame = false;
					this.message = "You just crashed a 100 bazzilion dollar lander!";
					this.vel.y = this.vel.y  - 0.1;
					this.pos = this.vel;
				}
			}
			
			// Set the display values
			this.xVel = Math.round(this.acc.x * 1000)/10;
			if(this.zoomed){
				this.yVel = Math.round((this.acc.y/2 + gravity) * 1000)/10;
			}else{
				this.yVel = Math.round((this.acc.y + gravity) * 1000)/10;
			}
		}
    };
	
	// Checks to see if ship has collided with the terrain
	Ship.prototype.checkCollision = function(x, y){
		var terrainData = this.terrain.terContext,
			terrainWidth = this.terrain.terCanvas.width,
			imageData, 
			alpha = 0;
			
		if(this.zoomed){
			check = 20;
		}else{
			check = 8;
		}
		if(x >=0 && x<=terrainWidth && y>=0){
			imageData = terrainData.getImageData(x, y,check,2);
			
			var pxlData = imageData.data;

			for (var i = 0, n = pxlData.length; i < n; i += 4) {
				alpha=imageData.data[i + 3];
				
				if(alpha !== 0){
					return true;
				}
			}			
		}
		
		return false;
	}
	
	// Seperate draw function for the clase instead of the body
	Ship.prototype.drawCrash = function(_context){
		var scaler = this.scaler;
			_context.beginPath();	
			_context.translate(this.pos.x, this.pos.y);
			_context.rotate((this.rot+90) * 0.0174532925);
			_context.strokeStyle = "#fff";
			
			for(l = 0; l < this.expLines.length; l++){
				this.expLines[l].x1 += this.expLines[l].speedX;
				this.expLines[l].y1 += this.expLines[l].speedY;
				this.expLines[l].x2 += this.expLines[l].speedX;
				this.expLines[l].y2 += this.expLines[l].speedY;
				
				_context.moveTo(this.expLines[l].x1, this.expLines[l].y1);
				_context.lineTo(this.expLines[l].x2, this.expLines[l].y2);
				
			}
			_context.stroke();
			_context.closePath();		
	}
	
	// Draws the ship body.
	Ship.prototype.drawBody = function(_context){
			var scaler = this.scaler;
			_context.beginPath();	
			_context.translate(this.pos.x, this.pos.y);
			_context.rotate((this.rot+90) * 0.0174532925);
				
			_context.strokeStyle = "#fff";
			_context.moveTo(-12 * scaler,0);
			_context.lineTo(0,-10 * scaler);
			_context.lineTo(12 * scaler,0);
			_context.lineTo(12 * scaler,12 * scaler);
			_context.lineTo(6 * scaler,20 * scaler);
			_context.lineTo(-6 * scaler,20 * scaler);
			_context.lineTo(-12 * scaler,12 * scaler);
			_context.closePath();
			
			_context.rect(-14 * scaler,20 * scaler,28 * scaler,4 * scaler);
			
			_context.moveTo(-14 * scaler,24 * scaler);
			_context.lineTo(-16 * scaler,32 * scaler);
			_context.lineTo(-22 * scaler,32 * scaler);
			
			_context.moveTo(14 * scaler,24 * scaler);
			_context.lineTo(16 * scaler,32 * scaler);
			_context.lineTo(22 * scaler,32 * scaler);
	
			_context.moveTo(-4 * scaler,24 * scaler);
			_context.lineTo(-10 * scaler,30 * scaler);
			_context.lineTo(10 * scaler,30 * scaler);
			_context.lineTo(4 * scaler,24 * scaler);
			
			if(this.isThrusting){
				_context.moveTo(-10  * scaler ,30  * scaler);
				_context.lineTo(0  * scaler , ((500 * this.thrust) * scaler * 4) + (utilities.getRandomRange(2,4)) + (30  * scaler));
				_context.lineTo(10 * scaler, 30 * scaler);
			}
			
			_context.stroke();
			_context.closePath();
	}
	
	// Draws the ship
    Ship.prototype.draw = function(_context)
    {	
		this.elapsedTime = Math.round((this.time - this.startTime)/1000);
		_context.save();
		// Draw UI stuff.. should make a UI object
		_context.drawString('Score : ' + this.score, arial12,  10, 10);
		_context.drawString('Time : ' + this.elapsedTime, arial12,  10, 30);
		_context.drawString('Fuel : ' + Math.round(this.fuel * 10)/10, arial12,  10, 50);
		_context.drawString('X Velocity : ' + this.xVel, arial12,  680, 10);
		_context.drawString('Y Velocity : ' + this.yVel, arial12,  680, 30);
		_context.drawString('Angle : ' + Math.abs(this.rot + 90), arial12,  680, 50);
		
		//Debug stuff collision area, and y pos
		/*if(this.zoomed){
			_context.drawString('Angle : ' + this.pos.y + " : " + (((this.landingPads[this.curPad].y * 3) - this.offsetY)-21), arial12,  10, 90);
			_context.fillRect(this.pos.x-9,this.pos.y + (34) * this.scaler,18,2);
		}else{
			_context.fillRect(this.pos.x-18*this.scaler,this.pos.y + (34) * this.scaler,8,2);
		}*/
		
		if(this.crashed){
			_context.drawString(this.message,  arial12, (this.screenW/2) - this.message.length*3, this.screenH/3);
			Lander.message.messageObj.updateMessage("Press Space to try again.");
			this.drawCrash(_context);
		}else if(this.landed){
			_context.drawString(this.message,  arial12, (this.screenW/2) - this.message.length*3, this.screenH/3);
			Lander.message.messageObj.updateMessage("Press Space to Take Off.");
			Lander.settings.beginGame = false;
			this.thrust = 0;
			this.drawBody(_context);
		}else{
			this.drawBody(_context);
		}

		_context.restore();
    };	
})();