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