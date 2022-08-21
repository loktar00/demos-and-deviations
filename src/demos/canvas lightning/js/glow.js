Glow = function(){
	var playCanvas = new Object,
		width = window.innerWidth,
		height = window.innerHeight,
		renderer = new Object,
		entities = [],
		utilities = new Utilities(),	
		tics = Math.ceil(1000 / 120),
		lastTime = (new Date()).getTime(),
		gameState = 1,
		accTime = 0,
		timeStep = 1,
		updateGame = function(){
			var curTime = (new Date()).getTime(),
				deltaTime = curTime - lastTime;
				
			lastTime = curTime;
			accTime += deltaTime;	
			
			while (accTime > timeStep)
			{
				accTime -= timeStep;
				
				for (var id  = 0; id <= entities.length - 1; id += 1){
					var object = entities[id];
					object.update(timeStep /100);
				}
			}
			
			renderer.redraw();
			intervalId = window.setTimeout(updateGame, tics);
		};
		return{
			items : [],
			settings : {
				// add settings
			},
			addEntity : function(object){
					entities.push(object);
					renderer.addToRenderer(object);
				},
			removeEntity : function(object){
						for (var id = 0; id <= entities.length - 1; id += 1) {
							if(entities[id] === object){
								entities.splice(id,1);
								renderer.removeFromRenderer(object);
								delete object;
							}
						}
					},
			startGame : function(){
				// Setup the canvas and renderer
				playCanvas = document.getElementById("playCanvas");
				playCanvas.width = width;
				playCanvas.height = height;
				
				renderer = new Renderer(playCanvas);
				
				for(var i = 0; i<=40; i++){
					var lightning = new Lightning({x : width/2, y: height/2, behaviour : 2, thickness : 0, speed : utilities.getRandomRange(-0.04,0.04), boltLength :height/2 - 30});
					this.items.push(lightning);
					this.addEntity(lightning);
				}
				
				var shape = new Shape({x : width/2, y: height/2, size : height/2 - 30});
				this.items.push(shape);
				this.addEntity(shape);
				
				intervalId  = window.setTimeout(updateGame, tics);
			},
			// Sets the game state, clears the timeout and pauses to other things can happen
			setState : function(state){
				
				gameState = state;
				
				switch(state){
					case 1: //continue
						lastTime = (new Date()).getTime();
						intervalId  = window.setTimeout(updateGame, tics);
					break;
					case 2: //pause
						clearTimeout(intervalId);
					break;
				}
			},
			events : {
				up : false,
				down : false,
				left : false,
				right : false,
				space : false,
				mX : 0,
				mY : 0
			},
			// Game Event handelers
			onMouseMove : function(evt){
				var offsetX = window.event.offsetX - document.body.scrollLeft,
					offsetY = window.event.offsetY - document.body.scrollTop;
					
				Glow.events.mX = event.clientX;// - offsetX;
				Glow.events.mY = event.clientY;// - offsetY;
			},
			onKeyDown : function(evt) {
			/*  if (evt.keyCode == 39) Lander.events.right = true;
			  else if (evt.keyCode == 37) Lander.events.left = true;
			  else if (evt.keyCode == 38) Lander.events.up = true;
			  else if (evt.keyCode == 40) Lander.events.down = true;*/
			  if (evt.keyCode == 32) gameStates.changeState(Math.abs(gameState--));
			},
			onKeyUp : function (evt) {
			/*  if (evt.keyCode == 39) Lander.events.right = false;
				else if (evt.keyCode == 37) Lander.events.left = false;
				else if (evt.keyCode == 38) Lander.events.up = false
				else if (evt.keyCode == 40) Lander.events.down = false;
				if (evt.keyCode == 32) Lander.events.space = false; */
			}

		};
}();

gameMenu = function(){
	// GAH CODE DUPLICATION!!
	var playCanvas = new Object,
		width = window.innerWidth,
		height = 600,
		renderer = new Object,
		entities = [],
		tics = Math.ceil(1000 / 120),
		lastTime = (new Date()).getTime(),
		menuState = 1,
	    updateMenu = function(){
			// Add logic here
		};
	return{
		setState : function(state){
			// Add logic here
		},
		initMenu : function(){
			
		}
	}
}

// This could definitly be handled better. implemented a bit fast just to have a menu system in place.
gameStates = function(){
	return{
		changeState : function(state){
			switch(state){
				case 1:	//menu state
					Glow.setState(2);
					break;
				case 2: // game state
					Glow.setState(1);
					break;
			}
		}
	};
}();

window.onload = function(){
	Glow.startGame();
	
	// Bind key events
	document.onkeydown = Glow.onKeyDown;
	document.onkeyup = Glow.onKeyUp;
	document.onmousemove = Glow.onMouseMove;
};