
    function Archer(options)
    {  		
		Sprite.call(this, options);
		this.clickable = true;	
		
		this.width = 32;
		this.height = 32;
		
		this.thrust = 2;
		this.startY = 0;
		this.health = 3;
		
		this.addAnimation([0,1,2,1], "walk");
		this.addAnimation([1,3,4,3], "fight");
		
		this.fighting = false;
		this.team = options.team;
		
		this.lane = options.lane;
		this.laneData = options.laneData;
		this.laneGrid = options.laneGrid;
		this.castle = options.castle;
		
		this.lastHit = new Date().getTime();
		this.hitInterval = 240;
		
		this.currentLaneY = Math.round((this.pos.y - this.laneData.startY)/this.laneData.size);
		
		this.type = "archer";
		
		if(this.angle == 270){
			this.dir = -3;
		}else{
			this.dir = 3;
		}
		
		this.clickable = true;
		Game.addEntity(this);
	}

	Archer.prototype = new Sprite();
	this.Archer = Archer;


	Archer.prototype.update = function(deltaTime)
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
		}else{
			this.laneGrid[this.lane][laneY].val = this.team;
			this.laneGrid[this.lane][laneY].unit = this;
		}

		// if something is in front then stop moving
		// quick and dirty...		
		var curRange = 0;
		
		for(var range = Math.abs(this.dir); range>0; range--){
			if(this.angle == 270){
				range = -range;
			}
			
			if(this.currentLaneY+range < Game.gameState.laneGrid[0].length-1 && this.currentLaneY+range > 0){
				if(this.laneGrid[this.lane][this.currentLaneY+range].val === 0){
					this.fighting = false;
				}
				else if(this.laneGrid[this.lane][this.currentLaneY+range].val !== this.team){
					this.fighting = true;
					curRange = range;
					break;
				}
			}else{
				curRange = range;
				this.fighting = true;
				break;
			}
			
			range = Math.abs(range);
		}
		
		if(!this.fighting){
			this.pos.x += this.vel.x;
			this.pos.y += this.vel.y;
		}
		
		if(this.angle !== 270){
			curRange = Math.abs(curRange);
		}
		
		// do fight/walk animations and hit other units
		if(!this.isAnimating){
			if(!this.fighting){
				this.playAnimation('walk', 200);
			}else{
				if(new Date().getTime() > this.lastHit + this.hitInterval){
					if(!this.laneGrid[this.lane][this.currentLaneY+curRange]){
						console.log(this.currentLaneY+curRange + " : " + this.team);
					}
					if(this.laneGrid[this.lane][this.currentLaneY+curRange].unit){
						this.laneGrid[this.lane][this.currentLaneY+curRange].unit.hit();
					}else{
						this.castle.hit(0.2);
					}
				}
				this.playAnimation('fight', 240);
			}
		}
		
    }
	
	Archer.prototype.hit = function(){
		this.health--;
		if(this.health == 0){
			this.live = false;
		}
	}

	Archer.prototype.kill = function(){
		this.laneGrid[this.lane][this.currentLaneY].val = 0;
		this.laneGrid[this.lane][this.currentLaneY].unit = null;
	}
	
	Archer.prototype.clicked = function(){
		this.playAnimation('fight', 150);
	}
	
	Archer.prototype.render = function(context){
		Sprite.prototype.render.call(this, context);
		if(this.selected){
			context.strokeStyle = "rgb(0,255,0)";
			context.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
		}
	}
