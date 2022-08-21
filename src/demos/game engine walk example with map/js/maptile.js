function MapTile(settings){
    Jest.Sprite.call(this, settings);
    this.tileX = settings.tilePos.x;
    this.tileY = settings.tilePos.y;
    this.tileSize = settings.tileSize;

    this.colId = settings.colId;
    this.map = settings.map;
    Game.addEntity(this, true);
}

MapTile.prototype = new Jest.Sprite();

MapTile.prototype.update = function(deltaTime){
        this.pos.x = this.tileX*this.tileSize + this.map.offsetX;
        this.pos.y = this.tileY*this.tileSize + this.map.offsetY;
};