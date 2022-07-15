    function Director(laneSel, diff)
    {    
		this.live = true;
		this.minResourceWaitTime = 8000/diff;
		this.lastResource = new Date().getTime();
		
		this.resources = 0;
		
		this.laneSel = laneSel;
		this.diff = diff;
		
		Game.addEntity(this, true);
    }
    
    this.Director = Director;
    
	// change the difficulty
	Director.prototype.setDifficulty = function(diff){
		this.diff = diff;
		this.minResourceWaitTime = 10000/diff;
	}
	
	// need to fix up some direct references to game state, time crunch!!
	Director.prototype.checkLane = function(){
		//check current lane
		var laneData = Game.gameState.laneData,
			laneGrid = Game.gameState.laneGrid,
			curLane = this.laneSel.currentLane,
			enemyCount = 0,
			castleDanger = false,
			toggleArcher = false;
			
			
		for(var i = 0; i < laneGrid[curLane].length; i++){
			if(laneGrid[curLane][i].val === 1){
				if(laneGrid[curLane][i].type == "footman"){
					toggleArcher = true;
				}
				enemyCount++;
				if(i < 3){
					castleDanger = true;
				}
			}else if(laneGrid[curLane][i].val === 2){
				if(laneGrid[curLane][i].unit.type == "footman"){
					toggleArcher = true;
				}else{
					toggleArcher = false;
				}
			}
		}
		
		// when proper time allows pass the castle instead of referencing the game state.
		
		// the enemy tries to heal the castle first if its low
		if(Game.gameState.eCastle.health > 25){

			// castle health isnt low but its under attack, or theres more one or more enemies unit in the lane.
			if(castleDanger || enemyCount >= 1){
				while(enemyCount--){
					// spawn footmen
					if(this.resources >= 150 && !toggleArcher){
						this.spawnFootman();
						toggleArcher = true;
					}
					
					// spawn an archer
					if(this.resources >= 100){
						this.spawnArcher();
						toggleArcher = false;
					}
				}
			}else{
				// no enemy in this lane spawn a few footmen
				var units = this.diff;
				while(units--){
					if(this.resources >= 150 && !toggleArcher){
						this.spawnFootman();
						toggleArcher = true;
					}
					
					// spawn an archer
					if(this.resources >= 100){
						this.spawnArcher();
						toggleArcher = false;
					}
				}
			}
		}else{
			if(this.resources >= 500){
				this.resources -= 500;
				Game.gameState.eCastle.health += 25;
				if(Game.gameState.eCastle.health > 100){
					Game.gameState.eCastle.health = 100;
				}
			}
		}
	}
	
	Director.prototype.spawnFootman = function(){
		this.resources -= 150;
		new Footman({
					x:this.laneSel.pos.x, 
					y:this.laneSel.pos.y,
					z:1,
					angle : 90,
					resource : Game.resourceManager.getResource("footman-e"),
					team : 2,
					lane : this.laneSel.currentLane,
					laneData : Game.gameState.laneData,
					laneGrid : Game.gameState.laneGrid,
					castle : Game.gameState.pCastle,
					list : Game.gameState.enemyUnits
		});
	}
	
	Director.prototype.spawnArcher = function(){
		this.resources -= 100;
		new Archer({
					x:this.laneSel.pos.x, 
					y:this.laneSel.pos.y,
					z:1,
					angle : 90,
					resource : Game.resourceManager.getResource("archer-e"),
					team : 2,
					lane : this.laneSel.currentLane,
					laneData : Game.gameState.laneData,
					laneGrid : Game.gameState.laneGrid,
					castle : Game.gameState.pCastle,
					list : Game.gameState.enemyUnits
		});
	}
	
    Director.prototype.update = function(deltaTime)
    {	
		if(new Date().getTime() > this.lastResource + this.minResourceWaitTime){
				this.lastResource = new Date().getTime();
				this.resources+=100 + (25*this.diff);
		}	
		this.checkLane();
    }
