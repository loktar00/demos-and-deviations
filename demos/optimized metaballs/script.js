(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();

  var canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      tempCanvas = document.createElement("canvas"),
      tempCtx = tempCanvas.getContext("2d"),
      height = document.body.offsetHeight,
      width = document.body.offsetWidth,
      threshold = 210,
      numPoints = 100,
      points = [];

  canvas.width = tempCanvas.width = width;
  canvas.height= tempCanvas.height= height;

  for(var i = 0; i < numPoints; i++){

    var x = Math.random()*width,
        y = Math.random()*height,
        vx = (Math.random()*8)-4,
        vy = (Math.random()*8)-4,
        size = Math.floor(Math.random()*60)+60,
        pCan = document.createElement("canvas"),
        pCtx = pCan.getContext("2d");

    pCan.width = pCan.height = size*2;

    var grad = tempCtx.createRadialGradient(pCan.width/2, pCan.height/2, 1, pCan.width/2, pCan.height/2, size);
    var color = {r:255,g:255,b:255}
    grad.addColorStop(0, 'rgba(' + color.r +',' + color.g + ',' + color.b + ',1)');
    grad.addColorStop(1, 'rgba(' + color.r +',' + color.g + ',' + color.b + ',0)');
    pCtx.fillStyle = grad;
    pCtx.arc(pCan.width/2, pCan.height/2, size, 0, Math.PI*2);
    pCtx.fill();
    points.push({x:x,y:y,vx:vx,vy:vy, size : size*2, pCan : pCan})
  };

  function update(){
    var len = points.length;
    tempCtx.clearRect(0,0,width,height);

    while(len--){
      var point = points[len];
      point.x+=point.vx;
      point.y+=point.vy;

      if(point.x > width+point.size){
        point.x = 0-point.size;
      }
      if(point.x < 0-point.size){
        point.x = width+point.size;
      }
      if(point.y > height+point.size){
        point.y = 0-point.size;
      }
      if(point.y < 0-point.size){
        point.y = height+point.size;
      }

      tempCtx.drawImage(point.pCan,point.x,point.y);

    }
    metabalize();
    requestAnimationFrame(update);
  }

  function metabalize(){
    var imageData = tempCtx.getImageData(0,0,width,height),
        pix = imageData.data;

    for (var i = 0, n = pix.length; i <n; i += 4) {
      if(pix[i+3]<threshold){
        pix[i+3]/=20;
        // if(pix[i+3]>threshold/4){
        //   pix[i+3] = 0;
        // }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  update();


  window.onresize = function () {
    height = canvas.height = document.body.offsetHeight;
    width = canvas.width = document.body.offsetWidth;
  };
