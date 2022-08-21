/*
 Copyright (c) 2010, Jason Brown
 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.

*/

$(document).ready(function(){main();});

var FPS = 120,
	isLoaded = false,
	playCanvas,
	tics,
	lastTime = (new Date()).getTime(),
	curTime = (new Date()).getTime(),
	deltaTime = 0,
	utilities,
	renderer,
	intervalId,
	gameOver = false,
	wave = 1,
	rightDown = false,
	leftDown = false,
	upDown = false,
	downDown = false,
	space = false,
	mouseDown = false,
	mouseX = 0,
	mouseY = 0,
	player;


// Set up enemy global vars
var currentLevel,
	enemyCount = 0,
	entities = [],
	resources = [],
	projectileCount = 0,
	projectiles = [],
	bgX = 0, 
	bgY = 0;


var loadedResources = 0;
	
function loadResources(){
	// Set up the images consider moving to a different file, where the encoded data is actually stored, making the game self contained.
	background = new Resource("images/world/mapbgjpg.jpg");
	background.source.onload = loadResource;
	resources.push(background);
	character = new Resource("images/character/soldierrun_body_gun_0000.png");
	character.source.onload = loadResource;
	resources.push(character);
	characterLegs = new Resource("images/character/soldierrun_legs.png");
	characterLegs.source.onload = loadResource;
	resources.push(characterLegs);
	zombie1 = new Resource("images/zombies/zombie1_walk.png");
	zombie1.source.onload = loadResource;
	resources.push(zombie1);
	zombie1Death = new Resource("images/zombies/zombie1_die.png");
	zombie1Death.source.onload = loadResource;
	resources.push(zombie1Death);
	loadInterval = window.setTimeout(loading, 100);
	
	soundManagerInit();
}

function loading(){
	if(loadedResources === resources.length){
		isLoaded = true;
		initGame();
	}else{
		loadInterval = window.setTimeout(loading, 100);
	}
}

loadResource = function(){
	loadedResources +=1;
}

function main ()
{
    loadResources();
}

function resizeCanvas ()
{
	playCanvas.width    = 640;
	playCanvas.height   = 480;

	if (renderer != null) {
		renderer.init(playCanvas);
	}
}

function addEntity(object){
	entities.push(object);
	renderer.addToRenderer(object);
}

function removeEntity(object){
	for (var id in entities) {
		if(entities[id] === object){
			entities.splice(id,1);
			renderer.removeFromRenderer(object);
			delete object;
		}
	}
}

// Set up the initial game
function initGame() {
	playCanvas  = document.getElementById("play-canvas");
	resizeCanvas();
	$("#play-canvas").mousemove(function(e) {mouseX = e.pageX;mouseY = e.pageY;});
	
	utilities 	= new Utilities();
	renderer    = new Renderer(playCanvas);
	tics        = Math.ceil(1000 / FPS);	
	
	// add items to the rendering list
	currentLevel = new Level(-600, -480, background.source, playCanvas.width, playCanvas.height);
	renderer.addToRenderer(currentLevel);
	
	player  = new Player(playCanvas.width/2, playCanvas.height/2, character.source, characterLegs.source, 11, 128, 128, currentLevel);
	addEntity(player);
	
	var i;
	
	for(i = 0; i<=150; i++){
		var enemy  = new Enemy(utilities.getRandomRange(-440,-380), utilities.getRandomRange(-440,-380), zombie1.source, 16, 128, 128, currentLevel);
		addEntity(enemy);
		
	}

	intervalId  = window.setTimeout(updateGame, tics);
}


// Game Event handelers
function onKeyDown(evt) {
  if (evt.keyCode == 39) rightDown = true;
  else if (evt.keyCode == 37) leftDown = true;
  else if (evt.keyCode == 38) upDown = true;
  else if (evt.keyCode == 40) downDown = true;
  if (evt.keyCode == 32){
	space = true;
  };
}

function onKeyUp(evt) {
	if (evt.keyCode == 39) rightDown = false;
	else if (evt.keyCode == 37) leftDown = false;
	else if (evt.keyCode == 38) upDown = false
	else if (evt.keyCode == 40) downDown = false;
	if (evt.keyCode == 32) space = false;
}

function onMouseDown(evt){
	mouseDown = true;
	soundManager.play('ak47')
}

function onMouseUp(evt){
	//mouseDown = false;
}

// Check for input
$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);
$(document).click(onMouseDown);
$(document).mouseup(onMouseUp);

function updateGame(){
	curTime = (new Date()).getTime();
	deltaTime = (curTime - lastTime) / 100;
	lastTime = curTime; 
	
	currentLevel.update(deltaTime);
	for (var id in entities){
		var object = entities[id];
		object.update(deltaTime);
	}
	
	renderer.redraw();
	window.setTimeout(updateGame, tics);
}
