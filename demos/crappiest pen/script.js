'use strict';
var canvas = document.querySelector('canvas'),
     ctx = canvas.getContext('2d'),
     width = 450,
     height = 400,
     crap = {
         x: width / 2,
         y: height / 2,
         angleX: 1,
         angleY: 1,
         height: 0,
         rad: 150
     };

 canvas.width = width;
 canvas.height = height;

 ctx.strokeStyle = "rgb(255,255,255)";
 ctx.fillStyle = "rgba(255,0,0,1)";

 ctx.shadowColor = 'rgba(25,14,0,0.6)';
 ctx.shadowBlur = 4;
 ctx.shadowOffsetX = 2;
 ctx.shadowOffsetY = 2;
 ctx.fillStyle = "rgb(139,69,14)";

 function render() {
     crap.height += 0.8;
     if (crap.rad - crap.height > 0) {
         ctx.beginPath();
         ctx.arc(crap.x += Math.cos(crap.angleX += 0.08+(Math.random()*0.1)),
         crap.y += Math.sin(crap.angleY += 0.08),
         crap.rad - crap.height, 0, Math.PI * 2);
         ctx.fill();
         requestAnimationFrame(render);
     }
 }

 render();