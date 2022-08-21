(function () {	
    function Director()
    {    
		this.live = true;
		this.minSpawnWaitTime = 1500;
		this.lastGroupSpawn =  new Date().getTime();
		this.spawnCount = 0;
		this.powerUp = false;

		Game.addEntity(this, true);
    }
    
    this.Director = Director;
    
// public
    Director.prototype.update = function(deltaTime)
    {	
		var chanceMult = 100,
			curTime = new Date().getTime(),
			curStation = Game.gameState.stations[1],
			stationAngle = 90-Math.atan2(curStation.pos.x-(320+60),curStation.pos.y-240)/Math.PI*180;
			
		if(stationAngle - Math.abs(stationAngle) !== 0){
			stationAngle = 360+stationAngle;
		}
		if(curTime > this.lastGroupSpawn + this.minSpawnWaitTime){
				if(this.powerUp){
					var entities = Game.entities,
						entLen = Game.entities.length,
						collision = false;
						
					for(var i = 0; i < entLen; i++){
						if(entities[i].type !== 'asset'){
							continue;
						}
						
						var entAngle = entities[i].angle;
						if(entAngle - Math.abs(entAngle) !== 0){
							entAngle = 360+entAngle;
						}
						
						if(entAngle < stationAngle + 12 && entAngle > stationAngle-8){
							// dont launch
							collision = true;
							break;
						}
					}
					
					if(!collision){
						Game.gameState.stations[1].clicked(true);
						this.lastGroupSpawn = curTime;
						this.minSpawnWaitTime = Math.floor(Math.random()*1500)+500;
						this.powerUp = false;
					}
				}else{
					Game.gameState.stations[1].clicked(true);
					this.lastGroupSpawn = curTime;
					this.minSpawnWaitTime = Math.floor(Math.random()*600);
					this.powerUp = true;
				}
		}
    };
	
	Director.addEnemies = function(self, curCount, enemyType, totalShips, startX, startY, thrust, curPattern, soundMult){
	}
})();