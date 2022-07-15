(function(){
	function SpaceAct(){
		//this.zoom = 10;
		this.control = 0;
		this.resources = 250;
		
		this.resourceTick = 1000;
		this.lastResourceTick = new Date().getTime();
	};
	
	SpaceAct.prototype = new jGame({"canvas" : "playCanvas", "width": 640, "height" : 480, "frameRate" : Math.ceil(1000 /220), "showFrameRate" : true, stateName : "main"});
	this.SpaceAct = SpaceAct;
	
	SpaceAct.prototype.init = function(){
		// Call the main game constructor
		jGame.prototype.init.call(this);
				
		// Create the background
		this.resourceManager.add("images/pplanet.png", 1, "earth");
		this.resourceManager.add("images/title.png", 1, "title");
		this.resourceManager.add("images/buttons.png", 1, "buttons");
		this.resourceManager.add("images/station.png", 1, "station");
		this.resourceManager.add("images/asset.png", 1, "asset");
		this.resourceManager.add("images/junk1.png", 1, "junk");
		this.resourceManager.add("images/junk2.png", 1, "junk2");
		this.resourceManager.add("images/powerbar.png", 1, "powerbar");
		this.loaded(this);
	}
	
	// Totoally overriding the load prototype
	SpaceAct.prototype.loaded = function(game){
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
	SpaceAct.prototype.afterLoad = function(){
		Math.seedrandom(9281982);
		this.gameHud = {};
		this.gameState = {};
		
		var gameHud = this.gameHud,
			gameState = this.gameState;
		
		gameHud.ui = new UI();
		gameHud.cursor = new Cursor({width:16, height:16, startX : 496, resource : this.resourceManager.getResource('buttons')});
		gameHud.ui.addItem(gameHud.cursor, 100);
		
		gameHud.crossHairs = new Cursor({width:16, height:16, startX : 480, oX : 8, oY : 8, resource : this.resourceManager.getResource('buttons')});
		gameHud.ui.addItem(gameHud.crossHairs, 100);
		gameHud.crossHairs.visible = false;
		
		gameHud.statBar = new Sprite({x:10, y:40, width:120, height:132, startX: 392, startY : 16, resource : this.resourceManager.getResource('buttons')});
		gameHud.ui.addItem(gameHud.statBar, 10);
		
		gameHud.actionBox = new Sprite({x:10, y:180, width:120, height:132, startX: 392, startY : 150, resource : this.resourceManager.getResource('buttons')});
		//gameHud.actionBox.visible = false;
		gameHud.ui.addItem(gameHud.actionBox, 10);
		
		gameHud.disrupt = new Button({width:104, height:28, startY : 194, x : 18, y : 190, resource : this.resourceManager.getResource('buttons'),
											clicked : function(){
												if(!gameState.disrupt){
													gameHud.crossHairs.visible = true;
													gameHud.cursor.visible = false;
													gameState.disrupt = true;
												}else{
													gameHud.crossHairs.visible = false;
													gameHud.cursor.visible = true;
													gameState.disrupt = false;
												}
											},
											hover : function(over){
												if(over){
													this.startY = 222;
												}else{
													this.startY = 194;
												}
											}});
											
		gameHud.ui.addItem(gameHud.disrupt, 15);
		
		gameHud.ui.controlLabel = new Label({'text':' ', x:20,y:115, 'font':'12pt arial bold'});
		gameHud.ui.addItem(gameHud.ui.controlLabel, 100);	
		
		gameHud.ui.resourceLabel = new Label({'text':' ', x:20,y:160, 'font':'12pt arial bold'});
		gameHud.ui.addItem(gameHud.ui.resourceLabel, 100);	
		
		// create the planet
		gameState.starScape = new StarScape();
		gameState.planet = new Planet({x : (Game.bounds.width/2)+60, y : Game.bounds.height/2, z : 80, resource : this.resourceManager.getResource('earth')});
		gameState.rings = [];
		gameState.stations = [];
		
		// pre calc the rotations for the stations and satellites
		this.utilities.preCalcRotation(this.resourceManager.getResource('station'), 10, 32, 32, 180);
		this.utilities.preCalcRotation(this.resourceManager.getResource('asset'), 45, 16, 16, 180);
		this.utilities.preCalcRotation(this.resourceManager.getResource('junk'), 45, 16, 16, 180);
		this.utilities.preCalcRotation(this.resourceManager.getResource('junk2'), 45, 16, 16, 180);
		
		// create the rings and stations
		for(var i = 0; i < 10; i++){
			gameState.rings.push(new Ring({x : (Game.bounds.width/2)+60, y : Game.bounds.height/2, z:90,size : 100 + i*16, color: "rgba(255,255,255,0.2)"}));
		}
		
			var	cX = (Game.bounds.width/2)+60 + 80 * Math.cos(90 * Math.PI / 180),
				cY = Game.bounds.height/2 + 80 * Math.sin(90 * Math.PI / 180);
				
			gameState.stations.push(new Station({x : cX, 
												y : cY, 
												z : 100, 
												startY : 0, 
												resource : this.resourceManager.getResource('station'), 
												powerBar : new PowerBar({
																		x:cX, 
																		y:cY, 
																		z:100,
																		width:40, 
																		height:165, 
																		angle: 0,
																		resource : this.resourceManager.getResource('powerbar')
																		})
												})
									);
									
			Game.addEntity(gameState.stations[0]);
			
			var	a = 90+(360/10) * 5;
			
			cX = (Game.bounds.width/2)+60 + 80 * Math.cos(a * Math.PI / 180);
			cY = Game.bounds.height/2 + 80 * Math.sin(a * Math.PI / 180);
				
			gameState.stations.push(new Station({x : cX, 
												y : cY, 
												z : 100, 
												startY : 32*5, 
												resource : this.resourceManager.getResource('station'), 
												ringRad : 100 + 5*16, 
												powerBar : new PowerBar({
																		x:cX, 
																		y:cY, 
																		z:100,
																		width:40, 
																		height:165, 
																		angle: 5*36,
																		resource : this.resourceManager.getResource('powerbar')
																		})
												})
									);
									
			Game.addEntity(gameState.stations[1]);
		
		// make some random space assets
		for(var i = 0; i < 30; i++){
			var	index = Math.floor(Math.random()*10),
				a = 90+(360/10) * index,
				cX = (Game.bounds.width/2)+60 + 80 * Math.cos(a * Math.PI / 180),
				cY = Game.bounds.height/2 + 80 * Math.sin(a * Math.PI / 180),
				assetRes = Math.floor(Math.random()*2);
				
				if(assetRes === 0){
					asset = new Asset({x : cX, y : cY, z : 91, resource : Game.resourceManager.getResource('junk'), targetRadius : 100 + index * 16, owner : 0, drawAngle : Math.random()*360});
				}else{
					asset = new Asset({x : cX, y : cY, z : 91, resource : Game.resourceManager.getResource('junk2'), targetRadius : 100 + index * 16, owner : 0, drawAngle : Math.random()*360});
				}
				

				asset.setAngle(Math.random()*360);
				asset.setCurRadius(100 + index * 16);
			Game.addEntity(asset);
		}
		
		// 1 == player, 2 == AI
		gameState.stations[0].owner = 1;
		gameState.stations[1].owner = 2;
		
		// Initialize the ai controller
		new Director();
		
		this.setupMenuScreen();
		
		// Kick off the game!
		this.intervalId = setTimeout(function(){Game.update()}, this.frameRate);
	}
	
	// Setup the Menu screen
	SpaceAct.prototype.setupMenuScreen = function(){
		// Switch to the menu state and add everything pertaining to it
		Game.addState("menu");
		Game.switchState({name : "menu"});		
		
		var starScape = new StarScape(),
			menu = {};
			
		menu.ui = new UI();
		menu.title = new Sprite({x : Game.width/2-256, y : 128, width: 512, height : 42, resource : this.resourceManager.getResource('title')});
		menu.startButton = new Button({width:188, height:48, x : Game.width/2-188/2, y : 280, resource : this.resourceManager.getResource('buttons'),
											clicked : function(){
												Game.switchState({id : 0, enterTransition : {effect : 'fadeIn'}, exitTransition : {effect : 'fadeOut'}});
											},
											hover : function(over){
												if(over){
													this.startY = 48;
												}else{
													this.startY = 0;
												}
											}});
											
		menu.htpButton = new Button({width:326, height:48, startY : 96, x : Game.width/2-326/2, y : 350, resource : this.resourceManager.getResource('buttons'),
											clicked : function(){
												menu.ui.hide();
											},
											hover : function(over){
												if(over){
													this.startY = 144;
												}else{
													this.startY = 96;
												}
											}});
											
		menu.cursor = new Cursor({width:16, height:16, startX : 496, resource : this.resourceManager.getResource('buttons')});
											
		// add the UI elements
		menu.ui.addItem(menu.startButton);
		menu.ui.addItem(menu.htpButton);
		menu.ui.addItem(menu.title);
		menu.ui.addItem(menu.cursor, 100);
	}
	
	SpaceAct.prototype.clicked = function(event, self){
		jGame.prototype.clicked(event,self);
	}
	
	/*SpaceAct.prototype.mouseWheel = function(event, self){
		this.zoom -= (jGame.prototype.mouseWheel(event,self)*2);
	}*/
	
	SpaceAct.prototype.update = function(){
		jGame.prototype.update.call(this);
				
		var entities = this.entities,
			entLen = this.entities.length,
			totalAssets = 0,
			playerAssets = 0;
			
		for(var i = 0; i < entLen; i++){
			if(entities[i].type !== 'asset'){
				continue;
			}
			// calculate control %
			if(entities[i].type && entities[i].type === 'asset'){
				totalAssets++;
				if(entities[i].owner === 1){
					playerAssets++;
				}
			}
			
			var curItem = entities[i];
						
			for(var j = 0; j < entLen; j++){
				var item = entities[j];
				
				// Only check if the projectile is not owned by the colliding object/colliding object isnt a projectile/item is not itself				
				if(curItem === item || item.type !== 'asset'){
					continue;
				}
				
				var checkRadius = curItem.radius + item.radius;
				
				if(this.utilities.getDistance(curItem.pos, item.pos) < checkRadius){
					curItem.hit();

					if(item.type !== 'asset'){
						item.live = false;
					}else{
						item.hit();
					}
					break;
				}
			}
		}
		
		if(new Date().getTime() > this.lastResourceTick + this.resourceTick){
			this.lastResourceTick = new Date().getTime();
			this.resources += playerAssets * 10;
		}
		
		this.control = Math.round((playerAssets/totalAssets)*100);
		this.gameHud.ui.controlLabel.text = this.control + "%";
		this.gameHud.ui.resourceLabel.text = this.resources;
	}

})();

var Game = {};
window.onload = function(){
	Game = new SpaceAct();
	Game.init();	
};