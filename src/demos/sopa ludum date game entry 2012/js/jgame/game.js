(function () {

	/**
	 * jGame(options:object)
	 * options canvas:string, width:int, height:int, frameRate:int
	 * Sets up the initial values required to start the game
	 **/
	function jGame(options){
		if(options !== undefined){
			// set canvas
			if(options.canvas === undefined){
				this.renderCanvas = options.canvas;
			}else{
				this.renderCanvas = "playCanvas";
			}
			
			// Set canvas size
			if(options.width === undefined){
				this.width = 320;
			}else{
				this.width = options.width;
			}
			
			if(options.height === undefined){
				this.height = 240;
			}else{
				this.height = options.height;
			}
			
			// Set Framerate
			if(options.frameRate === undefined){
				this.frameRate = Math.ceil(1000 / 60);
			}else{
				this.frameRate = options.frameRate;
			}
			
			// Show or hide Framerate display
			if(options.showFrameRate === undefined){
				this.showFrameRate = false;
			}else{
				this.showFrameRate = options.showFrameRate;
			}
			
			// Set Error rate for physics calculations;
			if(options.errorCorrection === undefined){
				this.errorCorrection = 5;
			}else{
				this.errorCorrection = options.errorCorrection;
			}
			
			// option for specifying the name of the first state
			if(options.stateName){
				this.stateName = options.stateName;
			}else{
				this.stateName = "0";
			}
			
		}else{
			this.renderCanvas = "playCanvas";
			this.width = 320;
			this.height = 240;
			this.frameRate = Math.ceil(1000 / 60);
			this.errorCorrection = 5;
			this.showFrameRate = false;
			this.stateName = "0";
		}
		
		// State info
		this.states = [];
		this.currentState = {};
		
		// Render stuff
		this.renderer = {};
		this.renderList = [];
		this.entities = [];
		
		// Timing 
		this.intervalId = {};
		this.lastTime = (new Date()).getTime();
		this.accTime = 0;
		this.timeStep = 1;
		
		// game bounds
		this.bounds = {x: 0, y: 0, width : this.width, height : this.height};
		
		// used to show the fps
		this.frameRateLabel = {};
		
		// init the utilities and resource manager
		this.utilities = new Utilities();	
		this.resourceManager = new ResourceManager();
		
		// List of entities in a recent collision
		this.hitEntities = []; 
	}
	
	// Make jGame accessable
	this.jGame = jGame;
	
	jGame.prototype = {
		/**
		 * jGame.init()
		 * 
		 * prepares the canvas for rendering, and starts the update process
		 **/
		init : function(){
			// base for starting, presetup ect.
			var self = this;
			
			this.renderCanvas = document.getElementById(this.renderCanvas);
			
			if(this.renderCanvas === null){
				this.renderCanvas = document.createElement("canvas");
			}
			
			this.renderCanvas.addEventListener('click', function(event){self.clicked(event,self);}, false);
			this.renderCanvas.addEventListener('mousemove', function(event){self.mouseMove(event,self)}, false);
			
			// mousewheel
			this.renderCanvas.addEventListener ("mousewheel", function(event){self.mouseWheel(event,self);}, false);
			this.renderCanvas.addEventListener ("DOMMouseScroll", function(event){self.mouseWheel(event,self);}, false);
			
			this.renderCanvas.width = this.width;
			this.renderCanvas.height = this.height;
			
			this.renderer = new Renderer(this.renderCanvas);
			
			this.addState(this.stateName);
			this.switchState({'id' : 0});
			
			// setup a label to display the frameRate
			if(this.showFrameRate){
				this.frameRateLabel = new Label({'text':' ', x:0,y:30,z:1, 'font':'14pt arial bold'});
				this.addEntity(this.frameRateLabel);
			}
			
			this.mouseX = 0;
			this.mouseY = 0;
			
			// Call the loaded function to make sure all resources have loaded before starting
			//this.loaded(self);
		},
		
		/**
		 * jGame.update()
		 * 
		 * Main update loop for the game, updates all objects, and calls the renderer.
		 **/
		update : function(){
			var curTime = (new Date()).getTime(),
				update = this.update;
			
			this.deltaTime = curTime - this.lastTime;
			this.lastTime = curTime;
			this.accTime += this.deltaTime;	
			
			while (this.accTime > this.timeStep)
			{
				this.accTime -= this.timeStep;
				var entities = this.entities;
					
				for (var id  = 0,entLen = this.entities.length; id < entLen; id ++){
					var object = entities[id];
					if(object !== undefined){
						if(object.live){
							object.update(this.timeStep /100);
						}else{
							this.removeEntity(object);
						}
					}
				}
			}

			this.renderer.redraw();
			this.frameRateLabel.text = Math.round(1000/this.deltaTime) + " fps";
			
			var self = this;
			this.intervalId = setTimeout(function(){self.update()}, this.frameRate);
		},
		/**
		 * jGame.loaded()
		 * object event
		 * makes sure everything is loaded until continuing
		 **/
		loaded : function(game){
			var self = this;
			if(this.resourceManager.loadingComplete){
				this.intervalId = setTimeout(function(){game.update()}, this.frameRate);
				return true;
			}else{
				setTimeout(this.loaded(game),100);
				return false;
			}
		},
		/**
		 * jGame.clicked()
		 * object event
		 * handles the click event for the canvas
		 * TODO update this, I dont like how it requires origin and pos
		 **/
		clicked : function(event, self){
			this.cX = 0;
			this.cY = 0;
				
			if (event.pageX || event.pageY) {
				this.cX = event.pageX;
				this.cY = event.pageY;
			}
			else {
				this.cX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				this.cY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}

			this.cX -= self.renderCanvas.offsetLeft;
			this.cY -= self.renderCanvas.offsetTop;
			
			var id = self.entities.length,
				entities = self.entities;
				
			while(id--){
				var entity = entities[id];
				if(entity.clickable && entity.pos && entity.origin){
					if(this.cX > entity.pos.x-entity.origin.x && this.cX < (entity.pos.x-entity.origin.x)+entity.width && this.cY > entity.pos.y-entity.origin.y && this.cY < (entity.pos.y-entity.origin.y)+entity.height){
						entity.clicked();
					}
				}
			}
			
			return {'clickX' : this.cX, 'clickY' : this.cY}
		},
		/**
		 * jGame.mouseMove()
		 * object event
		 * handles the mouse move event
		 **/
		mouseMove : function(event, self){
			if(event.pageX ||event.pageY){
				self.mouseX = event.pageX - self.renderCanvas.offsetLeft;
				self.mouseY = event.pageY - self.renderCanvas.offsetTop;
			}else{
				self.mouseX = (event.clientX + document.body.scrollLeft - document.body.clientLeft) - self.renderCanvas.offsetLeft;
				self.mouseY = (event.clientY + document.body.scrollTop  - document.body.clientTop) - self.renderCanvas.offsetTop;
			}
		},
		mouseWheel : function(event, self){
			var dir = 0;
			if ('wheelDelta' in event) {
                if(Math.abs(event.wheelDelta) - event.wheelDelta === 0){
					dir = -1;
                }else{
					dir = 1;
                }
            }else if (event.detail) {
                if(Math.abs(event.detail) - event.detail === 0){
					dir = 1;
                }else{
					dir = -1;
                }
            }
			
			return dir;
		},
		// Handles Entities
		
		/**
		 * jGame.addEntity()
		 * object entity, renderFalse bool, state object
		 * renderFalse : controls if the item is added to the renderer.. idk this is kind of hack, basically its for things you want in the
		 * main update loop but doesn't render at all, so like a container
		 * state {name : string, OR id : number}: allows you to specify what state you want to add the entity to, if you dont specify it adds it to the current state
		 **/
		addEntity : function(object, renderFalse, state){
			// add the live prop since the renderer/update chooses to display or update based on it
			if(!("live" in object)){
				object.live = true;
			}
			
			if(state){
				var foundState = this.getState(state);
			
				if(foundState){
					foundState.entityList.push(object);
					if(!renderFalse){
						foundState.renderList.push(object);
					}
				}
			}else{
				this.entities.push(object);
				if(!renderFalse){
					this.renderer.addToRenderer(object);
				}
			}
		},
		
		/**
		 * jGame.removeEntity()
		 * object entity, state Object
		 * Removes an entity from the update cycle and renderer, you can also specify the state you want to remove from
		 **/
		removeEntity : function(object, state){
			var entities = this.entities,
				numEntities = entities.length;
			
			if(state){
				var foundState = this.getState(state);;
				
				if(foundState){
					entities = foundState.entityList;
					numEntities = entities.length;
				}
			}
		
			for (var id = 0; id < numEntities; id ++) {
				if(entities[id] === object){
					entities.splice(id,1);
					this.renderer.removeFromRenderer(object);
					delete object;
					break;
				}
			}
		},
		
		/**
		 * jGame.addState()
		 * object options
		 * {name : string}
		 * Adds a state the jGame, states hold their own entity list, and render list
		 **/
		addState : function(name){
			var stateObj = {};
			
			if(name){
				stateObj.name = name;
			}else{
				stateObj.name = this.states.length;
			}
				
			// assign it the next val
			stateObj.id = this.states.length;
			stateObj.renderList = [];
			stateObj.entityList = [];
			this.states.push(stateObj);
		},
		
		/**
		 * jGame.getState()
		 * object options
		 * {name : string, id : number}
		 * Finds and returns the state
		 **/
		 getState : function(options){
			var foundState = false;
			
			if("id" in options){
				foundState = this.states[options.id];;
			}else if("name" in options){
				var stateName = options.name;
				for(var i = 0, len = this.states.length; i < len; i++){
					if(this.states[i].name === stateName){
						foundState = this.states[i];;
						break;
					}
				}
			}
			
			return foundState;
		 },
		
		/**
		 * jGame.switchState()
		 * object options
		 * {name : string, id : number}
		 * Adds a state the jGame, states hold their own entity list, and render list
		 **/
		switchState : function(options){
			var foundState = this.getState(options);

			// throw in a debug if the state hasn't been found
			if(foundState){	
				if(options.exitTransition && !options.exitComplete){
					// perform exit transition if one exists
					options.exitComplete = true;
					Game.addEntity(new Transition(options.exitTransition, function(){Game.switchState(options);}));
				}else{
					// switch the render list, and the entity list 
					this.currentState = foundState;
					this.renderer.renderList = this.currentState.renderList;
					this.entities = this.currentState.entityList;
					
					// Perform enter transition if one exists
					if(options.enterTransition){
						Game.addEntity(new Transition(options.enterTransition));
					}
				}
			}
		},	
		/**
		 * jGame.checkHit(x,y)
		 * x,y number
		 * Checks all the entities to see if they were hit by the coords. Very expensive right now definitly need to clean it up
		 **/
		 checkHit : function(x,y){
			var numEntities = this.entities.length,
				entities = this.entities;
				
			this.hitEntities = [];
				
			for (var id  = 0,entLen = this.entities.length; id < entLen; id ++){
				var object = entities[id];
				if(object.live && object.clickable){
					if(x > object.x && x < object.x + object.width && y > object.y && y < object.y + object.height){
						this.hitEntities.push(object);
					}
				}
			}
		 }
	}
})();