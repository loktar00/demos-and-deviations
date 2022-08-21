(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();

  var canvas = document.getElementById('game');
  var context = canvas.getContext('2d');

  canvas.width = canvas.height = 500;

  var gameReady = true;
  var players = [];
  var posX = 350;
  var posY = 200;
  var newX = 350;
  var newY = 200;

  // new vars needed for movement
  var velX = 0;
  var velY = 0;
  var speed = 5;

  function movePlayer() {

    var tx = newX - posX,
      ty = newY - posY,
      dist = Math.sqrt(tx * tx + ty * ty);

    if (dist >= speed) {
      velX = (tx / dist) * speed;
      velY = (ty / dist) * speed;
      posX += velX;
      posY += velY;
    }
  }

  function isGameReady() {
    if (gameReady) {
      drawCanvas();
    } else {
      setTimeout(isGameReady, 100);
    }
  }

  canvas.onmousedown = function (e) {
    newX = e.offsetX; // -33;
    newY = e.offsetY; // - 55.25;
  }


  function drawCanvas() {
    movePlayer();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(posX, posY, 10, 10);
    requestAnimationFrame(drawCanvas);
  }

  isGameReady();