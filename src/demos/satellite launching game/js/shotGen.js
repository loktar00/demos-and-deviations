(function () {	
    function ShotGen(options)
    {    
		this.utilities = Game.utilities;	
		this.width = 6;
		this.height = 12;
		
		this.template =	  [[[0, 0, 0, 0, 0, 1],
							[0, 0, 0, 0, 1, 2],
							[0, 0, 0, 1, 2, 2],
							[0, 0, 0, 1, 2, 2],
							[0, 0, 0, 1, 2, 2],
							[0, 0, 0, 1, 2, 2],
							[0, 0, 0, 1, 2, 2],
							[0, 0, 0, 0, 1, 2],
							[0, 0, 0, 0, 1, 2],
							[0, 0, 0, 0, 0, 2],
							[0, 0, 0, 0, 0, 1],
							[0, 0, 0, 0, 0, 1]],
							
						   [[0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 1, 1],
							[0, 0, 0, 0,2,2],
							[0, 0, 0,2, 2,2],
							[0, 0, 1, 2, 2,2],
							[0, 0, 1, 2, 2,2],
							[0, 0, 1, 2, 2,2],
							[0, 0, 1, 2, 2,2],
							[0, 0, 0,2, 2,2],
							[0, 0, 0, 0,2,2],
							[0, 0, 0, 0, 1, 1],
							[0, 0, 0, 0, 0, 0]],
							];
		this.colorData = [];
		this.colors = [];
		
		this.colors.push({r:0,g:0,b:0}); // black as the first color
		
		var color = {r: this.utilities.getRandomRange(100,220), g: this.utilities.getRandomRange(100,220), b: this.utilities.getRandomRange(100,220)};
		
		this.colors.push(color);
		this.colors.push({r: color.r-50, g: color.g-50, b:color.b-50});
		
		for(var y = 0; y< this.height; y++){
			this.colorData[y] = [];
			for(var x = 0; x < this.width; x++){
				this.colorData[y][x] = 0;
			}
		}
		
		this.generate();
    }
    
    this.ShotGen = ShotGen;
    
// public
	ShotGen.prototype = {	
		generate : function(){
			var template = [],
				colorData = this.colorData;

			if(Math.round(Math.random())*1==1){
				template = this.template[0];
			}else{
				template = this.template[1];
			}	
			// iterate through the template data
			for(var y = 0; y < this.height; y++){
				for(var x = 0; x < this.width; x++){
					switch(template[y][x]){
						case 0: 
							colorData[y][x]=0;
							break;
						case 1: 
							if(Math.round(Math.random()*1)==0){
								colorData[y][x]=0;
							}else{
								colorData[y][x]=1;
							}
							break;
						case 2:
								colorData[y][x]=1;
							break;
					}
				}
			}
		},
		draw : function(){
			var canvas = document.createElement("canvas"),
				ctx = canvas.getContext("2d");
				colorData = this.colorData,
				colors = this.colors;
				//document.body.appendChild(canvas);	
			canvas.width = 16;
			canvas.height = 16;
			
			for(var y = 0; y< this.height; y++){
				for(var x = 0; x < this.width; x++){
					if(this.colorData[y][x] !== 0){
						ctx.fillStyle = this.utilities.getGradColor(colors[colorData[y][x]], colors[colorData[y][x]+1], y,x)
						var pixSize = 1;
						ctx.fillRect(x*pixSize,y*pixSize,pixSize,pixSize);
						ctx.fillRect((this.width-(x)*pixSize) + this.width-1,y*pixSize,pixSize,pixSize);
					}
				}
			}
			
			return canvas.toDataURL();
		}
    };
})();