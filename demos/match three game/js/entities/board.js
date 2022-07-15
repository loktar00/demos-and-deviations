function Board(options){
		Sprite.call(this, options);
		options = options || {};
		
		this.tiles = [];
		this.width = 400;
		this.height = 400;

		this.pos = options.pos;//{x : 380, y : 20, z:0};
		
		this.clickable = true;
		
		this.dimX = 8
		this.dimY = 8;
		
		this.boardArr = [];
		this.matches = [];
		
		this.baseScore = 5;
		this.currentScore = 0;
		this.scoreMult = 1;
		
		this.firstTile = null;
		this.selection = new Selection({
										pos : {x:0, y:0, z:1000}, 
										resource : Game.resourceManager.getResource('selection')
									});
		
		// add the tiles
		for(var y = 0; y < this.dimY; y++){
			this.boardArr[y] = [];
			for(var x = 0; x < this.dimX; x++){
				this.addTile(x,y);
			}
		}

		Game.addEntity(this);
		this.init();
}

Board.prototype = new Sprite();
this.Board = Board;

// init
Board.prototype.init = function(){
	this.check();
	//this.animCheck(this, Board.prototype.check);
}

// add a tile
Board.prototype.addTile = function(x, y){
	
	var val = Math.ceil(Math.random()*6);
	this.boardArr[y][x] = {val : val, x : x, y : y};
	
	var xOffset = 40,
		yOffset = 40,
		xPos = this.pos.x + (x*40) + 20 + xOffset,
		yPos = this.pos.y,
		targetY = this.pos.y + (y*40) + 20 + yOffset,
		targetX = this.pos.x + (x*40) + 20 + xOffset;
		
	this.boardArr[y][x].tile = new Tile(
									{
										pos : {x:xPos, y:yPos, z:100}, 
										target : {x : targetX, y : targetY}, 
										board : this, 
										boardTile : this.boardArr[y][x],
										resource : Game.resourceManager.getResource('tiles')
									});
}

// reset the tile associated with the section of the board
Board.prototype.resetTile = function(boardTile){
	var tile = boardTile.tile;
	
	tile.target.y = this.pos.y + (boardTile.y*40) + 20 + 40; 
	boardTile.val = Math.ceil(Math.random()*6);
	
	tile.resetTile((this.pos.y-this.height) + (boardTile.y*40) + 20 + 40);
}

// check for matches
Board.prototype.check = function(){
	for(var y = 0; y < this.dimY; y++){
		for(var x = 0; x < this.dimX; x++){
			if(!this.boardArr[y][x].rowChecked){
				this.checkHoriz(x,y);
			}

			if(!this.boardArr[y][x].colChecked){
				this.checkVert(x,y);
			}
		}
	}

	this.animCheck(this, Board.prototype.matchTiles);
}

Board.prototype.checkHoriz = function(x,y){
	var matches = [],
		boardArr = this.boardArr,
		currentVal = boardArr[y][x].val;
		
	matches.push(boardArr[y][x]);
	boardArr[y][x].rowChecked = true;
	
	for(var rX = x+1; rX < this.dimX; rX++){
		boardArr[y][rX].rowChecked = true;
		
		if(boardArr[y][rX].val !== currentVal){
			if(matches.length >= 3){
				for(var i = 0; i < matches.length; i++){
					this.matches.push(matches[i]);
				}	
				
				// score based on # of blocks
				this.currentScore += this.baseScore*(matches.length*2)*this.scoreMult;
			}
		
			matches = [];
			currentVal = boardArr[y][rX].val;
		}
		
		matches.push(boardArr[y][rX]);
	}
	
	if(matches.length >= 3){
		for(var i = 0; i < matches.length; i++){
			this.matches.push(matches[i]);
		}	
	}
}

Board.prototype.checkVert = function(x,y){
	var matches = [],
		boardArr = this.boardArr,
		currentVal = boardArr[y][x].val;
		
	matches.push(boardArr[y][x]);
	boardArr[y][x].colChecked = true;
	
	for(var rY = y+1; rY < this.dimY; rY++){
	
		boardArr[rY][x].colChecked = true;
		
		if(boardArr[rY][x].val !== currentVal){
			if(matches.length >= 3){
				for(var i = 0; i < matches.length; i++){
					this.matches.push(matches[i]);
				}

				// score based on # of blocks
				this.currentScore += this.baseScore*(matches.length*2)*this.scoreMult;					
			}
			
			matches = [];
			currentVal = boardArr[rY][x].val;
		}
		
		matches.push(boardArr[rY][x]);
	}
	
	if(matches.length >= 3){
		for(var i = 0; i < matches.length; i++){
			this.matches.push(matches[i]);
		}	
	}
}

// reset the checked and marked values, send columns to be shifted.
Board.prototype.reset = function(check){
	var boardArr = this.boardArr;
	
	for(var y = 0; y < this.dimY; y++){
		for(var x = 0; x < this.dimX; x++){
			if(boardArr[y][x].val == 0){
				this.resetTile(boardArr[y][x]);
			}

			boardArr[y][x].colChecked = false;
			boardArr[y][x].rowChecked = false;
		}
	}
	
	if(check){
		this.scoreMult++;
		this.animCheck(this, Board.prototype.check);
	}else{
		this.scoreMult = 1;
	}
	
}

// makes sure nothings moving or animating.
Board.prototype.animCheck = function(self, callback, args){
	var animating = false,
		boardArr = self.boardArr;
	
	for(var y = 0; y < self.dimY; y++){
		if(animating){break;}
		for(var x = 0; x < self.dimX; x++){
			if(boardArr[y][x].tile.animating || boardArr[y][x].tile.isAnimating){
				animating = true;
				break;
			}
		}
	}

	if(animating){
		setTimeout(function(){self.animCheck(self, callback, args)}, 10);
	}else{
		callback.call(self, args);
	}
}

//animate matches
Board.prototype.matchTiles = function(){

	// update the main score
	Game.gameState.score += this.currentScore;
	Game.gameState.resourceBar.addPoints(this.currentScore);

	this.currentScore = 0;
	
	for(var i = 0; i < this.matches.length; i++){
		if(this.matches[i].val !== 0){
			this.matches[i].tile.destroy();
			this.matches[i].val = 0;
			this.matches[i].tile.val = 0;
		}
	}
	
	this.animCheck(this, Board.prototype.shiftColumns);
}

// shift columns
Board.prototype.shiftColumns = function(){
	var boardArr = this.boardArr,
		reCheck = false;
	
	// keep checking until no matches are found
	if(this.matches.length > 0){
		reCheck = true;
	}
	
	this.matches = [];
	
	for(var x = 0; x < this.dimX; x++){
		var colArr = [],
		colTest = [];
		
		for(var y = 0; y < this.dimY; y++){	
			colArr.push(boardArr[y][x]);
		}
		
		// loop through column and push all 0 values to the front
		for(var i = 0; i < colArr.length; i++){
			if(colArr[i].val == 0){
				colArr.unshift(colArr[i]);
				colArr.splice(i+1,1);
			}
		}
			
		for(y = 0; y < this.dimY; y++){	
			boardArr[y][x] = colArr[y];
			colArr[y].y = y;
			colArr[y].tile.target.y = this.pos.y + (y*40) + 20 + 40; 
		}
	}
	
	this.animCheck(this, Board.prototype.reset, reCheck);
}

Board.prototype.swapCheck = function(tile){
	tile = this.getBoardTile(tile);
	
	if(!this.firstTile){
		this.firstTile = tile;
		this.firstTile.tile.selected = true;
		this.selection.pos = this.firstTile.tile.pos;
		this.selection.visible = true;
	}else{
		this.selection.visible = false;
		var fTile = this.firstTile;
		
		if(Math.abs(tile.x-fTile.x)==1 && Math.abs(tile.y-fTile.y)==0 || Math.abs(tile.x-fTile.x)==0 && Math.abs(tile.y-fTile.y)==1){
			this.swap(fTile, tile);
		}
		
		this.firstTile.tile.selected = false;
		this.firstTile = null;
	}
}

Board.prototype.getBoardTile = function(tile){
	var boardArr = this.boardArr;
	
	for(var y = 0; y < this.dimY; y++){
		for(var x = 0; x < this.dimX; x++){
			if(boardArr[y][x].tile == tile){
				return boardArr[y][x];
			}
		}
	}
}

Board.prototype.swap = function(tile1, tile2){
	var swapTile = tile1,
		x1 = tile1.x,
		y1 = tile1.y,
		x2 = tile2.x,
		y2 = tile2.y;
		
	this.boardArr[y1][x1] = tile2;
	this.boardArr[y1][x1].x = x1;
	this.boardArr[y1][x1].y = y1;
	
	this.boardArr[y2][x2] = swapTile;
	this.boardArr[y2][x2].x = x2;
	this.boardArr[y2][x2].y = y2;
	
	this.boardArr[y1][x1].tile.animating = true;
	this.boardArr[y1][x1].tile.target.y = this.pos.y + (y1*40) + 20 + 40; 
	this.boardArr[y1][x1].tile.target.x = this.pos.x + (x1*40) + 20 + 40; 
	
	this.boardArr[y2][x2].tile.animating = true;
	this.boardArr[y2][x2].tile.target.y = this.pos.y + (y2*40) + 20 + 40; 
	this.boardArr[y2][x2].tile.target.x = this.pos.x + (x2*40) + 20 + 40; 
	this.animCheck(this, Board.prototype.check);
}

// just for testing check will be done on move
Board.prototype.clicked = function(){
	//this.animCheck(this, Board.prototype.check);
}
