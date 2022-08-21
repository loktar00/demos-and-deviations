var points = [],
    ranPoints = [],
    canvas = document.getElementById("canvas"),
	  ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	function draw(){
		var imageData = ctx.createImageData(canvas.width, canvas.height),
			  maxDist = 0,
			  width = 512,
			  height = 256,
			  pSize = 1,
			  rSet = Math.random()*255,
			  gSet = Math.random()*255,
			  bSet = Math.random()*255,
			  numPoints = 25,
			  colSize = Math.ceil(window.innerWidth / width) * width,
			  rowSize = Math.ceil(window.innerHeight / height) * height;

		// create random points
		for(var i = 0; i < 25; i++){
			var tempPoints = [];
				  tempPoints.x = Math.round(Math.random()* width),
				  tempPoints.y = Math.round(Math.random()* height);

				tempPoints.angle = Math.random()*360;
				ranPoints.push(tempPoints);
		}
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
					var xDist = Math.abs(ranPoints[p].x - x),
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

				for(p=0; p < pLen; p++){
					if(p !== firstPoint){
						var xDist = Math.abs(ranPoints[p].x - x),
						  yDist = Math.abs(ranPoints[p].y - y);

						// for seamless tiling
						if (xDist > width / 2){ xDist = width - xDist};
						if (yDist > height / 2){ yDist = height - yDist};

						dist2 = Math.sqrt(xDist * xDist + yDist * yDist);

						if(dist2 < curMinDist2){
							curMinDist2 = dist2;
						}
					}
				}

				points[y * width + x] = Math.sqrt((curMinDist2 - curMinDist));
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

		// Draw points
		for(var x = 0; x < width; x += pSize){
			for(var y = 0; y < height; y += pSize){
				for(var pix = 0; pix < pSize; pix++){
					for(var piy = 0; piy < pSize; piy++){
						i = ((x + pix) + (y + piy) * imageData.width) * 4;
						imageData.data[i+0] = parseInt(points[y * width + x] * (rSet/maxDist));
						imageData.data[i+1] = parseInt(points[y * width + x] * (gSet/maxDist));
						imageData.data[i+2] = parseInt(points[y * width + x] * (bSet/maxDist));
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
	}

draw();