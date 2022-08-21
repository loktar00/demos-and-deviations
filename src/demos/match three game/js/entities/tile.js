	function Tile(options) {  	
		Sprite.call(this, options);
		this.angle = 0;
		options = options || {};
		
		this.width = 40;
		this.height = 40;
		
		this.origin.x = this.width/2;
		this.origin.y = this.height/2;
		
		this.board = options.board;
		this.boardTile = options.boardTile;

		this.val = this.boardTile.val;
		this.target = options.target;
		this.thrust = {x:0, y:0};
		this.selected = false;
		this.animating = false;
		this.speed = 50;
		
		this.clickable = true;

		this.addAnimation([1,2,3,4,5], 'break');
		
		Game.addEntity(this);
	}
	
	Tile.prototype = new Sprite();
	this.Tile = Tile;
	
	Tile.prototype.update = function(deltaTime){
		Sprite.prototype.update.call(this, deltaTime);
		
		this.animating = false;
		this.val = this.boardTile.val;
		
		var speed = this.speed;
		
		if(this.pos.y < this.board.pos.y){
			this.visible = false;
		}else{
			this.visible = true;
		}

		if(this.pos.y < this.target.y + 0.5 && this.pos.y > this.target.y - 0.5){
			this.pos.y = this.target.y;
			this.thrust.y = 0;
		}else{
			this.animating = true;
			this.thrust.y = speed;
			if(this.target.y < this.pos.y){
				this.thrust.y = -speed;
			}
		}
		
		if(this.pos.x < this.target.x + 0.5 && this.pos.x > this.target.x -0.5){
			this.pos.x = this.target.x;
			this.thrust.x = 0;
		}else{
			this.animating = true;
			this.thrust.x = speed;
			if(this.target.x < this.pos.x){
				this.thrust.x = -speed;
			}
		}

		this.pos.y += this.thrust.y * deltaTime;
		this.pos.x += this.thrust.x * deltaTime;
		
		if(this.val > 0){
			this.startY = (this.val-1) * 40;
		}
		
		if(this.reset){
			this.resetTile(this.resetPos);
		}
	}
	
	Tile.prototype.clicked = function(){
		this.board.swapCheck(this);
	}
	
	Tile.prototype.resetTile = function(yPos){
		this.reset = true;
		this.resetPos = yPos;
		
		if(!this.animating && !this.isAnimating){
			this.pos.y = yPos;
			this.reset = false;
			if(this.pos.y !== this.target.y){
				this.animating = true;
				this.startX = 0;
			}
		}
	}
	
	Tile.prototype.destroy = function(){
		this.playAnimation('break', 30);
		/*var emitter = new Emitter({pos : {x : this.pos.x, y : this.pos.y, z: 100}});
			emitter.addGroup({
				size: 2, 
				endSize: 1, 
				thrust : 0,
				blend : true,
				thrustRange: {min:5, max:15}, 
				angle : 0,
				angleRange : {min:0, max:360}, 
				alignToAngle : true,
				endAlpha: 0, 
				startColor : {r:255, g:255, b:0}, 
				duration : 100,
				rate: 100,
				lifeTime : 400
			});*/
	}