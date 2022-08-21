function Body(options) {
  Jest.Sprite.call(this, options);
  this.shape = true;

  this.color = options.color || {
      r: ~~ (Math.random() * 200) + 50,
      g: ~~ (Math.random() * 200) + 50,
      b: ~~ (Math.random() * 200) + 50
  };

  this.origin.x = this.width / 2;
  this.origin.y = this.height / 2;

  this.radius = options.radius;
  this.colId = 1;

  this.mass = options.mass || this.radius;

  Game.addEntity(this);
}

Body.prototype = new Jest.Sprite();

Body.prototype.update = function (deltaTime) {
  Jest.Sprite.prototype.update.call(this, deltaTime);

  var gravBodies = this.list,
      G = Game.settings.gravity;

  for (var i = 0; i < gravBodies.length; i++) {
      if (gravBodies[i] !== this) {
          var x1 = this.pos.x,
              x2 = gravBodies[i].pos.x,
              y1 = this.pos.y,
              y2 = gravBodies[i].pos.y,
              distance = Game.Utilities.getDistance(this.pos, gravBodies[i].pos);

          if (distance > this.radius + gravBodies[i].radius) {
              var force = G * this.mass * gravBodies[i].mass / (distance * distance),
                  xcomp = (x1 - x2) / distance,
                  ycomp = (y1 - y2) / distance,
                  deltaV1 = force / this.mass, // Divide force by mass
                  deltaV2 = force / gravBodies[i].mass;

              gravBodies[i].vel.x += deltaV2 * xcomp;
              gravBodies[i].vel.y += deltaV2 * ycomp;

              this.vel.x -= deltaV1 * xcomp;
              this.vel.y -= deltaV1 * ycomp;

              if (this.mass < Game.settings.sunMass) {
                  this.pos.x += this.vel.x * deltaTime;
                  this.pos.y += this.vel.y * deltaTime;
              }

              if (gravBodies[i].mass < Game.settings.sunMass) {
                  gravBodies[i].pos.x += gravBodies[i].vel.x * deltaTime;
                  gravBodies[i].pos.y += gravBodies[i].vel.y * deltaTime;
              }
          } else {
              if (this.mass > gravBodies[i].mass) {
                  if (this.mass < Game.settings.sunMass) {
                      this.radius += gravBodies[i].radius / 4;
                      this.mass += gravBodies[i].mass / 2;
                  }

                  gravBodies[i].live = false;
                  gravBodies[i].mass = 0;
                  gravBodies[i].radius = 0;
              } else {

                  if (gravBodies[i].mass < Game.settings.sunMass) {
                      gravBodies[i].radius += this.radius / 4;
                      gravBodies[i].mass += this.mass / 2;
                  }

                  this.live = false;
                  break;
              }
          }
      }
  }

};

Body.prototype.render = function (context) {
  var zoom = Game.settings.zoom,
      width = Game.bounds.width,
      height = Game.bounds.height,
      radius = this.radius / Game.settings.zoom,
      cX = this.pos.x / zoom + width / 2 - (width / 2) / zoom,
      cY = this.pos.y / zoom + height / 2 - (height / 2) / zoom;

  context.save();
  var color = this.color;
  context.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + this.alpha + ")";
  context.beginPath();

  context.arc(cX, cY, radius, 0, Math.PI * 2);
  context.fill();
  context.closePath();
  context.restore();
};

function solar(height) {
  this.height = height;
}

solar.prototype = new Jest({
  "canvas": "playCanvas",
  "width": window.innerWidth,
  "height": this.height,
  "frameRate": Math.ceil(1000 / 60),
  "showFrameRate": false
});

this.solar = solar;

solar.prototype.load = function () {
  Jest.prototype.load.call(this);
};

solar.prototype.init = function () {
  Jest.prototype.init.call(this);
  this.settings = {
      gravity: .006672,
      bodyCount: 20,
      sunMass: 2000,
      zoom: 1
  };

  this.gameState = {};
  gameState = this.gameState;
  gameState.bodies = [];

  gameState.bodies.push(new Body({
      x: Game.bounds.width / 2,
      y: Game.bounds.height / 2,
      mass: this.settings.sunMass,
      radius: 20,
      color: {
          r: 255,
          g: 100,
          b: 0
      },
      list: gameState.bodies
  }));

  var bodyCount = this.settings.bodyCount;

  // planet size
  for (var i = 0; i < ~~bodyCount / 2; i++) {
      gameState.bodies.push(new Body({
          x: Math.random() * Game.bounds.width + 200,
          y: Math.random() * Game.bounds.height + 200,
          radius: 2 + Math.random() * 5,
          vel: {
              x: Math.random(),
              y: Math.random()
          },
          list: gameState.bodies
      }));
  }

  // moon size
  for (var i = 0; i < ~~bodyCount / 2; i++) {
      gameState.bodies.push(new Body({
          x: Math.random() * Game.bounds.width + 200,
          y: Math.random() * Game.bounds.height + 200,
          radius: 1 + Math.random() * 1,
          vel: {
              x: 1 - Math.random() * 2,
              y: 1 - Math.random() * 2
          },
          list: gameState.bodies
      }));
  }
  Game.update()
};


solar.prototype.clicked = function (event, self) {
  Jest.prototype.clicked(event, self);
gameState.bodies.push(new Body({
          x: Game.cX/Game.settings.zoom,
          y: Game.cY/Game.settings.zoom,
          radius: 2 + Math.random() * 5,
          vel: {
              x: Math.random()/2,
              y: Math.random()/2
          },
          list: gameState.bodies
      }));
};

solar.prototype.mouseWheel = function (event, self) {
  dir = Jest.prototype.mouseWheel(event, self);
  this.settings.zoom += dir / 10;

  if (this.settings.zoom <= 0.1) {
      this.settings.zoom -= dir / 10;
  }

};

solar.prototype.update = function () {
  Jest.prototype.update.call(this);
};


var Game = null;

setTimeout(function(){
Game = new solar(window.innerHeight);
Game.bounds.height = window.innerHeight;
Game.load();
},100);
