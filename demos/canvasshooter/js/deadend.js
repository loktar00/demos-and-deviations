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

window.addEventListener('DOMContentLoaded', (event) => {
    main();
});

var FPS = 120,
	isLoaded = false,
	playCanvas,
	tics,
	lastTime = (new Date()).getTime(),
	curTime = (new Date()).getTime(),
	deltaTime = 0,
	utilities = new Utilities(),
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

	// Map tiles
	background = new Resource("images/world/scifi.png");
	background.source.onload = loadResource;
	resources.push(background);

	// Background overlay that always gets drawn last
	backgroundMask = new Resource("images/world/scifi-o.png");
	backgroundMask.source.onload = loadResource;
	resources.push(backgroundMask);

	// Collison map for the level
	backgroundCollision = new Resource("images/world/scifi-c.png");
	backgroundCollision.source.onload = loadResource;
	resources.push(backgroundCollision);


	//Character
	character = new Resource("images/character/soldierrun_body_gun_0000.png");
	character.source.onload = loadResource;
	resources.push(character);

	characterLegs = new Resource("images/character/soldierrun_legs.png");
	characterLegs.source.onload = loadResource;
	resources.push(characterLegs);

	zombie1 = new Image();
	zombie1.src = "images/zombies/alienanim_0000.png";
	resources.push(zombie1);

	zombie1Death = new Resource("images/zombies/aliendeath1.png");
	zombie1Death.source.onload = loadResource;
	resources.push(zombie1Death);

	loadInterval = window.setTimeout(loading, 100);

	soundManagerInit();
}

function loading(){
	if(loadedResources === resources.length-1){
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
	playCanvas.width    = 1024;
	playCanvas.height   = 768;

	$(playCanvas).css({marginTop: -playCanvas.height/2, marginLeft: -playCanvas.width/2});

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
		// Activate ze mouse MEIN FUHRER I CAN WALK!
	$("#play-canvas").mousemove(function(e) {mouseX = e.pageX - this.offsetLeft;mouseY =  e.pageY - this.offsetTop;});

	renderer    = new Renderer(playCanvas);
	tics        = Math.ceil(1000 / FPS);

	// add items to the rendering list
	currentLevel = new Level(-200, -340, background.source, backgroundMask.source, backgroundCollision.source, playCanvas.width, playCanvas.height);
	renderer.addToRenderer(currentLevel);

	player  = new Player(playCanvas.width/2, playCanvas.height/2, character.source, characterLegs.source, 11, 128, 128, currentLevel);
	addEntity(player);

	var i;
	//zombie1.src = utilities.rotateImage(23, zombie1, 10, 128);
	//document.getElementById("imgtest").src = zombie1.src;
	//for(i = 0; i<=20; i++){
	//	var enemy  = new Enemy(utilities.getRandomRange(-320,-1900), utilities.getRandomRange(-340,-1900), zombie1, 10, 128, 128, currentLevel);
	//	addEntity(enemy);
	//}

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
	//soundManager.play('ak47')
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

	for (var id = 0; id <= entities.length - 1; id += 1){
		var object = entities[id];
		object.update(deltaTime);
	}

	renderer.redraw();
	window.setTimeout(updateGame, tics);
}
