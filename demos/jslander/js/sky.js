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