(function(){
	function DeathMatch(){
		this.step = 100;
		this.delStep = 0;
	};
	
	DeathMatch.prototype = new jGame({"width": 800, "height" : 600, "frameRate" : Math.ceil(1000/120), "showFrameRate" : false});
	this.DeathMatch = DeathMatch;
	
	// preload all the resources
	DeathMatch.prototype.load = function(){
		this.resourceManager.add("images/tiles.png", 1, "tiles");
		this.resourceManager.add("images/selection.png", 1, "selection");
		this.resourceManager.add("images/footicon.png", 1, "footicon");
		this.resourceManager.add("images/archicon.png", 1, "archicon");
		this.resourceManager.add("images/healicon.png", 1, "healicon");
		this.resourceManager.add("images/clearicon.png", 1, "clearicon");
		this.resourceManager.add("images/footman.png", 1, "footman");
		this.resourceManager.add("images/footman-e.png", 1, "footman-e");
		this.resourceManager.add("images/archer.png", 1, "archer");
		this.resourceManager.add("images/archer-e.png", 1, "archer-e");
		this.resourceManager.add("images/gamebg.png", 1, "gamebg");
		this.resourceManager.add("images/board.png", 1, "board");
		this.resourceManager.add("images/defeat.png", 1, "defeatbg");
		this.resourceManager.add("images/victory.png", 1, "victorybg");
		this.resourceManager.add("images/menu.png", 1, "menubg");
		this.resourceManager.add("images/difficulty.png", 1, "diffbg");
		this.resourceManager.add("images/start.png", 1, "startbut");
		this.resourceManager.add("images/easy.png", 1, "easybut");
		this.resourceManager.add("images/medium.png", 1, "mediumbut");
		this.resourceManager.add("images/insane.png", 1, "insanebut");
		this.resourceManager.add("images/tutorial.png", 1, "tutbg");
		this.resourceManager.add("images/tut-but.png", 1, "tutbut");
		this.resourceManager.add("images/back-but.png", 1, "backbut");
		this.resourceManager.add("images/lanesel.png", 1, "laneSel");
		jGame.prototype.load.call(this);
	}
	
	// init, and setup the initial state (which is the game state in this case)
	DeathMatch.prototype.init = function(){
		jGame.prototype.init.call(this);
		
		this.gameState = {};
		var gameState = this.gameState;
		
		// setup the background
		var gameBg = new Background({'resource' : this.resourceManager.getResource('gamebg'), 'bgIndex' : 0}),
			parralaxBackground = new ParralaxBackground();
			parralaxBackground.addBackground({'background' : gameBg, 'speedMultX' : 0, 'speedMultY' : 0});
		
		// score and resource vars
		gameState.score = 0;
		gameState.resources = 0;
		
		// bar to show the player how much they can spend
		gameState.resourceBar = new ResourceBar({x : 380, y : 430, height : 30, shape : true, color:{r:0, g:100, b:255}});
		
		// main matching board
		new Board({pos : {x:380, y: 20, z:1}, resource : this.resourceManager.getResource('board')});
		
		// ui for buttons and labels
		gameState.ui = new UI();
		
		//gameState.scoreLabel = new Label({'text':'Test', x:0,y:30,z:1, 'font':'14pt MedievalSharp'});
		//gameState.ui.addItem(gameState.scoreLabel, 100);	
		
		gameState.eCastleHealthLabel = new Label({'text':'Test', x:160,y:40,z:1, 'font':'14pt MedievalSharp'});
		gameState.ui.addItem(gameState.eCastleHealthLabel, 100);	
		gameState.eCastle = new Castle(gameState.eCastleHealthLabel, 2);
		
		gameState.pCastleHealthLabel = new Label({'text':'Test', x:160,y:575,z:1, 'font':'14pt MedievalSharp'});
		gameState.ui.addItem(gameState.pCastleHealthLabel, 100);	
		gameState.pCastle = new Castle(gameState.pCastleHealthLabel, 1);
		
		gameState.resourceLabel = new Label({'text':' ', x:600,y:453,z:1, 'font':'14pt MedievalSharp'});
		gameState.ui.addItem(gameState.resourceLabel, 100);	
		gameState.resourceBar.label = gameState.resourceLabel;
		
		// spawn selector for lane switching
		gameState.pLaneSel = new LaneSelector({pos:{y:480}, resource : Game.resourceManager.getResource("laneSel")});
		gameState.eLaneSel = new LaneSelector({pos:{y:82}, resource : Game.resourceManager.getResource("laneSel")});
		
		// init the lane data and grid
		gameState.laneData = {
			size : 24,
			startY:82,
			endY:480			
		};
		
		gameState.laneGrid = [];
		for(var x = 0; x < 3;x++){
			gameState.laneGrid[x] = [];
			for(var y = 0; y < 18;y++){
				gameState.laneGrid[x][y] = {
					val : 0,
					unit : false
				};
			}
		}
		
		// init the AI
		gameState.director = new Director(gameState.eLaneSel, 1);
		
		// init the unit lists
		gameState.enemyUnits = [];
		gameState.playerUnits = [];
		
		gameState.footManButton = new Button({width:50, height:50, x : 380, y : 470, resource : this.resourceManager.getResource('footicon'),
			clicked : function(){
				// spawn a footmam
				var state = gameState;
				if(state.resources >= 150){
					state.resourceBar.removePoints(150);

					new Footman({
									x:state.pLaneSel.pos.x, 
									y:state.pLaneSel.pos.y,
									z:1,
									angle : 270,
									resource : Game.resourceManager.getResource("footman"), 
									team : 1,
									lane : state.pLaneSel.currentLane,
									laneData : state.laneData,
									laneGrid : state.laneGrid,
									castle : gameState.eCastle,
									list : gameState.playerUnits
					});
				}
			}});
				
		gameState.ui.addItem(gameState.footManButton);
		
		gameState.ArcherButton = new Button({width:50, height:50, x : 440, y : 470, resource : this.resourceManager.getResource('archicon'),
			clicked : function(){
				// spawn a Archer
				var state = gameState;
				if(gameState.resources >= 100){
					gameState.resourceBar.removePoints(100);
					new Archer({
									x:state.pLaneSel.pos.x, 
									y:state.pLaneSel.pos.y,
									z:1,
									angle : 270,
									resource : Game.resourceManager.getResource("archer"), 
									team : 1,
									lane : state.pLaneSel.currentLane,
									laneData : state.laneData,
									laneGrid : state.laneGrid,
									castle : gameState.eCastle,
									list : gameState.playerUnits
					});
				}
			}});
		
		gameState.ui.addItem(gameState.ArcherButton);
		
		gameState.healButton = new Button({width:50, height:50, x : 500, y : 470, resource : this.resourceManager.getResource('healicon'),
			clicked : function(){
				// Heal the castle
				var state = gameState;
				if(gameState.resources >= 500){
					gameState.resourceBar.removePoints(500);
					gameState.pCastle.health += 25;
					if(gameState.pCastle.health > 100){
						gameState.pCastle.health = 100;
					}
				}
			}});
		
		gameState.ui.addItem(gameState.healButton);
		
		gameState.clearButton = new Button({width:50, height:50, x : 560, y : 470, resource : this.resourceManager.getResource('clearicon'),
			clicked : function(){
				// Kill every enemy unit on the board!
				var state = gameState;
				if(gameState.resources >= 1500){
					gameState.resourceBar.removePoints(1500);
					for(var i = 0; i < gameState.enemyUnits.length; i++){
						gameState.enemyUnits[i].live = false;
					}
				}
			}});
		
		gameState.ui.addItem(gameState.clearButton);
		
		// key events for the buttons.. need to integrate key events into jest.
		this.renderCanvas.parentNode.addEventListener("keyup", function(event){
				var key = event.keyCode || event.which,
					keychar = String.fromCharCode(key);

				switch(keychar){
					case "Q":
						gameState.footManButton.clicked();
						break;
					case "W":
						gameState.ArcherButton.clicked();
						break;
					case "E":
						gameState.healButton.clicked();
						break;
					case "R":
						gameState.clearButton.clicked();
						break;
				}
		
		}, false);
		
		Game.renderCanvas.onKeyDown = function(){console.log('test');}
		this.initDefeat();
		this.initVictory();
		this.initDiffSelection();
		this.initTutorial();
		this.initMenu();
		requestAnimFrame(function(){Game.update()});
	}
	
	// Initialize the menu state
	DeathMatch.prototype.initMenu = function(){
		Game.addState("menu");
		Game.switchState({name : "menu"});

		var menuState = {},
			menuBg = new Background({'resource' : this.resourceManager.getResource('menubg'), 'bgIndex' : 0}),
			parralaxBackground = new ParralaxBackground();
		
		parralaxBackground.addBackground({'background' : menuBg, 'speedMultX' : 0, 'speedMultY' : 0});
		
		menuState.ui = new UI();
		
		menuState.startButton = new Button({width:150, height:60, x : Game.width/2-146/2, y : 320, resource : this.resourceManager.getResource('startbut'),
			clicked : function(){
				Game.switchState({name : "diffSel", enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});
			},
			hover : function(over){
				if(over){
					this.startY = 60;
				}else{
					this.startY = 0;
				}
		}});
											
		menuState.ui.addItem(menuState.startButton);
		
		menuState.tutButton = new Button({width:150, height:60, x : Game.width/2-146/2, y : 400, resource : this.resourceManager.getResource('tutbut'),
			clicked : function(){
				Game.switchState({name : "tutorial", enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});
			},
			hover : function(over){
				if(over){
					this.startY = 60;
				}else{
					this.startY = 0;
				}
		}});
											
		menuState.ui.addItem(menuState.tutButton);
	}
	
	// Initialize the tutorial  state
	DeathMatch.prototype.initTutorial = function(){
		Game.addState("tutorial");
		Game.switchState({name : "tutorial"});

		var tutState = {},
			tutBg = new Background({'resource' : this.resourceManager.getResource('tutbg'), 'bgIndex' : 0}),
			parralaxBackground = new ParralaxBackground();
		
		parralaxBackground.addBackground({'background' : tutBg, 'speedMultX' : 0, 'speedMultY' : 0});
		
		tutState.ui = new UI();
		
		tutState.backButton = new Button({width:150, height:60, x : 635, y : 525, resource : this.resourceManager.getResource('backbut'),
			clicked : function(){
				Game.switchState({name : "menu", enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});
			},
			hover : function(over){
				if(over){
					this.startY = 60;
				}else{
					this.startY = 0;
				}
		}});
		
		tutState.ui.addItem(tutState.backButton);
	}
	
	// Initialize the difficulty selection state
	DeathMatch.prototype.initDiffSelection = function(){
		Game.addState("diffSel");
		Game.switchState({name : "diffSel"});

		var diffState = {},
			diffBg = new Background({'resource' : this.resourceManager.getResource('diffbg'), 'bgIndex' : 0}),
			parralaxBackground = new ParralaxBackground();
		
		parralaxBackground.addBackground({'background' : diffBg, 'speedMultX' : 0, 'speedMultY' : 0});
		
		diffState.ui = new UI();
		
		diffState.easyButton = new Button({width:150, height:60, x : Game.width/2-146/2, y : 300, resource : this.resourceManager.getResource('easybut'),
			clicked : function(){
				Game.gameState.director.setDifficulty(1);
				Game.switchState({id : 0, enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});
			},
			hover : function(over){
				if(over){
					this.startY = 60;
				}else{
					this.startY = 0;
				}
		}});
		
		diffState.ui.addItem(diffState.easyButton);
		
		diffState.medButton = new Button({width:150, height:60, x : Game.width/2-146/2, y : 370, resource : this.resourceManager.getResource('mediumbut'),
			clicked : function(){
				Game.gameState.director.setDifficulty(2);
				Game.switchState({id : 0, enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});
			},
			hover : function(over){
				if(over){
					this.startY = 60;
				}else{
					this.startY = 0;
				}
		}});
		
		diffState.ui.addItem(diffState.medButton);
		
		diffState.insaneButton = new Button({width:150, height:60, x : Game.width/2-146/2, y : 440, resource : this.resourceManager.getResource('insanebut'),
			clicked : function(){
				Game.gameState.director.setDifficulty(3);
				Game.switchState({id : 0, enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});
			},
			hover : function(over){
				if(over){
					this.startY = 60;
				}else{
					this.startY = 0;
				}
		}});

				
		diffState.ui.addItem(diffState.insaneButton);
	}
	
	// Defeat state
	DeathMatch.prototype.initDefeat = function(){
		Game.addState("defeat");
		Game.switchState({name : "defeat"});

		var defeatState = {},
			defeatBg = new Background({'resource' : this.resourceManager.getResource('defeatbg'), 'bgIndex' : 0}),
			parralaxBackground = new ParralaxBackground();
			parralaxBackground.addBackground({'background' : defeatBg, 'speedMultX' : 0, 'speedMultY' : 0});
	}
	
	// Victory state
	DeathMatch.prototype.initVictory = function(){
		Game.addState("victory");
		Game.switchState({name : "victory"});

		var victoryState = {},
			victoryBg = new Background({'resource' : this.resourceManager.getResource('victorybg'), 'bgIndex' : 0}),
			parralaxBackground = new ParralaxBackground();
			parralaxBackground.addBackground({'background' : victoryBg, 'speedMultX' : 0, 'speedMultY' : 0});
	}
	
	DeathMatch.prototype.update = function(){
		jGame.prototype.update.call(this);
		//this.gameState.scoreLabel.text = this.gameState.score;
		
		if(Game.gameState.resources >= 100){
			Game.gameState.ArcherButton.startY = 50;
		}else{
			Game.gameState.ArcherButton.startY = 0;
		}
		
		if(Game.gameState.resources >= 150){
			Game.gameState.footManButton.startY = 50;
		}else{
			Game.gameState.footManButton.startY = 0;
		}
		
		if(Game.gameState.resources >= 500){
			Game.gameState.healButton.startY = 50;
		}else{
			Game.gameState.healButton.startY = 0;
		}
		
		if(Game.gameState.resources >= 1500){
			Game.gameState.clearButton.startY = 50;
		}else{
			Game.gameState.clearButton.startY = 0;
		}

	}
	
	DeathMatch.prototype.clicked = function(event, self){
		jGame.prototype.clicked(event,self);
	}

})();

var Game = {};
	
window.onload = function(){
	Game = new DeathMatch();
	Game.load();	
};