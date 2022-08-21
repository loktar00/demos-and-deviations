    function Castle(label, team)
    {    
		this.health = 100;
		this.live = true;
		this.label = label;
		this.team = team;
		this.end = false;
		Game.addEntity(this, true);
    }
    
    this.Castle = Castle;
    
	// need to fix up some direct references to game state, time crunch!!
	Castle.prototype.hit = function(damage){
		this.health -= damage;
	}
	
    Castle.prototype.update = function(deltaTime)
    {	
		this.label.text = this.health.toFixed(2) + "%";
		
		if(this.health <= 0 && !this.end){
			this.end = true;
			if(this.team ===1){
				Game.switchState({name : "defeat", enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});
			}else{
				Game.switchState({name : "victory", enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});
			}
		}
    }
