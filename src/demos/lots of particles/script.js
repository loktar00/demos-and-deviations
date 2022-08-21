(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  })();


  var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  /*
  *	Controls the emitter
  */
  function Emitter(){
    var PART_NUM = 40000;

    this.particles = [];

    for(var i = 0; i < PART_NUM; i++){
      this.particles.push(new Particle());
    }
  }

  Emitter.prototype.update = function(){
    var partLen = this.particles.length;
    for (var i = 0; i < partLen; i++ ){
      var particle = this.particles[i];
      particle.update();
    }
  }

  Emitter.prototype.render = function(){
    var imgData = ctx.createImageData(width, height),
      data = imgData.data,
      partLen = this.particles.length;

      ctx.fillStyle = "#fff";

    for (var i = 0; i < partLen; i++ ){
      var particle = this.particles[i];

      for(var w = 0; w < particle.size; w++){
        for(var h = 0; h < particle.size; h++){
          pData = (~~(particle.x+w) + (~~(particle.y+h) * width))*4;
          data[pData] = 255;
          data[pData+1] = 255;
          data[pData+2] = 255;
          data[pData+3] = 255;
        }
      }

    }

    ctx.putImageData( imgData, 0, 0 );
  }


  /*
  *	Controls the individual particles
  */
  function Particle(){
    this.x = Math.random()*width;
    this.y = Math.random()*height;
    this.size = Math.round(1+Math.random()*1);
    this.speed = 1+(Math.random()*5);
  }

  Particle.prototype.update = function(){
    this.y+=this.speed;

    if(this.y > height){
      this.y = 0;
    }

  }

  function render(){
    emitter.update();
    emitter.render();
    requestAnimationFrame(render);
  }

  var emitter = new Emitter();
  render();