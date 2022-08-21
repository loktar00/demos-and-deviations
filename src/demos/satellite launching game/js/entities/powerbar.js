// Center planet
(function () {
	var utilities = new Utilities();	
	
	//constructor
    function PowerBar(options)
    {  		
		Sprite.call(this, options);
		this.range = 0;
		this.dir = 1;
		this.startTime = 0;
		this.waitTime = 5;
		this.angle = options.angle;
		// start off hidden
		this.visible = false;
		
		Game.addEntity(this);
	}
	
	PowerBar.prototype = new Sprite();
	this.PowerBar = PowerBar;

	PowerBar.prototype.update = function(deltaTime)
    {	
		Sprite.prototype.update();	
		if(new Date().getTime() > this.startTime){
			this.startTime = new Date().getTime() + this.waitTime;
			if(this.dir===0){
				this.range--;
				if(this.range <=0){
					this.dir = 1;
				}
			}else{
				this.range++;
				if(this.range>=165){
					this.dir = 0;
				}
			}
		}
    };
	
	PowerBar.prototype.render = function(context){
		context.save();
		context.translate(this.pos.x, this.pos.y);
		context.rotate((this.angle)*Math.PI/180);
		context.drawImage(this.resource.source,this.startX,this.startY,this.width,this.range, 0-this.width/2, 0, this.width,this.range);
        context.restore();
	}
})();