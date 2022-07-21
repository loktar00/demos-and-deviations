(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
  })();

  var canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      width = window.innerWidth,
      height = document.body.offsetHeight;

      canvas.width = width;
      canvas.height = height;

  var lights = [],
      blocks = [],
      vector = function(_x,_y){
        this.x = _x;
        this.y = _y;
      },
      light = function(_position,_radius,_angleSpread, _color){
        this.color = _color;
        this.radius = _radius;
        this.angleSpread = _angleSpread;
        this.position = _position;
        this.angle = Math.random()*180;
      },
      block = function(_position,_width,_height){
        this.position = _position;
        this.width = _width;
        this.height = _height;
        this.visible = false;
      },
      angle = 0;


  // FIND DISTANCE ************************
  function findDistance(light, block, angle, rLen, start, shortest, closestBlock){
    var y = (block.position.y + block.height/2) - light.position.y,
        x = (block.position.x + block.width/2) - light.position.x,
        dist = Math.sqrt((y * y) + (x * x));

    if(light.radius >= dist)
    {
      var rads = angle * (Math.PI / 180),
          pointPos = new vector(light.position.x, light.position.y);

      pointPos.x += Math.cos(rads) * dist;
      pointPos.y += Math.sin(rads) * dist;

      if(pointPos.x > block.position.x && pointPos.x < block.position.x + block.width && pointPos.y > block.position.y && pointPos.y < block.position.y + block.height)
      {
        if(start || dist < shortest){
          start = false;
          shortest = dist;
          rLen= dist;
          closestBlock = block;
        }

        return {'start' : start, 'shortest' : shortest, 'rLen' : rLen, 'block' : closestBlock};
      }
    }
    return {'start' : start, 'shortest' : shortest, 'rLen' : rLen, 'block' : closestBlock};
  }
  // **************************************

  // SHINE LIGHT**************************
  function shineLight(light){
    var curAngle = light.angle - (light.angleSpread/2),
        dynLen = light.radius,
        addTo = 1/light.radius;

    for(curAngle; curAngle < light.angle + (light.angleSpread/2); curAngle += (addTo * (180/Math.PI))*2){
      dynLen = light.radius;

      var findDistRes = {};

      findDistRes.start = true;
      findDistRes.shortest = 0;
      findDistRes.rLen = dynLen;
      findDistRes.block = {};

      for(var i = 0; i < blocks.length; i++)
      {
        findDistRes = findDistance(light, blocks[i], curAngle, findDistRes.rLen, findDistRes.start, findDistRes.shortest, findDistRes.block);
      }

      var rads = curAngle * (Math.PI / 180),
          end = new vector(light.position.x, light.position.y);

      findDistRes.block.visible = true;
      end.x += Math.cos(rads) * findDistRes.rLen;
      end.y += Math.sin(rads) * findDistRes.rLen;

      ctx.beginPath();
      ctx.moveTo(light.position.x, light.position.y);
      ctx.lineTo(end.x, end.y);
      ctx.closePath();
      ctx.stroke();
    }
  }
  // ************************************

  function draw(){
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,width,height);

    for(var i = 0; i < blocks.length; i++){
      var block = blocks[i];
      if(block.visible){
        ctx.fillStyle = "rgb(100,0,0)";
        ctx.fillRect(block.position.x, block.position.y, block.width, block.height);
        block.visible = false;
      }else{
        ctx.fillStyle = "rgba(100,0,0,0.3)";
        ctx.fillRect(block.position.x, block.position.y, block.width, block.height);
      }
    }


    angle+=0.01;
    for(var i = 0; i < lights.length; i++){
      ctx.strokeStyle = lights[i].color;
      lights[i].angle+=3;
      lights[i].position.x+=Math.sin(angle+3)*2;
      lights[i].position.y+=Math.sin(angle+2)*2;
      shineLight(lights[i]);
    }


    requestAnimationFrame(draw);
  }

  (height < 500)?height = 500:height=height;

  for(var i = 0; i < 50; i++){
    var size = (Math.random()*20) + 2;
    blocks.push(new block(new  vector(Math.random()*width,Math.random()*height),size,size));
  }

  lights.push(new light(new vector((width/2),256), 300, 360, 'rgba(255,255,255,0.1)'));

  // for different colored random lights
  for(i = 0; i < 2; i++){
      var r= Math.floor(Math.random()*256),
          g = Math.floor(Math.random()*256),
          b = Math.floor(Math.random()*256);

      lights.push(new light(new vector(Math.random()*512,Math.random()*512), (Math.random()*200)+100, 60, 'rgba(' + r + ',' + g + ',' + b + ',0.1)'));
  }

  window.addEventListener("resize",function(){
      width = window.innerWidth;
      height = document.body.offsetHeight;
      canvas.width = width;
      canvas.height = height;
  });

  draw();

