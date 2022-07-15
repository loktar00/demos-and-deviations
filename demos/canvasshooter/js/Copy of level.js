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
    function Level (_x, _y, _imgSrc, _imgOverlay, _imgCollsion, _width, _height)
    {
						
		this.x  = _x;
        this.y  = _y;
		
		this.imgSrc = _imgSrc;
		this.imgOverlay = _imgOverlay;
		this.imgCollision = _imgCollsion;
		
		this.mapWidth = level1.settings.width;
		this.mapHeight = level1.settings.height;
		
		this.tileSize = level1.settings.tileSize;
		this.xTiles = Math.ceil(this.mapWidth/this.tileSize);
		this.yTiles = Math.ceil(this.mapHeight/this.tileSize)
		
		this.map = utilities.create2DArray(this.xTiles+1, this.yTiles+1);
		
		this.wayPoints = [];
		
		for(var x = 0; x<= this.xTiles; x+= 1){
			for(var y = 0; y<= this.yTiles; y+= 1){

				this.map[x][y] = {
								"x" : 0,
								"y" : 0
							}
			}
		}
		
		var mapLength = level1.map.length - 1,
			tileSettingsLen = tileSettings.tiles.length - 1;
		
		for(var i = 0; i<=mapLength; i+=1){
			var curSection = level1.map[i],
			startX = curSection.x / this.tileSize,
			startY = curSection.y / this.tileSize,
			width = 0,
			height = 0,
			curWayPoint = [];
			
			for(var tiles = 0; tiles <= tileSettingsLen; tiles += 1){
				if(tileSettings.tiles[tiles].tile === curSection.tile){
					width = tileSettings.tiles[tiles].width / this.tileSize;
					height = tileSettings.tiles[tiles].height / this.tileSize;
					tileSx = tileSettings.tiles[tiles].x;
					tileSy = tileSettings.tiles[tiles].y;
					
					var wayPoint = tileSettings.tiles[tiles].waypoints,
						connections = tileSettings.tiles[tiles].connections;
									
					for(var w = 0; w <= wayPoint.length - 1; w +=1){
						var wX = wayPoint[w].x + curSection.x,
							wY = wayPoint[w].y + curSection.y;
						this.wayPoints.push({x : wX, y : wY, id : curSection.id});
					}
					
					break;
				}
			}
			
			for(var x = startX; x < width + startX; x+=1){
				for(var y = startY; y < height + startY; y+=1){
					this.map[x][y] = {
						"x" : ((x - startX) * this.tileSize) + tileSx,
						"y" : ((y - startY) * this.tileSize) + tileSy
					}
				}
			}	
		}
		

		// Render the map onto this
		this.mapCanvas = document.createElement("canvas");
		this.mapCanvas.width = this.mapWidth + this.tileSize;
		this.mapCanvas.height = this.mapHeight + this.tileSize;
		this.mapCtx =  this.mapCanvas.getContext("2d");
		
		// Width and height that is displayed
		this.width = _width;
		this.height = _height;
		
		// Used for collisins with the level
		this.collisionCanvas = document.createElement("canvas");
		this.collisionCanvas.width = _width;
		this.collisionCanvas.height = _height;
		this.colCtx =  this.collisionCanvas.getContext("2d");
		
		this.time  = 0;
		this.speed = 35;
    }
    
    global.Level = Level;
	
	Level.prototype.draw = function(_context){
		
		var startTileX = Math.floor(Math.abs(this.x)/this.tileSize),
			startTileY = Math.floor(Math.abs(this.y)/this.tileSize),
			endTileX = Math.ceil(Math.abs(this.width)/this.tileSize),
			endTileY =  Math.ceil(Math.abs(this.height)/this.tileSize);
			
		_context.save();
		_context.clearRect(0,0,this.width,this.height); 
		for(var x = startTileX; x<= (startTileX + Math.round(this.width/this.tileSize)); x+= 1){
			for(var y = startTileY; y<= (startTileY + Math.round(this.height/this.tileSize)); y+= 1){
				_context.drawImage(this.imgSrc, this.map[x][y].x, this.map[x][y].y, this.tileSize, this.tileSize, this.x + (x*this.tileSize), this.y + (y*this.tileSize), this.tileSize,this.tileSize);
			}
		}
		_context.restore();
		
		// Draw the collision
		this.colCtx.save();
		this.colCtx.clearRect(0,0,this.width,this.height); 
		for(var x = startTileX; x<= (startTileX + endTileX); x+= 1){
			for(var y = startTileY; y<= (startTileY + endTileY); y+= 1){
				this.colCtx.drawImage(this.imgCollision, this.map[x][y].x, this.map[x][y].y, this.tileSize, this.tileSize, this.x + (x*this.tileSize), this.y + (y*this.tileSize), this.tileSize,this.tileSize);
			}
		}
		this.colCtx.restore();
	}
	
	Level.prototype.drawOverLay = function(_context){
		var startTileX = Math.floor(Math.abs(this.x)/this.tileSize),
			startTileY = Math.floor(Math.abs(this.y)/this.tileSize),
			endTileX = Math.ceil(Math.abs(this.width)/this.tileSize),
			endTileY =  Math.ceil(Math.abs(this.height)/this.tileSize);
			
		_context.save();
		for(var x = startTileX; x<= (startTileX + endTileX); x+= 1){
			for(var y = startTileY; y<= (startTileY + endTileY); y+= 1){
				_context.drawImage(this.imgOverlay, this.map[x][y].x, this.map[x][y].y, this.tileSize, this.tileSize, this.x + (x*this.tileSize), this.y + (y*this.tileSize), this.tileSize,this.tileSize);
			}
		}		
		_context.restore();
		
		// Being used to debug Waypoints
		//_context.save();
			_context.fillStyle = "#00A308";
			/*for(var w = 0; w <= this.wayPoints.length - 1; w+=1){
				_context.beginPath();  
				_context.arc(this.x + this.wayPoints[w].x, this.y + this.wayPoints[w].y,10,0,Math.PI*2,true); // Outer circle 
				_context.closePath();
				_context.fill();
				
				if(this.wayPoints[w].con !== undefined){
				_context.strokeStyle = "#00A308";
				_context.beginPath();  
					 _context.moveTo(this.x + this.wayPoints[w].x, this.y + this.wayPoints[w].y);
						for(var i = 0; i<= this.wayPoints[w].con.length - 1; i +=1){
							for(var j = 0; j <= this.wayPoints.length-1; j+=1){
								if(this.wayPoints[w].con[i].id === this.wayPoints[j].id){
									 _context.lineTo(this.wayPoints[j].x + this.x, this.wayPoints[j].y + this.y);
								}
							}
						}
						_context.closePath();
						_context.stroke();
					}
			}*/
		//_context.restore();
		
		
	}
	
})();