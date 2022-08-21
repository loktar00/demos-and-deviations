	function LaneSelector(options) {  	
		Sprite.call(this, options);
		options = options || {};
	
		this.width = 32;
		this.height = 32;
			
		this.lastChanged = new Date().getTime();
		this.changeInterval = 1200;
		
		this.spawnLanes = [88, 172, 256];
		this.currentLane = 0;

		this.pos.x = this.spawnLanes[this.currentLane];
		this.pos.z = 1;
		
		Game.addEntity(this);
	}
	
	LaneSelector.prototype = new Sprite();
	this.LaneSelector = LaneSelector;
	
	LaneSelector.prototype.changeLane = function(){
		this.currentLane++;
		if(this.currentLane >= this.spawnLanes.length){
			this.currentLane = 0;
		}
		
		this.pos.x = this.spawnLanes[this.currentLane];
	}
	
	LaneSelector.prototype.update = function(deltaTime){
		Sprite.prototype.update.call(this, deltaTime);
		
		if(new Date().getTime() > this.lastChanged + this.changeInterval){
				this.lastChanged = new Date().getTime();
				this.changeLane();
		}
	}
	