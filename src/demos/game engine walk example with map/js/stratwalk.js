
function StratWalk(){

}

StratWalk.prototype = new Jest({
                            "canvas" : "playCanvas", 
                            "width": 800, 
                            "height" : 600, 
                            "frameRate" : Math.ceil(1000/60), 
                            "showFrameRate" : true
                        });

StratWalk.prototype.load = function(){
    this.resourceManager.add("images/top_down_onboarder_af.png", 1, "player");
    this.resourceManager.add("images/tiles-l.png", 1, "tiles");
    Jest.prototype.load.call(this);
}

StratWalk.prototype.init = function(){
    // Call the main game constructor
    Jest.prototype.init.call(this);
    //Game.addState("menu");

    this.gameState = {};
    gameState = this.gameState;

    var playerResource = Game.Utilities.preCalcRotation(this.resourceManager.getResource('player'), 8, 60, 64);
    gameState.player = new Player({resource : this.resourceManager.getResource('player')});
    gameState.map = new StratMap({resource : this.resourceManager.getResource('tiles'), player : gameState.player});

    gameState.pathFinder = new PathFinder(gameState.map.data);

    gameState.npcs = [];
    for(var i = 0; i < 10; i ++){
        gameState.npcs.push(new NPC({
            'resource' : this.resourceManager.getResource('player'), 
            map : gameState.map,
            pathFinder : gameState.pathFinder
        }));
    }

    gameState.ui = new UI();
    gameState.miniMap = new MiniMap({map : gameState.map, npcs : gameState.npcs});
    gameState.ui.addItem(gameState.miniMap, 100);

    Game.update();
};

StratWalk.prototype.update = function(){
    Jest.prototype.update.call(this);
}

this.StratWalk = StratWalk;

window.onload = function(){
    Game = new StratWalk();
    Game.load();
};