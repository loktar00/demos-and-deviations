(function () {	
	//constructor
    function Protest(options)
    {  		
		Sprite.call(this, options);
		this.width = 64;
		this.height = 64;
		this.origin = new Vector(32,32,0);
		this.clickable = true;		
		
		if(options.type){
			this.type = options.type;
		}else{
			this.type = 0;
		}
		
		if(this.type === 1){
			this.startY = 128;	
		}
		
		this.radius = 16;
		
		this.animSpeed = 100;
		this.lastAnim = new Date().getTime();
		this.dir = 0;
		this.target = null
		this.isTargeted = null;
		
		Game.addEntity(this);
	}
	
	Protest.prototype = new Sprite();
	this.Protest = Protest;
	
	Protest.prototype.hit = function(entity){
			this.type = 0;
			this.startY = 0;
			this.target = null;
	}
	
	
	Protest.prototype.clicked = function(){
		if(Game.gameState.spreadPoints > 0 && this.type === 1 && Game.currentState.name !== "menu"){
			Game.gameState.spreadPoints--;
			this.hit();
			Game.gameState.started = true;
			Game.gameState.lastTime = new Date().getTime();
		}
		
		if(Game.gameState.spreadPoints <= 0){
			Game.gameHud.cursor.visible = true; 
			Game.gameHud.crossHairs.visible = false; 
		}
	}
	
	Protest.prototype.update = function(deltaTime)
    {	
		Sprite.prototype.update();
		
		if(new Date().getTime() > this.lastAnim + this.animSpeed){
			this.lastAnim = new Date().getTime();
			this.startX += 64;
			
			if(this.type === 0 && this.target === null && Game.currentState.name !== "menu"){
				// search for a target
				var entities = Game.gameState.protestors,
					entLen = Game.gameState.protestors.length,
					closest = 6400,
					currentTarget = null;
					
				for(var i = 0; i < entLen; i++){			
					if(entities[i] === this || entities[i].type === 0 || entities[i].isTargeted !== null){
						continue;
					}
					
					var checkRadius = 1000,
						distance = Game.utilities.getDistance(entities[i].pos, this.pos);

					if(distance < checkRadius && distance < closest){
						closest = distance;
						currentTarget = entities[i];
					}
				}
				
				this.target = currentTarget;
				if(this.target !== null){
					currentTarget.isTargeted = true;
				}
			}
			
			if(this.type === 1 || this.target === null){
				if(Math.floor(Math.random()*100)>90){
					this.dir = Math.floor(Math.random()*4);
				}
				switch(this.dir){
					case 0:
						this.pos.y-=2;
						break;
					case 1:
						this.pos.x+=2;
						break;	
					case 2:
						this.pos.y+=2;
						break;
					case 3:
						this.pos.x-=2;
						break;
				}
			}
			
			
			// check target
			if(this.target && this.target.type === 1){
				var target = this.target;
				if(target.pos.x > this.pos.x){
					this.pos.x += 3;
				}else if(target.pos.x < this.pos.x){
					this.pos.x -= 3;
				}
				
				if(target.pos.y > this.pos.y){
					this.pos.y += 3;
				}else if(target.pos.y < this.pos.y){
					this.pos.y -= 3;
				}
			}else{
				this.target = null;
			}
			
			
			if(this.startX > 128){
				this.startX = 64;
			}
			
			if(this.pos.x > Game.bounds.width+this.width/2){
				this.pos.x = 0;
			}
			
			if(this.pos.x < -this.width/2){
				this.pos.x = 0;
			}
			
			if(this.pos.y > Game.bounds.height+this.height/2){
				this.pos.y = 0;
			}
			
			if(this.pos.y < -this.height/2){
				this.pos.y = Game.bounds.height;
			}
		}
		//this.startX = 16 * this.owner;	
		//this.startY = 16 * Math.round(this.drawAngle); 		

    };
})();