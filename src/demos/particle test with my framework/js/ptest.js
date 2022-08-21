(function(){
var seed = 'jason';
	
	if(window.location.href.split('?')[1]){
		seed = window.location.href.split('?')[1];
	}
	Math.seedrandom(seed);
	function PTest(){
	
	};
	
	PTest.prototype = new jGame({"canvas" : "playCanvas", "width": 512, "height" : 600, "frameRate" : Math.ceil(1000/60), "showFrameRate" : true});
	this.PTest = PTest;
	
	PTest.prototype.init = function(){
		// Call the main game constructor
		jGame.prototype.init.call(this);
		this.resourceManager.add("images/smoke.png", 1, "particles");
		this.resourceManager.add("images/point.png", 1, "fire");
		this.loaded(this);
	}
	
	// Totoally overriding the load prototype
	PTest.prototype.loaded = function(game){
		var self = this;
		if(this.resourceManager.loadingComplete){
			game.afterLoad();
			return true;
		}else{
			setTimeout(function(){self.loaded(game)},100);
			return false;
		}
	}
	
	PTest.prototype.afterLoad = function(){
		this.gameHud = {};
		var gameHud = this.gameHud;
		
		gameHud.ui = new UI();
		gameHud.ui.particleCount = new Label({'text':' ', x:0,y:50, 'font':'14pt arial bold'});
		gameHud.ui.addItem(gameHud.ui.particleCount, 100);	
		
		var fireEmitter = new Emitter({pos : {x: 256, y: 330}});
		fireEmitter.addGroup({
				size: 32, 
				endSize: 64, 
				thrust : 0,
				thrustRange: {min:1, max:1.5}, 
				angleRange : {min:-45, max:-90}, 
				drawAngleRange : {min: 0, max: 360},
				drawAngleChange : 2,
				endAlpha: 0, 
				startColor : {r: 255, g:255, b:0},
				endColor : {r: 255, g:0, b:0},
				duration : -1,
				rate: 20,
				lifeTime : 2500,
				alignToAngle: true,
				blend:true,
				resource : this.resourceManager.getResource('fire')
			});
		
		var smokeEmitter = new Emitter({pos : {x: 256, y: 300}});
			smokeEmitter.addGroup({
				size: 32, 
				endSize: 128, 
				thrustRange: {min:2, max:3}, 
				angleRange : {min:-45, max:-90}, 
				drawAngleRange : {min: 0, max: 360},
				drawAngleChange : 2,
				alpha : 1,
				endAlpha: 0, 
				startColor : {r: 150, g:150, b:150}, 
				endColor: {r:100, g:100, b:100},
				duration : -1,
				delay : 500,
				rate: 5,
				lifeTime : 5000,
				resource : this.resourceManager.getResource('particles')
			});
			
		//emitter.stop();
		requestAnimFrame( function(){Game.update()} );
	}
	
	PTest.prototype.clicked = function(event, self){
		jGame.prototype.clicked(event,self);	
		var emitter = new Emitter({pos : {x: this.cX, y: this.cY}});
		emitter.addGroup({
				size: 10, 
				endSize: 1, 
				thrust : 0,
				thrustRange: {min:1, max:20}, 
				angle : 0,
				angleRange : {min:0, max:360}, 
				endAlpha: 0, 
				startColor : {r: 255, g:100, b:0}, 
				endColor: {r:255, g:255, b:0},
				duration : 1000,
				rate: 100,
				lifeTime : 500

			});
			
		emitter.addGroup({
				size: 32, 
				endSize: 128, 
				thrustRange: {min:1, max:2}, 
				angleRange : {min:0, max:360}, 
				drawAngleRange : {min: 0, max: 360},
				drawAngleChange : 5,
				alpha : 1,
				endAlpha: 0, 
				startColor : {r: 150, g:150, b:150}, 
				endColor: {r:100, g:100, b:100},
				duration : 5000,
				delay : 500,
				rate: 8,
				lifeTime : 3000,
				blend : true,
				resource : this.resourceManager.getResource('particles')
			});
	}
	
	PTest.prototype.update = function(){
		jGame.prototype.update.call(this);
		this.gameHud.ui.particleCount.text = this.particleCount;
		
	}

})();

var Game = {};

window.onload = function(){
	Game = new PTest();
	Game.init();	
};