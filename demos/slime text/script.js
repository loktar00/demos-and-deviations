"use strict";
(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();


var canvas = document.getElementById("canvas"),
    shapeCan = document.createElement("canvas"),
    metaCanvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    sCtx = shapeCan.getContext("2d"),
    metaCtx = metaCanvas.getContext("2d"),
    input = document.getElementsByTagName("input")[0],
    width = 700,
    height = 200,
    mouseX = 0,
    mouseY = 0,
    threshold = 230,
    cycle = 0;

var demo = {
  timePassed : 0,
  lastTime : 0,
  waitTime : 0,
  nextStringWait : 1000,
  curText : "",
  textList : ["Loktars","Slime", "Text", "Yummy!"],
  curIndex : 0
};

var settings = {
  Color: {
    r: 0,
    g: 255,
    b: 0
  },
  CycleColors : false
},
    gui = new dat.GUI();

gui.addColor(settings, 'Color');
gui.add(settings, 'CycleColors');


canvas.width = metaCanvas.width = width;
canvas.height = metaCanvas.height = height;

shapeCan.width = 300;
shapeCan.height = 100;
sCtx.font = '3em Arial';

/*
		 *	Controls the emitter
		 */
function Emitter() {
  this.particles = [];
  this.shapeData = [];
  this.orphans = [];

  this.startTime = new Date().getTime();
  this.checkInterval = 200;
}

Emitter.prototype.update = function () {
  var partLen = this.particles.length;

  for (var i = 0; i < partLen; i++) {
    var particle = this.particles[i];
    if (particle) {
      particle.update();
    }
  }

}

Emitter.prototype.getShape = function () {
  var text = input.value;

  if(document.activeElement.tagName !== "INPUT"){
    inactiveDemo();
  }

  sCtx.clearRect(0, 0, shapeCan.width, shapeCan.height);
  sCtx.fillText(text, 10, 30);

  var imageData = sCtx.getImageData(0, 0, shapeCan.width, shapeCan.height).data;

  for(var i = 0; i < this.particles.length; i++){
    var x = this.particles[i].ox,
        y = this.particles[i].oy;

    if(imageData[((shapeCan.width * y + x)*4)+3] < 1){
      this.shapeData[(shapeCan.width * y + x)*4] = false;

      this.particles[i].ox = -100;
      this.particles[i].oy = -100;
      this.particles[i].tx += 50 - Math.random()*100;
      this.particles[i].ty += 50 - Math.random()*100;
      this.orphans.push(this.particles[i]);
    }

  }


  for (var i = 0; i < imageData.length; i += 8 ) {
    var x = i / 4 % shapeCan.width,
        y = (i / 4 - x) / shapeCan.width;

    if (imageData[i + 3] > 0) {
      if(this.shapeData[i] == false){
        if(this.orphans.length > 0){
          var part = this.orphans[0];

          part.ox = x;
          part.oy = y;
          part.tx = x*5;
          part.ty = y*5;

          this.orphans.splice(0,1);
        }else{
          var particle = new Particle({
            ox: x,
            oy: y,
            tx : x*5,
            ty : y*5
          });
          this.particles.push(particle);
        }
      }
      this.shapeData[i] = true;
    }else{
      this.startLife = new Date().getTime();
      this.shapeData[i] = false;
    }
  }
}

Emitter.prototype.render = function () {
  if (new Date().getTime() > this.startTime + this.checkInterval) {
    this.startTime = new Date().getTime();
    this.getShape();
  }

  metaCtx.clearRect(0,0,metaCanvas.width, metaCanvas.height);

  var partLen = this.particles.length,
      r = ~~settings.Color.r,
      g = ~~settings.Color.g,
      b = ~~settings.Color.b;

  while(partLen--){
    var particle = this.particles[partLen];
    metaCtx.beginPath();

    var grad = metaCtx.createRadialGradient(particle.x, particle.y, 1, particle.x, particle.y, particle.size);
    grad.addColorStop(0, "rgba(" + r + "," + g + "," + b + ",1)");
    grad.addColorStop(1, "rgba(" + r + "," + g + "," + b + ",0)");
    metaCtx.fillStyle = grad;

    metaCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI*2);
    metaCtx.fill();
  }


  for(var i = 0; i < this.orphans.length; i++){
    var orphan = this.orphans[i];

    if(orphan.y < canvas.height){
      orphan.ty += orphan.speed;
    }
  }

  if(settings.CycleColors){
    colorCycle();
  }
  metabalize();

  for (var i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
  }
}


/*
		 *	Controls the individual particles
		 */
    function Particle(options) {
      options = options || {};
      this.ox = options.ox;
      this.oy = options.oy;

      this.x = this.ox*5;
      this.y = 0;

      this.tx = options.tx;
      this.ty = options.ty;

      this.size = (Math.random()*10)+8;
      this.speed = Math.random()*1 + 0.5;

      this.startLife = new Date().getTime();
      this.lifeTime = new Date().getTime() - this.startLife;

      this.vx = 0;
      this.vy = 0;

      this.render = true;
    }

Particle.prototype.update = function () {
  var tx = this.tx - this.x,
      ty = this.ty - this.y,
      dist = Math.sqrt(tx*tx+ty*ty),
      rad = Math.atan2(ty,tx);

  this.vx += (Math.cos(rad))*(this.speed*10);
  this.vy += (Math.sin(rad))*(this.speed*10);

  if(dist < 5){
    this.vx*=0.2;
    this.vy*=0.2;
  }else{
    this.vx*=0.4;
    this.vy*=0.4;
  }

  this.x += this.vx;
  this.y += this.vy;
}

function metabalize(){
  var imageData = metaCtx.getImageData(0,0,width,height),
      pix = imageData.data;

  for (var i = 0, n = pix.length; i <n; i += 4) {
    if(pix[i+3]<threshold){
      pix[i+3]/=6;
      if(pix[i+3]>threshold/4){
        pix[i+3]=0;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function colorCycle(){
  cycle+=0.1;

  if(cycle>100){
    cycle = 0;
  }
  settings.Color.r = ~~(Math.sin(.3*cycle + 0) * 127+ 128);
  settings.Color.g =  ~~(Math.sin(.3*cycle + 2) * 127+ 128);
  settings.Color.b = ~~( Math.sin(.3*cycle + 4) * 127+ 128);
}

function inactiveDemo(){
  // this whole func is a hack.. just added to do something w/o needing interaction
  demo.timePassed = new Date().getTime() - demo.lastTime;

  if(demo.timePassed > demo.nextStringWait){
    var lastTime = demo.lastTime;

    demo.lastTime = new Date().getTime();

    if(lastTime == 0){
      demo.waitTime = 0;
      demo.nextStringWait = 2000;
    }else{
      demo.nextStringWait = 8000;
      demo.waitTime = demo.lastTime + 3000;
    }

    demo.curText = demo.textList[demo.curIndex];
    demo.curIndex++;

    if(demo.curIndex >= demo.textList.length){
      demo.curIndex = 0;
    }
  }

  if(new Date().getTime() > demo.waitTime){
    input.value = demo.curText;
  }else{
    var str = input.value.split('');
    str.pop();
    input.value = str.join('');
  }

}

function render() {
  emitter.update();
  emitter.render();
  requestAnimationFrame(render);
}

var emitter = new Emitter();
render();

