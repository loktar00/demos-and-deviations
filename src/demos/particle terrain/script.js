window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();


var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = window.innerWidth,
    height = document.body.offsetHeight,
    vanishPointY = height / 2,
    vanishPointX = width / 2,
    focalLength = 500,
    angle = 0,
    angleY = 0,
    angleX = 0,
    angleZ = 0,
    mouseX = 0,
    mouseY = 0;

canvas.width = width;
canvas.height = height;

var settings = {
	roughness : 5,
	mouseRotation : true,
	xRotation : 0,
	yRotation : 0,
	zRotation : 0
}

function Terrain(options){
	this.map = [];
	this.mapDimension = 128;
	options = options || {};

	this.roughness = options.roughness || 10;

	for (var x = 0; x < this.mapDimension + 1; x++) {
	    for (var y = 0; y < this.mapDimension + 1; y++) {
	        this.map[x] = [];
	    }
	}

	// seed
	var x = mapDimension,
		y = mapDimension,
		mapDimension = this.mapDimension,
		tr, tl, t, br, bl, b, r, l, center;

	this.map[0][0] = Math.random();
    tl = this.map[0][0];

	this.map[0][mapDimension] = Math.random();
	bl = this.map[0][mapDimension];

	this.map[mapDimension][0] = Math.random();
	tr = this.map[mapDimension][0];

	this.map[mapDimension][mapDimension] = Math.random();
	br = this.map[mapDimension][mapDimension]

	// Center
	this.map[mapDimension / 2][mapDimension / 2] = this.map[0][0] + this.map[0][mapDimension] + this.map[mapDimension][0] + this.map[mapDimension][mapDimension] / 4;
	this.map[mapDimension / 2][mapDimension / 2] = this.normalize(this.map[mapDimension / 2][mapDimension / 2]);
	center = this.map[mapDimension / 2][mapDimension / 2];

	this.map[mapDimension / 2][mapDimension] = bl + br + center / 3;
	this.map[mapDimension / 2][0] = tl + tr + center / 3;
	this.map[mapDimension][mapDimension / 2] = tr + br + center / 3;
	this.map[0][mapDimension / 2] = tl + bl + center / 3;

	this.displacment(mapDimension);

}

Terrain.prototype.displacment = function(dim){
	var newDimension = dim / 2,
		top, topRight, topLeft, bottom, bottomLeft, bottomRight, right, left, center,
		i, j,
		map = this.map,
		mapDimension = this.mapDimension;

	    if (newDimension > 1) {
	        for (i = newDimension; i <= mapDimension; i += newDimension) {
	            for (j = newDimension; j <= mapDimension; j += newDimension) {
	                x = i - (newDimension / 2);
	                y = j - (newDimension / 2);

	                topLeft = map[i - newDimension][j - newDimension];
	                topRight = map[i][j - newDimension];
	                bottomLeft = map[i - newDimension][j];
	                bottomRight = map[i][j];

	                // Center
	                map[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + this.displace(dim);
	                map[x][y] = this.normalize(map[x][y]);
	                center = map[x][y];

	                // Top
	                if (j - (newDimension * 2) + (newDimension / 2) > 0) {
	                    map[x][j - newDimension] = (topLeft + topRight + center + map[x][j - dim + (newDimension / 2)]) / 4 + this.displace(dim);;
	                } else {
	                    map[x][j - newDimension] = (topLeft + topRight + center) / 3 + this.displace(dim);
	                }

	                map[x][j - newDimension] = this.normalize(map[x][j - newDimension]);

	                // Bottom
	                if (j + (newDimension / 2) < mapDimension) {
	                    map[x][j] = (bottomLeft + bottomRight + center + map[x][j + (newDimension / 2)]) / 4 + this.displace(dim);
	                } else {
	                    map[x][j] = (bottomLeft + bottomRight + center) / 3 + this.displace(dim);
	                }

	                map[x][j] = this.normalize(map[x][j]);


	                //Right
	                if (i + (newDimension / 2) < mapDimension) {
	                    map[i][y] = (topRight + bottomRight + center + map[i + (newDimension / 2)][y]) / 4 + this.displace(dim);
	                } else {
	                    map[i][y] = (topRight + bottomRight + center) / 3 + this.displace(dim);
	                }

	                map[i][y] = this.normalize(map[i][y]);

	                // Left
	                if (i - (newDimension * 2) + (newDimension / 2) > 0) {
	                    map[i - newDimension][y] = (topLeft + bottomLeft + center + map[i - dim + (newDimension / 2)][y]) / 4 + this.displace(dim);;
	                } else {
	                    map[i - newDimension][y] = (topLeft + bottomLeft + center) / 3 + this.displace(dim);
	                }

	                map[i - newDimension][y] = this.normalize(map[i - newDimension][y]);
	            }
	        }
	        this.displacment(newDimension);
	    }
	}

	Terrain.prototype.displace = function(num){
	    var max = num / (this.mapDimension + this.mapDimension) * this.roughness;
	    return (Math.random() - 0.5) * max;
	}

	Terrain.prototype.normalize = function(val){
	    if (val > 1) {
	        val = 1;
	    } else if (val < 0) {
	        val = 0;
	    }
	    return val;
	}

	/*
	 *	Controls the emitter
	 */
	function Emitter() {
	    var terrain = new Terrain(settings);
	    this.particles = [];
        var gamma = 500,
        	mapDimension = terrain.mapDimension,
        	map = terrain.map;

    // colormap colors
    var waterStart={r:39,g:50,b:63},
        waterEnd={r:10,g:20,b:40},
        sandStart={r:98,g:105,b:83},
        sandEnd={r:189,g:189,b:144},
        grassStart={r:67,g:100,b:18},
        grassEnd={r:22,g:38,b:3},
        mtnEnd={r:67,g:80,b:18},
        mtnStart={r:60,g:56,b:31},
        rockStart={r:130,g:130,b:130},
        rockEnd={r:90,g:90,b:90},
        snowStart={r:200,g:200,b:200},
        snowEnd={r:255,g:255,b:255};

	    for (x = 0; x <= mapDimension; x++) {
	        for (y = 0; y <= mapDimension; y++) {

				// plasma coloring

            var  data = map[x][y];
            if (data >= 0 && data <= 0.3) {
              colorFill = fade(waterStart, waterEnd, 30, parseInt(data * 100, 10));
            } else if (data > 0.3 && data <= 0.35) {
              colorFill = fade(sandStart, sandEnd, 5, parseInt(data * 100, 10) - 30);
            } else if (data > 0.35 && data <= 0.8) {
              colorFill = fade(grassStart, grassEnd, 45, parseInt(data * 100, 10) - 35);
            } else if (data > 0.8 && data <= 0.95) {
              colorFill = fade(mtnStart, mtnEnd, 15, parseInt(data * 100, 10) - 80);
            } else if (data > 0.95 && data <= 1) {
              colorFill = fade(rockStart, rockEnd, 5, parseInt(data * 100, 10) - 98);
            }

            this.particles.push(new Particle(-256 + (x * 4), -128 + (y * 4), 0 + (map[x][y] * 60), colorFill.r, colorFill.g, colorFill.b));
	        }
	    }
	}

	Emitter.prototype.update = function () {
	    var partLen = this.particles.length;

		if(settings.mouseRotation){
			angleX = (mouseY  - vanishPointY) * 0.00005;
			angleY = (mouseX  - vanishPointX) * 0.00005;
		}else{
			angleX = settings.xRotation * 0.001;
			angleY = settings.yRotation * 0.001;
			angleZ = settings.zRotation * 0.001;
		}


		this.particles.sort(function(a,b){
			return b.z - a.z;
		})
	    for (var i = 0; i < partLen; i++) {
	        var particle = this.particles[i];
	        particle.update();
	    }
	}

	Emitter.prototype.render = function () {
	    var imgData = ctx.createImageData(width, height),
	        data = imgData.data,
	        partLen = this.particles.length;

	    for (var i = 0; i < partLen; i++) {
	        var particle = this.particles[i];
       if(particle.visible && particle.xPos < width && particle.xPos > 0 &&
								particle.yPos > 0 && particle.yPos < height){
	          for (var w = 0; w < particle.size; w++) {
	              for (var h = 0; h < particle.size; h++) {
                 if(particle.xPos+w < width && particle.xPos+w > 0 &&
											          particle.yPos+h > 0 && particle.yPos+h < height){
                        pData = (~~ (particle.xPos + w) + (~~ (particle.yPos + h) * width)) * 4;
                        data[pData] = particle.r;
                        data[pData + 1] = particle.g;
                        data[pData + 2] = particle.b;
                        data[pData + 3] = 255;
                 }
	            }
           }
        }

	    }

	    ctx.putImageData(imgData, 0, 0);
	}


	/*
	 *	Controls the individual particles
	 */
	function Particle(x, y, z, r, g, b) {
	    this.x = x;
	    this.y = y;
	    this.z = z;

        this.r = r;
        this.g = g;
        this.b = b;

	    this.xPos = 0;
	    this.yPos = 0;

	    this.size = 0;
	}

	Particle.prototype.update = function () {
		var x = this.x * Math.cos(angleZ) - this.y * Math.sin(angleZ),
			y = this.y * Math.cos(angleZ) + this.x * Math.sin(angleZ);

		this.x = x;
		this.y = y;

		var cosY = Math.cos(angleY),
			sinY = Math.sin(angleY),
			x = this.x * cosY - this.z * sinY,
			z = this.z * cosY + this.x * sinY;

		this.x = x;
		this.z = z;

		var cosX = Math.cos(angleX),
			sinX = Math.sin(angleX);

		y = this.y * cosX - this.z * sinX,
		z = this.z * cosX + this.y * sinX;

		  this.y = y;
		  this.z = z;
    this.visible = false;
	   if (this.z > -focalLength) {
	        var scale = focalLength / (focalLength + this.z);

	        this.size = scale*2;
	        this.xPos = vanishPointX + this.x * scale;
	        this.yPos = vanishPointY + this.y * scale;
         this.visible = true;
	    }
	}

  // utility for color interpolation
  function fade(colorStart, colorEnd, totalSteps, step) {
    var rStart = colorStart.r,
        rEnd = colorEnd.r,
        gStart = colorStart.g,
        gEnd = colorEnd.g,
        bStart = colorStart.b,
        bEnd = colorEnd.b,
        r = rEnd + (~~ ((rStart - rEnd) / totalSteps) * step),
        g = gEnd + (~~ ((gStart - gEnd) / totalSteps) * step),
        b = bEnd + (~~ ((bStart - bEnd) / totalSteps) * step);

    return {
      r: r,
      g: g,
      b: b
    };
  }

	function render() {
	    emitter.update();
	    emitter.render();
	    requestAnimFrame(render);
	}

	var emitter = new Emitter();
	render();

	document.body.addEventListener("mousemove", function(e){
		mouseX = e.clientX;
		mouseY = e.clientY;
	});


window.onresize = function () {
  height = canvas.height = document.body.offsetHeight;
  width = canvas.width = document.body.offsetWidth;
};

	var gui = new dat.GUI();
	gui.add(settings, 'roughness').onFinishChange(function(){
		emitter = new Emitter();
	});

	gui.add(settings, 'mouseRotation');
	gui.add(settings, 'xRotation', 0, 50);
	gui.add(settings, 'yRotation', 0, 50);
	gui.add(settings, 'zRotation', 0, 50);