(function () {

	var x = null, y = null, z = null,
		sx = null, sy = null, sz = null,
		userData = null,
		dx = null, dy = null, dz = null,
		tx = null, ty = null, tz = null;
		
	function Vector(x, y, z)
    {
		this.x = x;
		this.y = y;
		this.z = z;
	
		copy = function(v){
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
		},
		add = function(v){
			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
		},
		sub = function(v){
			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
		},
		cross = function(v){
			this.tx = this.x;
			this.ty = this.y;
			this.tz = this.z;
			
			this.x = this.ty * v.z - this.tz * v.y;
			this.y = this.tz * v.x - this.tx * v.z;
			this.z = this.tx * v.y - this.ty * v.x;
		},
		multiply = function(s){
			this.x *= s;
			this.y *= s;
			this.z *= s;
		},
		distanceTo = function(v){
			this.dx = this.x - v.x;
			this.dy = this.y - v.y;
			this.dz = this.z - v.z;
			
			return Math.sqrt(this.dx * this.dx + this.dy * this.dy + this.dz * this.dz);
		},
		
		distanceToSquared = function(v){
			this.dx = this.x - v.x;
			this.dy = this.y - v.y;
			this.dz = this.z - v.z;
			
			return this.dx * this.dx + this.dy * this.dy + this.dz * this.dz;
		},
		
		length = function(){
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		},
		
		lengthSq = function(){
			return this.x * this.x + this.y * this.y + this.z * this.z;
		},
		
		negate = function(){
			this.x = -this.x;
			this.y = -this.y;
			this.z = -this.z;
		},
		
		normalize = function(){
			if (this.length() > 0)
				this.ool = 1.0 / this.length();
			else
				this.ool = 0;
				
			this.x *= this.ool;
			this.y *= this.ool;
			this.z *= this.ool;
			return this;
		},
		
		dot = function(v){
			return this.x * v.x + this.y * v.y + this.z * v.z;
		},
		
		clone = function(){
			return new Vector(this.x, this.y, this.z);
		},
		
		toString = function(){
			return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
		}
		
	}
	
	this.Vector = Vector;
	
	Vector.prototype.add = function(a, b)
	{
		return new Vector( a.x + b.x, a.y + b.y, a.z + b.z );
	}

	Vector.prototype.sub = function(a, b)
	{
		return new Vector( a.x - b.x, a.y - b.y, a.z - b.z );
	}		

	Vector.prototype.multiply = function(a, s)
	{
		return new Vector( a.x * s, a.y * s, a.z * s );
	}

	Vector.prototype.cross = function(a, b)
	{
		return new Vector( a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x );
	}

	Vector.prototype.dot = function(a, b)
	{
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	
})();

(function () {

	function Utilities(){
		// Constructor
	}

	this.Utilities = Utilities;

	Utilities.prototype.getRandomRange = function(_min, _max){   
		return Math.floor(Math.random()*_max+_min)
	}
	
	Utilities.prototype.getDistance = function(a, b){
		return Math.sqrt(((b.globalX + b.width/2)-a.x)*((b.globalX + b.width/2)-a.x)+((b.globalY + b.height/2)-a.y)*((b.globalY + b.height/2)-a.y));
	}
	
	Utilities.prototype.dot = function(a, b)
	{
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	
})();

(function () {
	
	function Renderer(canvas){
		this._renderItems  = [];
		this.init(canvas);
	}

	this.Renderer = Renderer;

	Renderer.prototype.init = function (canvas)
	{
		this._canvas    = canvas;
		this._context   = this._canvas.getContext("2d");
		this._width     = this._canvas.width;
		this._height    = this._canvas.height;
	};

	Renderer.prototype.redraw = function ()
	{
		draw.apply(this);
	};
    
	Renderer.prototype.addToRenderer = function (object)
    {
        this._renderItems.push(object);
    };
	
	Renderer.prototype.removeFromRenderer = function (object)
    {
		for (var id in this._renderItems) {
			if(this._renderItems[id] === object){
				this._renderItems.splice(id,1);
			}
		}
    };
	
// private
    function draw ()
    {	
		var id = 0;
		this._context.clearRect(0,0,this._width,this._height);
		
		for (id =0; id < this._renderItems.length; id++) {
			var curObject = this._renderItems[id];	
			curObject.draw(this._context);
		}
    }

})();

(function () {
	var utilities = new Utilities();	
	
    function Message(options)
    {
		// Required options
		this.message = options.message;
		this.pos = new Vector(options.x,options.y,0);
		this.font = options.font;
		this.type = 1;
		this.visible = 1;
		
		if(options.type){
			this.type = options.type;
		}
		
		if(this.type === 2 && options.blinkTime){
			this.lastBlinkTime = 0;
			this.blinkTime = options.blinkTime;
		}
	}
    
    this.Message = Message;
    Message.prototype.update = function(deltaTime){
		var curTime = (new Date()).getTime();

		if(this.type === 2 && curTime > this.lastBlinkTime + this.blinkTime){
			this.lastBlinkTime = curTime;
			this.visible = Math.abs(this.visible) - 1;
		}
	}
	
	 Message.prototype.updateMessage = function(message){
		this.message = message;
	}
	
    Message.prototype.draw = function(_context)
    {	
		if(this.visible){
			_context.save();
			_context.drawString(this.message,  this.font, this.pos.x, this.pos.y);
			_context.restore();
		}
    };
})();

(function () {
	var utilities = new Utilities();	
	
    function Terrain(terrainLength, height, power)
    {    
		this.terCanvas = document.getElementById("bgCanvas");
		this.terCanvas.width = terrainLength;
		this.terCanvas.height = height;
		this.terContext = this.terCanvas.getContext("2d");
		this.y = [];
		this.displacement = 180;
		this.landingPads = [];
		this.power = power;
		this.terrainLength = terrainLength;
		this.blinkTime = 500;
		this.lastBlinkTime = 0;
		this.messages = [];
		
		this.y[0] = 450;
		this.y[this.power] = 450;
		
		for(var i = 1; i<power; i*=2){
			for(var j = (power/i)/2; j <power; j+=power/i){
				this.y[j] = ((this.y[j - (power/i)/2] + this.y[j + (power/i)/2]) / 2) + utilities.getRandomRange(-this.displacement, this.displacement);
			}
			this.displacement *= 0.7;
		}
		
		this.createLandingPads(200, 30);
    }
    
    this.Terrain = Terrain;
    
// public
	// Draws the terrain
    Terrain.prototype.draw = function(zoom, x, y)
    {	
		this.terContext.save();
		this.terContext.clearRect(0,0,this.terCanvas.width,this.terCanvas.height);
		this.terContext.strokeStyle = "#fff";
		this.terContext.lineWidth = 1;
					
		this.terContext.beginPath();
		
			for(var i = 0; i<=this.terCanvas.width; i+=3){
				if(i === 0){
					this.terContext.moveTo(0, this.y[0] * zoom);
				}else if(this.y[i] !== undefined){
					this.terContext.lineTo((i - x) * zoom, (this.y[i] * zoom) - y );
				}
			}
					
		this.terContext.stroke();
		
		var points = 0;
		
		for(var i = 0; i < this.messages.length; i++){
			Lander.removeEntity(this.messages[i]);
		}
		
		this.messages = [];
		
		for(var i = 0; i < this.landingPads.length; i++){
			
			if(this.landingPads[i].padLength === 10){
				this.landingPads[i].multiplier = 5;
				points = 5;
			}else if(this.landingPads[i].padLength > 10 && this.landingPads[i].padLength <= 20){
				this.landingPads[i].multiplier = 3;
				points = 3;
			}else{
				this.landingPads[i].multiplier = 1;
				points = 1;
			}
			
			var mesObj = new Message({message : points + 'x', x : ((this.landingPads[i].x + this.landingPads[i].padLength/2)- x) * zoom, y : (this.landingPads[i].y * zoom) - y + 10, font : arial12, type : 2, blinkTime : 500});
			Lander.addEntity(mesObj);
			this.messages.push(mesObj);
		}
	
		this.terContext.restore();
    };
	
	// Change the level
	Terrain.prototype.nextLevel = function(level){
		var maxPadLength = 30,
			power = this.power,
			terrainLength = this.terrainLength;
			
		if(level < 5){
			maxPadLength -= 5 * level;
		}
		
		this.y = [];
		this.displacement = 180;
		this.landingPads = [];
		
		this.y[0] = 400;
		this.y[power] = 400;
		
		for(var i = 1; i<power; i*=2){
			for(var j = (power/i)/2; j <power; j+=power/i){
				this.y[j] = ((this.y[j - (power/i)/2] + this.y[j + (power/i)/2]) / 2) + utilities.getRandomRange(-this.displacement, this.displacement);
			}
			this.displacement *= 0.7;
		}
		
		this.createLandingPads(200, maxPadLength);
	}
	
	//make some landing pads
	Terrain.prototype.createLandingPads = function(minDistance, maxPadLength){
		var maxPads = parseInt(this.terrainLength/minDistance);
		
		for(var j = 0; j < maxPads; j++){
			
			var padCheck = false,
				padX = parseInt(utilities.getRandomRange(minDistance * j, (minDistance * j) + minDistance)),
				padLength = Math.round(parseInt(utilities.getRandomRange(10,maxPadLength) /10) * 10);

			if(j > 0){
				while(padCheck === false){
					for(p = 0; p < this.landingPads.length; p++){
							if(Math.abs(padX - this.landingPads[p].x) < 40 || (padX + padLength) > this.terrainLength){
								padX = parseInt(utilities.getRandomRange(minDistance * j, minDistance * j + minDistance));
								padLength = Math.round(parseInt(utilities.getRandomRange(10,30) /10) * 10);
								padCheck = false;
								break;
							}else{
								padCheck = true;
							}
					}
				}
			}
			
			var	pad = Math.round(this.y[padX-1])+20;
			
			this.landingPads.push({x : padX, y :  pad, padLength : padLength});
			
			for(var i = padX-2; i <= (padX + padLength)+2; i++){
					this.y[i] = pad;
			}
		}
	}
	
	// Scrolls the terrain not implemented within the game
	Terrain.prototype.scroll = function(dir)
    {	
		var i = 0;
		if(Math.abs(dir)=== dir){
			for(i = 0; i<dir; i++){
				this.y.push(this.y.shift());
			}
		}else{
			for(i = 0; i<Math.abs(dir); i++){
				this.y.unshift(this.y.pop());
			}
		}
		
		this.draw(1,1,1);
    };
})();

(function () {
	var utilities = new Utilities();	
	
    function Sky(_width, _terrainObj)
    {    
		this.width = _width;
		this.reset(_terrainObj);
    }
    
    this.Sky = Sky;
    
// public
	// Draws the sky
    Sky.prototype.draw = function(_context)
    {	
		_context.save();
		_context.fillStyle = "#fff";
		var starNum = this.stars.length,
			zoom = Lander.settings.zoom,
			x = Lander.settings.zx,
			y = Lander.settings.zy;
			
		for(var star = 0; star < starNum; star++){
			_context.fillRect((this.stars[star].x - x) * zoom, (this.stars[star].y*zoom)-y, this.stars[star].size, this.stars[star].size);
		}
		_context.restore();
    };
	
	Sky.prototype.reset = function(_terrain){
		var starNum = utilities.getRandomRange(100,200),
			curY = 0,
			curX = 0,
			terrainObj = _terrain;
			
		this.stars = [];
		
		for(var star = 0; star < starNum; star++){
			curY = utilities.getRandomRange(0,600);
			curX = utilities.getRandomRange(0, this.width);
			
			if(curY < terrainObj.y[curX]){
				this.stars.push({x : curX, y :curY, size :1});
			}else{
				star--;
			}
		}
	}
})();

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

Lander = function(){
// AYE me privates!
	var playCanvas = new Object,
		width = 800,
		height = 550,
		renderer = new Object,
		terrain = new Object,
		sky = new Object,
		ship = new Object,
		level = 0,
		entities = [],
		tics = Math.ceil(1000 / 120),
		lastTime = (new Date()).getTime(),
		updateGame = function(){
			var curTime = (new Date()).getTime(),
				deltaTime = (curTime - lastTime) / 100;
				lastTime = curTime; 
			
			if(Lander.settings.beginGame){
				for (var id  = 0; id <= entities.length - 1; id += 1){
					var object = entities[id];
					object.update(deltaTime);
				}
			}
			
			renderer.redraw();
			intervalId = window.setTimeout(updateGame, tics);
		};
		return{
			// AYE it be the pub!
			settings : {
				gravity : 0.2,
				zoom : 1,
				zx : 0,
				zy : 0,
				beginGame : false
			},
			message : {
				messageObj : [],
				messageText : "Press Space to Begin",
				messageX : (width/2) - 120,
				messageY : height/5
			},
			addEntity : function(object){
					entities.push(object);
					renderer.addToRenderer(object);
				},
			removeEntity : function(object){
						for (var id = 0; id <= entities.length - 1; id += 1) {
							if(entities[id] === object){
								entities.splice(id,1);
								renderer.removeFromRenderer(object);
								delete object;
							}
						}
					},
			startGame : function(){
				// Setup the canvas and renderer
				playCanvas = document.getElementById("playCanvas");
				playCanvas.width = width;
				playCanvas.height = height;
				
				renderer = new Renderer(playCanvas);
				
				terrainCanvas = document.getElementById("bgCanvas");
				terrainCanvas.style.position = "absolute";
				terrainCanvas.top = playCanvas.top;
				terrainCanvas.left = playCanvas.left;
				
				var gameContainer = document.getElementById("gameContainer");
				gameContainer.style.marginLeft = -width/2 + "px";
				
				var power = Math.pow(2,Math.ceil(Math.log(width)/(Math.log(2))));
				
				terrain = new Terrain(width, height, power);
				terrain.draw(1,1,1);
								
				sky = new Sky(width, terrain);
				renderer.addToRenderer(sky);
				
				ship = new Ship(width, height, terrain);
				this.addEntity(ship);
				
				var startMessage = Lander.message;
				
				startMessage.messageX =  (width/2) - 120;
				startMessage.messageY = height/5;
				startMessage.message = "Press Space to Begin";
				startMessage.messageObj = new Message({message : "Press Space to Begin", x : (width/2) - startMessage.message.length*4, y : height/5, font : arial12, type : 2, blinkTime : 500});
				this.addEntity(startMessage.messageObj);
				
				intervalId = window.setTimeout(updateGame, tics);
			},
			events : {
				up : false,
				down : false,
				left : false,
				right : false,
				space : false
			},
			// Game Event handelers
			onKeyDown : function(evt) {
			if (evt.keyCode == 39) Lander.events.right = true;
			else if (evt.keyCode == 37) Lander.events.left = true;
			else if (evt.keyCode == 38 || evt.keyCode == 65) Lander.events.up = true
			else if (evt.keyCode == 40 || evt.keyCode == 90) Lander.events.down = true;
			if (evt.keyCode == 32){
				Lander.events.space = true;
				if(!Lander.settings.beginGame){
					if(!ship.getCrashed){
						level--;
						terrain.nextLevel(level);
						sky.reset(terrain);
						
					}
					
					ship.reset();					
					Lander.settings.beginGame = true;
					Lander.message.messageObj.updateMessage("");
				}				
				
			  }
			},
			onKeyUp : function (evt) {
				if (evt.keyCode == 39) Lander.events.right = false;
				else if (evt.keyCode == 37) Lander.events.left = false;
				else if (evt.keyCode == 38 || evt.keyCode == 65) Lander.events.up = false
				else if (evt.keyCode == 40 || evt.keyCode == 90) Lander.events.down = false;
				if (evt.keyCode == 32) Lander.events.space = false;
			}

		};
}();

// Canvas Font generated by Benjamin Joffe at http://random.abrahamjoffe.com.au/public/JavaScripts/canvas/fontGenerator.htm
var arial12=new Image();
arial12.src='data:image/png;base64,' +
		'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' +
		'SGGknosAAAAASUVORK5CYII='; // paste your data url string here
arial12.c='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789!@#$%^&*()-=[]\\;\',./_+{}|:"<>?`~';
arial12.w=[9,9,8,9,9,4,9,8,4,3,8,3,13,8,9,9,9,5,8,4,8,7,11,7,7,7,11,11,12,12,11,10,12,11,3,8,11,9,13,11,12,11,12,11,11,9,11,11,15,11,9,9,4,9,9,9,9,9,9,9,9,9,9,5,16,9,9,14,7,11,6,5,5,5,9,4,4,4,4,3,4,4,4,9,9,5,5,3,4,6,9,9,9,5,9];
arial12.h=19;

// Helper canvas function for rendering bitmap fonts http://random.abrahamjoffe.com.au
CanvasRenderingContext2D.prototype.drawString=function(s, f, x, y){
	y=Math.round(y);
	var z=x=Math.round(x),t,i,j;
	if(!f.f){
		f.f=[t=0],i=0,j=f.w.length;
		while(++i<j)f.f[i]=t+=f.w[i-1];
	}
	s=s.split(''),i=0,j=s.length;
	while(i<j)if((t=f.c.indexOf(s[i++]))>=0)
		this.drawImage(f,f.f[t],0,f.w[t],f.height,x,y,f.w[t],f.height),x+=f.w[t];
		else if(s[i-1]=='\n')x=z,y+=f.h;
}

window.onload = function(){
	Lander.startGame();
	
	// Bind key events
	document.onkeydown = Lander.onKeyDown;
	document.onkeyup = Lander.onKeyUp;
};