(function () {	
    function PlayerShipGen(options)
    {    
		var utilities = Game.utilities;	
		this.shipWidth = 6;
		this.shipHeight = 12;
		
		this.shipTemplate =	  [[[0, 0, 0, 0, 0, 0],
								[0, 0, 0, 0, 1, 1],
								[0, 0, 0, 0, 1,-1],
								[0, 0, 0, 1, 1,-1],
								[0, 0, 0, 1, 1,-1],
								[0, 0, 1, 1, 1,-1],
								[0, 1, 1, 1, 2, 2],
								[0, 1, 1, 1, 2, 2],
								[1, 1, 1, 1, 2, 2],
								[1, 1, 1, 1, 2, 2],
								[0, 0, 0, 1, 2, 1],
								[0, 0, 0, 0, 0, 0]],
								
							   [[0, 0, 0, 0, 0, 0],
								[0, 0, 0, 0, 1, 1],
								[0, 0, 0, 1, 1,-1],
								[0, 0, 1, 1, 1,-1],
								[0, 0, 1, 1, 1,-1],
								[0, 1, 1, 1, 1,-1],
								[1, 1, 1, 1, 2, 2],
								[1, 1, 1, 1, 2, 2],
								[1, 1, 1, 1, 2, 2],
								[1, 1, 1, 1, 2, 2],
								[0, 0, 0, 1, 2, 1],
								[0, 0, 0, 0, 0, 0]]];
		this.shipData = [];
		this.colorData = [];
		this.solid = 0;
		
		if(options !== undefined){
			if(options.width === undefined){
				this.shipWidth = 6;
			}else{
				this.shipWidth = options.shipWidth;
			}
			
			if(options.height === undefined){
				this.shipHeight = 12;
			}else{
				this.shipHeight = options.shipHeight;
			}
		}else{
			this.shipWidth = 6;
			this.shipHeight = 12;
		}
		
		this.colorData.push({r:0,g:0,b:0}); // Declare black as the first color
		
		var jetColor ={r: utilities.getRandomRange(80,200), g: utilities.getRandomRange(80,200), b: utilities.getRandomRange(80,200)};
		this.colorData.push({r:jetColor.r,g:jetColor.g,b:jetColor.b}); // Window /exhaust color
		
		//  Make the rest of the possble colors
		for(var i=2;i<9;i++){
			var grey = utilities.getRandomRange(60,150);
			this.colorData.push({r:grey, g:grey, b: grey});
		}
	
		this.solid =utilities.getRandomRange(0,1);

		for(var y = 0; y< this.shipHeight; y++){
			this.shipData[y] = [];
			for(var x = 0; x < this.shipWidth; x++){
				this.shipData[y][x] = 0;
			}
		}
		
		this.generateShip();
    }
    
    this.PlayerShipGen = PlayerShipGen;
    
// public
	PlayerShipGen.prototype = {			
		generateShip : function(){
			var template = [];

			if(Math.round(Math.random())*1==1){
				template = this.shipTemplate[0];
			}else{
				template = this.shipTemplate[1];
			}	
			// iterate through the template data
			for(var y = 0; y < this.shipHeight; y++){
				for(var x = 0; x < this.shipWidth; x++){
					switch(template[y][x]){
						case 0: // - always BLACK, NOT part of the spaceship.
							this.shipData[y][x]=null;
							break;
						case -1:
							this.shipData[y][x]=1;
							break;
						case 1: 
							if(Math.round(Math.random()*1)===0){
								this.shipData[y][x]=null;
							}else{
								switch(Math.round(Math.random()*2)){
									case 0:
										this.shipData[y][x]=2;
										break;
									case 1:
										this.shipData[y][x]=3;
										break;
									case 2:
										this.shipData[y][x]=4;
										break;
								}
							}
							break;
						case 2:
							if(Math.round(Math.random()*1)===0){
								this.shipData[y][x]=3;
							}else{
								this.shipData[y][x]=2;
							}
							break;
					}
				}
			}
		},
		drawShip : function(){
			var canvas = document.createElement("canvas"),
				ctx = canvas.getContext("2d");
				//document.body.appendChild(canvas);	
			canvas.width = 64;
			canvas.height = 32;
			
			for(var y = 0; y< this.shipHeight; y++){
				for(var x = 0; x < this.shipWidth; x++){
					if(this.shipData[y][x] !== null){
						ctx.fillStyle = "rgb(" + this.colorData[this.shipData[y][x]].r + "," + this.colorData[this.shipData[y][x]].g + "," + this.colorData[this.shipData[y][x]].b + ")";
						ctx.fillRect(x*3,y*3,3,3);
						ctx.fillRect((this.shipWidth-(x)*3) + (this.shipWidth*4),y*3,3,3);
					}
				}
			}
			
			// Draw it again as white for the mask
			for(var y = 0; y< this.shipHeight; y++){
				for(var x = 0; x < this.shipWidth; x++){
					if(this.shipData[y][x] !== null){
						ctx.fillStyle = "rgb(255,255,255)";
						ctx.fillRect((x*3)+32,y*3,3,3);
						ctx.fillRect(((this.shipWidth-(x)*3) + (this.shipWidth*4))+32,y*3,3,3);
					}
				}
			}
			
			return canvas.toDataURL();
		}
    };
})();