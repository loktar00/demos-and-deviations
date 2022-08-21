(function () {	
    function EnemyShipGen(options)
    {    
		var utilities = Game.utilities;	
		this.shipWidth = 6;
		this.shipHeight = 12;
		
		this.shipTemplate =	  [[[0, 0, 0, 0, 0, 0],
								[0, 0, 0, 0, 1, 1],
								[0, 0, 0, 1, 1, 1],
								[0, 0, 1, 1, 2, 2],
								[0, 0, 1, 1, 2, 2],
								[0, 1, 1, 1, 1, 2],
								[1, 1, 1, 1, 1, 2],
								[1, 1, 1, 1, 1,-1],
								[1, 1, 1, 1, 1,-1],
								[1, 1, 1, 1, 1,-1],
								[1, 1, 0, 0, 0, 1],
								[1, 1, 0, 0, 0, 0]],
								
							   [[0, 0, 0, 0, 0, 0],
								[0, 0, 0, 0, 2, 1],
								[0, 0, 0, 1, 2, 2],
								[0, 0, 1, 1, 2,-1],
								[0, 1, 1, 2, 2,-1],
								[0, 1, 2, 2, 2,-1],
								[0, 1, 1, 2, 2, 2],
								[0, 0, 1, 1, 2, 2],
								[0, 0, 0, 1, 1, 1],
								[0, 0, 0, 0, 1, 1],
								[0, 0, 0, 0, 0, 0],
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
		
		var cStart
		switch(Math.round(Math.random()*2)){
			case 0:
				cStart = {r: Math.round(Math.max(Math.random()*200+200)), g: Math.round(Math.max(Math.random()*50+80)), b: Math.round(Math.max(Math.random()*50+80))};
				break;
			case 1:
				cStart = {r: Math.round(Math.max(Math.random()*50+80)), g: Math.round(Math.max(Math.random()*200+200)), b: Math.round(Math.max(Math.random()*50+80))};
				break;
			case 2:
				cStart = {r: Math.round(Math.max(Math.random()*50+80)), g: Math.round(Math.max(Math.random()*50+80)), b: Math.round(Math.max(Math.random()*200+200))};
				break;
		}
			
		var color ={r: Math.round(Math.max(Math.random()*200+80)), g: Math.round(Math.max(Math.random()*200+80)), b: Math.round(Math.max(Math.random()*200+80))};
		this.colorData.push(cStart);
		
		for(var i=2;i<9;i++){
			var color = {r:  Math.round(Math.max(Math.random()*100+80)), g: Math.round(Math.max(Math.random()*100+80)), b: Math.round(Math.max(Math.random()*100+80))};
			this.colorData.push({r: color.r, g: color.g, b: color.b});
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
    
    this.EnemyShipGen = EnemyShipGen;
    
// public
	EnemyShipGen.prototype = {			
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
			
			// check around to remove orphaned pixels
			for(var y = 2; y < this.shipHeight-2; y++){
				for(var x = 2; x < this.shipWidth-2; x++){
					if(this.shipData[y][x] != 0){
						var checkOpen = 0;
						for(var yy = y-1; yy < y+2; yy++){
							for(var xx = x-1; xx < x+2; xx++){
								if(this.shipData[yy][xx] == 0){
									checkOpen++;
								}
							}
						}
						if(checkOpen >= 6){
							this.shipData[y][x] = 0;
						}
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
					//ctx.fillStyle = getGradColor(colorData[shipData[y][x]*2], colorData[shipData[y][x]],y,x);
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