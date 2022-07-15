(function(){
	function Sopa(){
		// initial values for the game
	};
	
	Sopa.prototype = new jGame({"canvas" : "playCanvas", "width": 640, "height" : 480, "frameRate" : Math.ceil(1000 /220), "showFrameRate" : false, stateName : "main"});
	this.Sopa = Sopa;
	
	Sopa.prototype.init = function(){
		// Call the main game constructor
		jGame.prototype.init.call(this);
				
		// Create the background
		this.resourceManager.add("images/bg.png", 1, "background");
		this.resourceManager.add("images/losescreen.png", 1, "losebg");
		this.resourceManager.add("images/howtoplay.png", 1, "howtoplay");
		this.resourceManager.add("images/title.png", 1, "title");
		this.resourceManager.add("images/buttons.png", 1, "buttons");
		this.resourceManager.add("images/protestor.png", 1, "protestor");
		this.loaded(this);
	}
	
	// Totoally overriding the load prototype
	Sopa.prototype.loaded = function(game){
		var self = this;
			
		if(this.resourceManager.loadingComplete){
			game.afterLoad();
			return true;
		}else{
			setTimeout(function(){self.loaded(game)},100);
			return false;
		}
		event.time;
	}
	
	// After the random seed is generated do the rest.
	Sopa.prototype.afterLoad = function(){
		Math.seedrandom(Math.floor(Math.random()*10000));
		this.gameHud = {};
		this.gameState = {};
		
		this.gameState.spreadPoints = 0; // controls how many people you can click to make them aware
		this.gameState.level = 0;
		this.gameState.awareness = 0;
		this.gameState.time = 30000;
		this.gameState.lastTime = new Date().getTime();
		this.gameState.influence = 0;
		this.gameState.influenceGoal = 50;
		this.gameState.started = false;
		this.gameState.protestors = [];
		
		var parralaxBackground = new ParralaxBackground(),
			bg1 = new Background({'resource' : this.resourceManager.getResource('background'), 'bgIndex' : 0, 'endX' : 640, 'endY': 480});
			parralaxBackground.addBackground({'background' : bg1, 'speedMultX' : 0, 'speedMultY' : 0});
			
		var gameHud = this.gameHud,
			gameState = this.gameState;
		
		gameHud.ui = new UI();
		gameHud.cursor = new Cursor({width:16, height:16, startX : 496, resource : this.resourceManager.getResource('buttons')});
		gameHud.ui.addItem(gameHud.cursor, 100);
		gameHud.cursor.visible = false;
		
		gameHud.crossHairs = new Cursor({width:16, height:16, startX : 480, oX : 8, oY : 8, resource : this.resourceManager.getResource('buttons')});
		gameHud.ui.addItem(gameHud.crossHairs, 100);
		
		gameHud.ui.spreadLabel = new Label({'text':' ',x:10,y:20, 'font':'14pt arial bold'});
		gameHud.ui.addItem(gameHud.ui.spreadLabel, 100);	
		
		gameHud.ui.influenceLabel = new Label({'text':'',x:256,y:Game.bounds.height - 36, 'font':'12pt arial bold'});
		gameHud.ui.addItem(gameHud.ui.influenceLabel, 100);	

		gameHud.ui.progressBar = new ProgressBar({x : 20, y : Game.bounds.height - 20, width : 600, height : 15, shape : true, color:"rgb(255,0,0)", track : this.gameState.time, max : this.gameState.time});
		gameHud.ui.addItem(gameHud.ui.progressBar);
		
		gameHud.ui.influenceBar = new InfluenceBar({x : 20, y : Game.bounds.height - 50, width : 600, height : 15, shape : true, color:"rgb(0,255,0)", track : this.gameState.influence, max : this.gameState.influence});
		gameHud.ui.addItem(gameHud.ui.influenceBar);
		
		gameHud.ui.waveLabel = new Label({'text':'Level 1',x:210,y:20, 'font':'14pt arial bold'});
		gameHud.ui.addItem(gameHud.ui.waveLabel, 100);	
	
		// Initialize the ai controller
		//new Director();
		this.newLevel();
		
		this.setupMenuScreen();
		
		// Kick off the game!
		this.intervalId = setTimeout(function(){Game.update()}, this.frameRate);
	}
	
	Sopa.prototype.newLevel = function(){
		var gameState = this.gameState;
		
		this.gameHud.cursor.visible = false;
		this.gameHud.crossHairs.visible = true;
		
		gameState.level ++;
		gameState.spreadPoints = 1;
		
		if(gameState.level<10){
			gameState.influenceGoal = 50 + gameState.level * 5;
		}else{
			gameState.influenceGoal = 100;
		}
		
		this.gameHud.ui.waveLabel.text = "Level " + gameState.level + " Make " + gameState.influenceGoal + "% Aware!";
		
		if(gameState.level < 10){
			gameState.time = 30000 - gameState.level*2000;
		}else{
			gameState.time = 10000;
		}
		
		this.gameHud.ui.progressBar.max = gameState.time;
		
		if(gameState.protestors.length > 0){
			for(var i = 0; i < gameState.protestors.length; i++){
				gameState.protestors[i].live = false;
			}
		}
		
		gameState.protestors = [];
		for(var i = 0; i < 10 + (gameState.level * 2); i++){
			gameState.protestors.push(new Protest({x : Math.random()*Game.bounds.width, y : Math.random()*Game.bounds.height, resource : this.resourceManager.getResource('protestor'), type : 1}));
		}
		
		gameState.lastTime = new Date().getTime();
	}
	
	// Setup the Menu screen
	Sopa.prototype.setupMenuScreen = function(){
		// Switch to the menu state and add everything pertaining to it
		Game.addState("menu");
		Game.switchState({name : "menu"});		
		
		var parralaxBackground = new ParralaxBackground(),
			bg1 = new Background({'resource' : this.resourceManager.getResource('background'), 'bgIndex' : 0, 'endX' : 640, 'endY': 480});
			parralaxBackground.addBackground({'background' : bg1, 'speedMultX' : 0, 'speedMultY' : 0});
			
		var menu = {};
			
		menu.ui = new UI();
		menu.title = new Sprite({x : Game.width/2-(460/2), y : 100, width: 460, height : 79, resource : this.resourceManager.getResource('title')});
		menu.startButton = new Button({width:193, height:53, x : Game.width/2-193/2, y : 240, resource : this.resourceManager.getResource('buttons'),
											clicked : function(){
												Game.switchState({id : 0, enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});
											},
											hover : function(over){
												if(over){
													this.startY = 56;
												}else{
													this.startY = 0;
												}
											}});
											
		menu.howToPlayButton = new Button({width:220, height:53, x : Game.width/2-220/2, y : 310, startY : 109, resource : this.resourceManager.getResource('buttons'),
											clicked : function(){
												Game.switchState({name : "howtoplay", enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});
											},
											hover : function(over){
												if(over){
													this.startY = 165;
												}else{
													this.startY = 109;
												}
											}});
											
		menu.awarenessButton = new Button({width:220, height:53, x : Game.width/2-220/2, y : 380, startY : 220, resource : this.resourceManager.getResource('buttons'),
											clicked : function(){
												window.open('http://fightforthefuture.org/pipa','_newtab');
											},
											hover : function(over){
												if(over){
													this.startY = 276;
												}else{
													this.startY = 220;
												}
											}});
																		
		menu.cursor = new Cursor({width:16, height:16, startX : 496, resource : this.resourceManager.getResource('buttons')});
											
		// add the UI elements
		menu.ui.addItem(menu.startButton);
		menu.ui.addItem(menu.howToPlayButton);
		menu.ui.addItem(menu.awarenessButton);
		menu.ui.addItem(menu.title);
		menu.ui.addItem(menu.cursor, 100);
		
		// create some little protestor dudes
		menu.protestors = [];
		menu.enemies = [];
		for(var i = 0; i < 10; i++){
			menu.protestors.push(new Protest({x : Math.random()*Game.bounds.width, y : Math.random()*Game.bounds.height, resource : this.resourceManager.getResource('protestor')}));
		}
		
		for(var i = 0; i < 10; i++){
			menu.protestors.push(new Protest({x : Math.random()*Game.bounds.width, y : Math.random()*Game.bounds.height, resource : this.resourceManager.getResource('protestor'), type : 1}));
		}
		
		this.setupLoseScreen();
		this.setupHowToPlayScreen();
	}
	
	Sopa.prototype.setupLoseScreen = function(){
		// Switch to the menu state and add everything pertaining to it
		Game.addState("lost");
		
		var parralaxBackground = new ParralaxBackground({state : {name : "lost"}}),
			bg1 = new Background({'resource' : this.resourceManager.getResource('losebg'), 'bgIndex' : 0, 'endX' : 640, 'endY': 480});
			parralaxBackground.addBackground({'background' : bg1, 'speedMultX' : 0, 'speedMultY' : 0});
	}
	
	Sopa.prototype.setupHowToPlayScreen = function(){
		// Switch to the menu state and add everything pertaining to it
		Game.addState("howtoplay");
		
		var parralaxBackground = new ParralaxBackground({state : {name : "howtoplay"}}),
			bg1 = new Background({'resource' : this.resourceManager.getResource('howtoplay'), 'bgIndex' : 0, 'endX' : 640, 'endY': 480});
			parralaxBackground.addBackground({'background' : bg1, 'speedMultX' : 0, 'speedMultY' : 0});
	}
	
	Sopa.prototype.weLose = function(){
		Game.switchState({name : "lost", enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});		
		
		this.gameState.spreadPoints = 0; // controls how many people you can click to make them aware
		this.gameState.level = 0;
		this.gameState.awareness = 0;
		this.gameState.time = 30000;
		this.gameState.lastTime = new Date().getTime();
		this.gameState.influence = 0;
		this.gameState.influenceGoal = 50;
		this.gameState.started = false;
		this.newLevel();
	}
	
	Sopa.prototype.clicked = function(event, self){
		jGame.prototype.clicked(event,self);
		if(this.currentState.name === "howtoplay" || this.currentState.name === "lost"){
			Game.switchState({name : "menu", enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});		
		}
	}
	
	/*Sopa.prototype.mouseWheel = function(event, self){
		this.zoom -= (jGame.prototype.mouseWheel(event,self)*2);
	}*/
	
	Sopa.prototype.update = function(){
		jGame.prototype.update.call(this);
				
		var entities = this.entities,
			entLen = this.entities.length,
			protestCount = 0;
			
		for(var i = 0; i < entLen; i++){			
			var curItem = entities[i];
			
			if(curItem.type === 0){
				protestCount ++;
			}
			
			if(curItem.type !== 1){
				continue;
			}			
			
			for(var j = 0; j < entLen; j++){
				var item = entities[j];
				
				if(item === curItem || item.type !== 0){
					continue;
				}
				
				var checkRadius = curItem.radius + item.radius;
				
				if(this.utilities.getDistance(curItem.pos, item.pos) < checkRadius){
					curItem.hit();
				}
			}
		}
		
		this.gameState.influence = protestCount / (10 + (this.gameState.level * 2));
		
		if(this.gameState.influence*100 >= this.gameState.influenceGoal && this.gameState.started){
			this.gameState.started = false;
			this.newLevel();
		}
		
		if(this.gameState.started){
			this.gameState.time -= new Date().getTime()-this.gameState.lastTime;
			this.gameState.lastTime = new Date().getTime();
		}
		
		if(this.gameState.time <= 0){
			if(this.currentState.name !== "lost"){
				this.weLose();
			}
		}
		
		this.gameHud.ui.influenceLabel.text = "Awareness : " +  Math.floor(this.gameState.influence*100) + "%";
	}

})();

var Game = {};
window.onload = function(){
	Game = new Sopa();
	Game.init();	
};