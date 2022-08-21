(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  							  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	  window.requestAnimationFrame = requestAnimationFrame;
})();


var points = [],
  ranPoints = [],
  canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
	width = 128,
	height = 128,
	numPoints = 50,
  cycle = 0,
  colors = {r:0, g:0, b:0};

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// create random points
	for(var i = 0; i < numPoints; i++){
		var tempPoints = [];
			tempPoints.x = Math.round(Math.random()* width),
			tempPoints.y = Math.round(Math.random()* height);

			tempPoints.angle = Math.random()*360;
			ranPoints.push(tempPoints);
	}

	function draw(){
		var imageData = ctx.createImageData(canvas.width, canvas.height),
			maxDist = 0,
			pSize = 2,
			colSize = Math.ceil(window.innerWidth / width) * width,
			rowSize = Math.ceil(window.innerHeight / height) * height;


		// Check distance with all other points
		for(var x = 0; x < width; x+=pSize){
			for(var y = 0; y < height; y+=pSize){
				var pLen = ranPoints.length,
					p = 0,
					dist = 0,
					dist2 = 0,
					firstPoint = 0,
					curMinDist = width * height;

				for(p=0; p < pLen; p++){
					xDist = Math.abs(ranPoints[p].x - x);
					yDist = Math.abs(ranPoints[p].y - y);

					// for seamless tiling
					if (xDist > width / 2){ xDist = width - xDist};
					if (yDist > height / 2){ yDist = height - yDist};
					dist = Math.sqrt(xDist * xDist + yDist * yDist);

					if(dist < curMinDist){
						firstPoint = p;
						curMinDist = dist;
					}
				}
				var curMinDist2 = canvas.width * canvas.height;

				points[y * width + x] = Math.sqrt((curMinDist));
			}
		}

		// Get max val to scale colors.
		for(var x = 0; x < width; x+=pSize){
			for(var y = 0; y < height; y+=pSize){
				if(parseInt(points[y * width + x]) > maxDist){
					maxDist = parseInt(points[y * width + x]);
				}
			}
		}
		maxDist = width/(numPoints/2);
		// Draw points
		for(var x = 0; x < width; x += pSize){
			for(var y = 0; y < height; y += pSize){
				for(var pix = 0; pix < pSize; pix++){
					for(var piy = 0; piy < pSize; piy++){
						i = ((x + pix) + (y + piy) * imageData.width) * 4;
						imageData.data[i+0] = parseInt(points[y * width + x] * (colors.r/maxDist));
						imageData.data[i+1] = parseInt(points[y * width + x] * (colors.g/maxDist));
						imageData.data[i+2] = parseInt(points[y * width + x] * (colors.b/maxDist));
						imageData.data[i+3] = 255;

					}
				}
			}
		}
		ctx.putImageData(imageData, 0, 0);
		var imageData = ctx.getImageData(0,0,width, height);

		// copy the data across the canvas
		for(var x = 0; x < colSize; x+=width){
			for(var y = 0; y < rowSize; y+=height){
				ctx.putImageData(imageData,x,y);
			}
		}

    colorCycle();
	}

	function animate(){
		var pLen = ranPoints.length,
			p = 0,
			offset = 1;

		for(p=0; p < pLen; p++){
			ranPoints[p].angle+= .2;
			ranPoints[p].x+=Math.sin(ranPoints[p].angle)*2;
			ranPoints[p].y+=Math.sin(ranPoints[p].angle)*2;

			if(ranPoints[p].x > width+offset){
				ranPoints[p].x = -offset;
			}else if(ranPoints[p].x < -offset){
				ranPoints[p].x = width + offset;
			}

			if(ranPoints[p].y > height+offset){
				ranPoints[p].y = -offset;
			}else if(ranPoints[p].y < -offset){
				ranPoints[p].y = height + offset;
			}
		}

		draw();
		requestAnimationFrame(animate);
	}

  function colorCycle(){
			cycle+=0.1;

			if(cycle>100){
				cycle = 0;
			}
		  colors.r = ~~(Math.sin(.3*cycle + 0) * 127+ 128);
			colors.g =  ~~(Math.sin(.3*cycle + 2) * 127+ 128);
			colors.b = ~~( Math.sin(.3*cycle + 4) * 127+ 128);
	}


animate();