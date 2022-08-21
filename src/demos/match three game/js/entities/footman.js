
    function Footman(options)
    {  		
		Sprite.call(this, options);
		this.clickable = true;	
		
		this.width = 32;
		this.height = 32;
		
		this.thrust = 2;
		this.startY = 0;
		this.health = 5;
		
		this.addAnimation([0,1,2,1], "walk");
		this.addAnimation([1,3,4,3], "fight");
		
		this.fighting = false;
		this.team = options.team;
		
		this.lane = options.lane;
		this.laneData = options.laneData;
		this.laneGrid = options.laneGrid;
		this.castle = options.castle;
		
		this.lastHit = new Date().getTime();
		this.hitInterval = 80;
		
		this.currentLaneY = Math.round((this.pos.y - this.laneData.startY)/this.laneData.size);
		
		this.type = "footman";
		
		if(this.angle == 270){
			this.dir = -1;
		}else{
			this.dir = 1;
		}
		
		this.clickable = true;
		Game.addEntity(this);
	}

	Footman.prototype = new Sprite();
	this.Footman = Footman;


	Footman.prototype.update = function(deltaTime)
    {
		Sprite.prototype.update.call(this, deltaTime);		
		
		this.vel.x = (Math.cos(((this.angle)) *  Math.PI / 180) * this.thrust * deltaTime);
		this.vel.y = (Math.sin(((this.angle)) *  Math.PI / 180) * this.thrust * deltaTime);	
		
		var startY = this.laneData.startY,
			laneY = Math.round((this.pos.y - startY)/this.laneData.size);

		// update position in the array
		if(laneY !== this.currentLaneY){
			if(this.laneGrid[this.lane][this.currentLaneY]){
				this.laneGrid[this.lane][this.currentLaneY].val = 0;
				this.laneGrid[this.lane][this.currentLaneY].unit = null;
			}
			
			this.laneGrid[this.lane][laneY].val = this.team;
			this.laneGrid[this.lane][laneY].unit = this;
			
			this.currentLaneY = laneY;
		}

		// if something is in front then stop moving
		// quick and dirty...
		if(this.currentLaneY+this.dir < Game.gameState.laneGrid[0].length-1 && this.currentLaneY+this.dir > 0){
		//if(this.laneGrid[this.lane][this.currentLaneY+this.dir] !== undefined){
			if(this.laneGrid[this.lane][this.currentLaneY+this.dir].val === 0){
				this.fighting = false;
				
				this.pos.x += this.vel.x;
				this.pos.y += this.vel.y;
			}
			else if(this.laneGrid[this.lane][this.currentLaneY+this.dir].val !== this.team){
				this.fighting = true;
			}
		}else{
			this.fighting = true;
		}
		
		// do fight/walk animations and hit other units
		if(!this.isAnimating){
			if(!this.fighting){
				this.playAnimation('walk', 200);
			}else{
				if(new Date().getTime() > this.lastHit + this.hitInterval){
					
					if(this.laneGrid[this.lane][this.currentLaneY+this.dir].unit){
						this.laneGrid[this.lane][this.currentLaneY+this.dir].unit.hit();
					}else{
						this.castle.hit(0.4);
					}
				}
				this.playAnimation('fight', 80);
			}
		}
		
    }
	
	Footman.prototype.hit = function(){
		this.health--;
		if(this.health == 0){
			this.live = false;
		}
	}

	Footman.prototype.kill = function(){
		this.laneGrid[this.lane][this.currentLaneY].val = 0;
		this.laneGrid[this.lane][this.currentLaneY].unit = null;
	}
	
	Footman.prototype.clicked = function(){
		this.playAnimation('fight', 150);
	}
	
	Footman.prototype.render = function(context){
		Sprite.prototype.render.call(this, context);
		if(this.selected){
			context.strokeStyle = "rgb(0,255,0)";
			context.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
		}
	}
