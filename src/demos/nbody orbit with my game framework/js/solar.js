
function solar(){}

solar.prototype = new Jest({"canvas" : "playCanvas", "width": 800, "height" : 600, "frameRate" : Math.ceil(1000/60), "showFrameRate" : true});
this.solar = solar;

solar.prototype.load = function(){
	Jest.prototype.load.call(this);
};

solar.prototype.init = function(){
	Jest.prototype.init.call(this);
	this.settings = {
		gravity : .06672,
		bodyCount : 40,
		sunMass : 2000,
		zoom : 1
	};

	this.gameState = {};
	gameState = this.gameState;
	gameState.bodies = [];

	gameState.bodies.push(new Body({x : Game.bounds.width/2, y : Game.bounds.height/2, mass : this.settings.sunMass, radius : 20, color : {r : 255, g : 100, b: 0}, list : gameState.bodies}));

	var bodyCount = this.settings.bodyCount;
	
	// planet size
	for(var i = 0 ; i < ~~bodyCount/2; i++){
		gameState.bodies.push(new Body(
			{ 
				x : Math.random()*Game.bounds.width+200, 
				y : Math.random()*Game.bounds.height+200, 
				radius : 2 + Math.random()*5,
				vel : {x :  2 - Math.random()*4, y : 2 - Math.random() * 4},
				list : gameState.bodies
			})
		);
	}

	// moon size
	for(var i = 0 ; i < ~~bodyCount/2; i++){
		gameState.bodies.push(new Body(
			{ 
				x : Math.random()*Game.bounds.width+200, 
				y : Math.random()*Game.bounds.height+200, 
				radius : 1 + Math.random()*1,
				vel : {x :  1 - Math.random()*2, y : 1 - Math.random() * 2},
				list : gameState.bodies
			})
		);
	}
};


solar.prototype.clicked = function(event, self){
	Jest.prototype.clicked(event,self);
};

solar.prototype.mouseWheel = function(event, self){
	Jest.prototype.mouseWheel(event,self);
	this.settings.zoom += self.wheelDir/10;

	if(this.settings.zoom <= 0.1){
		this.settings.zoom -= self.wheelDir/10;
	}
};

solar.prototype.update = function(){
	Jest.prototype.update.call(this);	
};

window.onload = function(){
	Game = new solar();
	Game.load();
};