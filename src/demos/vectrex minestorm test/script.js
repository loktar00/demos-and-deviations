var mineStorm = function () {
  mineStorm.canvas =  document.getElementById("canvas");
  mineStorm.ctx = mineStorm.canvas.getContext("2d");
  mineStorm.width = 400;
  mineStorm.height = 600;
  mineStorm.canvas.width = 400;
  mineStorm.canvas.height = 600;
  mineStorm.ctx.fillStyle = "rgba(0,0,0,0.4)";
  mineStorm.ctx.fillRect(0, 0, canvas.width, canvas.height);
  mineStorm.ctx.strokeStyle = "rgba(255,255,255,0.5)";
  mineStorm.keys = [];

  this.player = new mineStorm.Player();
  this.update();
}

mineStorm.prototype = {
  keyUp : function(e){
      mineStorm.keys[e.keyCode] = false;
  },
  keyDown : function(e){
      mineStorm.keys[e.keyCode] = true;
  },
  update : function(){
      this.player.update();
      for(var b = 0; b < this.player.bullets.length; b++){
          this.player.bullets[b].update();
      }
      this.render();
  },
  render : function () {
      mineStorm.ctx.fillStyle = "rgba(0,0,0,0.4)";
      mineStorm.ctx.fillRect(0, 0, canvas.width, canvas.height);
      this.player.render();
      for(var b = 0; b < this.player.bullets.length; b++){
          this.player.bullets[b].render();
      }
      var self = this;
      requestAnimationFrame(function(){self.update();});
  }
}

mineStorm.Player = function () {
  this.points = [
      {x: 0, y: 14},
      {x: 2, y: 25},
      {x: 10, y: 15},
      {x: 8, y: 0},
      {x: 6, y: 15},
      {x: 14, y: 25},
      {x: 16,y: 14}
  ];

  this.x = 200;
  this.y = 300;
  this.vel = {x : 0, y : 0};
  this.acc = {x : 0, y : 0};
  this.thrust = 0.5;
  this.thrustLimit = 20;
  this.angle = 0;
  this.turnSpeed = 3;
  this.bullets = [];

  this.width = 16;
  this.height = 25;

  this.ox = this.width/2;
  this.oy = this.height/2;

  this.size = 1;
}

mineStorm.Player.prototype = {
  render : function(){
      var ctx = mineStorm.ctx,
          points = this.points,
          pointLen = points.length-1,
          x = this.x,
          y = this.y,
          ox = this.ox,
          oy = this.oy,
          size = this.size;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(this.angle/180 * Math.PI);

      ctx.beginPath();
      ctx.moveTo((points[pointLen].x-ox) * size, (points[pointLen].y-oy)*size);

      while(pointLen--){
          ctx.lineTo((points[pointLen].x-ox) * size, (points[pointLen].y-oy)*size);
      }

      ctx.stroke();
      ctx.restore();
  },
  update : function(){
      var keys = mineStorm.keys;
      if (keys[38]) {
          this.vel.x += Math.sin(this.angle *  Math.PI / 180) * this.thrust;
          this.vel.y += -Math.cos(this.angle *  Math.PI / 180) * this.thrust;
      }
      if (keys[39]) {
          // right arrow
          this.angle+=this.turnSpeed ;
      }
      if (keys[37]) {
          // left arrow
          this.angle-=this.turnSpeed ;
      }
      if(keys[32]){
          this.bullets.push(new mineStorm.Bullet({x : this.x, y : this.y, angle : this.angle}));
      }

      // crappy accel limit implementation
      if(Math.abs(this.vel.x) > this.thrustLimit){
          if(Math.abs(this.vel.x) - this.vel.x){
              this.vel.x = -this.thrustLimit;
          }else{
              this.vel.x = this.thrustLimit;
          }
      }

      if(Math.abs(this.vel.y) > this.thrustLimit){
          if(Math.abs(this.vel.y) - this.vel.y){
              this.vel.y = -this.thrustLimit;
          }else{
              this.vel.y = this.thrustLimit;
          }
      }

      this.vel.x*=0.95;
      this.vel.y*=0.95;

      this.x += this.vel.x;
      this.y += this.vel.y;

      if(this.x > mineStorm.width){
          this.x = 0;
      }
      if(this.x < 0){
          this.x = mineStorm.width;
      }

      if(this.y > mineStorm.height){
          this.y = 0;
      }
      if(this.y < 0){
          this.y = mineStorm.height;
      }
  }
}

mineStorm.Bullet = function(settings){
  this.x = settings.x;
  this.y = settings.y;
  this.angle = settings.angle;
}

mineStorm.Bullet.prototype = {
  update : function(){
      this.x += Math.sin(this.angle *  Math.PI / 180) * 5;
      this.y += -Math.cos(this.angle *  Math.PI / 180) * 5;

      if(this.x > mineStorm.width){
          this.x = 0;
      }
      if(this.x < 0){
          this.x = mineStorm.width;
      }

      if(this.y > mineStorm.height){
          this.y = 0;
      }
      if(this.y < 0){
          this.y = mineStorm.height;
      }
  },
  render : function(){
      var ctx = mineStorm.ctx,
          x = this.x,
          y = this.y;

      mineStorm.ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillRect(x,y,1,1);
      ctx.fillRect(x+1,y,1,1);
      ctx.fillRect(x-1,y,1,1);
      ctx.fillRect(x,y+1,1,1);
      ctx.fillRect(x,y-1,1,1);
  }
}

var game = new mineStorm();
window.addEventListener("keyup", game.keyUp);
window.addEventListener("keydown", game.keyDown);