Filters = {};
	Filters.getPixels = function(img) {
	  var c,ctx;
	  if (img.getContext) {
		c = img;
		try { ctx = c.getContext('2d'); } catch(e) {}
	  }
	  if (!ctx) {
		c = this.getCanvas(img.width, img.height);
		ctx = c.getContext('2d');
		ctx.drawImage(img, 0, 0);
	  }
	  return ctx.getImageData(0,0,c.width,c.height);
	};

	Filters.getCanvas = function(w,h) {
	  var c = document.createElement('canvas');
	  c.width = w;
	  c.height = h;
	  return c;
	};

	Filters.filterImage = function(filter, image, var_args) {
	  var args = [this.getPixels(image)];
	  for (var i=2; i<arguments.length; i++) {
		args.push(arguments[i]);
	  }
	  return filter.apply(null, args);
	};

	Filters.grayscale = function(pixels, args) {
	  var d = pixels.data;
	  for (var i=0; i<d.length; i+=4) {
		var r = d[i];
		var g = d[i+1];
		var b = d[i+2];
		// CIE luminance for the RGB
		var v = 0.2126*r + 0.7152*g + 0.0722*b;
		d[i] = d[i+1] = d[i+2] = v
	  }
	  return pixels;
	};

	Filters.brightness = function(pixels, adjustment) {
	  var d = pixels.data;
	  for (var i=0; i<d.length; i+=4) {
		d[i] += adjustment;
		d[i+1] += adjustment;
		d[i+2] += adjustment;
	  }
	  return pixels;
	};

	Filters.threshold = function(pixels, threshold) {
	  var d = pixels.data;
	  for (var i=0; i<d.length; i+=4) {
		var r = d[i];
		var g = d[i+1];
		var b = d[i+2];
		var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
		d[i] = d[i+1] = d[i+2] = v
	  }
	  return pixels;
	};

	Filters.glow = function(pixels, passes, image, glowPasses){
		for(var i=0; i < passes; i++){	
			pixels = Filters.convolute(pixels, 
				[1/9,  1/9,  1/9,
				1/9,  1/9,  1/9,
				1/9,  1/9,  1/9 ]);
		}
		
		var tempCanvas = document.createElement("canvas"),
			glowCanvas = document.createElement("canvas"),
			tCtx = tempCanvas.getContext("2d"),
			gCtx = glowCanvas.getContext("2d");
		
		tempCanvas.width = glowCanvas.width = pixels.width;
		tempCanvas.height = tempCanvas.height = pixels.height;
		
		tCtx.putImageData(pixels, 0, 0);
		gCtx.drawImage(image, 0, 0);

		gCtx.globalCompositeOperation = "lighter";

		for(i = 0; i < glowPasses; i++){
			gCtx.drawImage(tempCanvas,0,0);
		}
		
		return Filters.getPixels(glowCanvas);
	}
	
	Filters.tmpCanvas = document.createElement('canvas');
	Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

	Filters.createImageData = function(w,h) {
	  return this.tmpCtx.createImageData(w,h);
	};

	Filters.convolute = function(pixels, weights, opaque) {
	  var side = Math.round(Math.sqrt(weights.length));
	  var halfSide = Math.floor(side/2);

	  var src = pixels.data;
	  var sw = pixels.width;
	  var sh = pixels.height;

	  var w = sw;
	  var h = sh;
	  var output = Filters.createImageData(w, h);
	  var dst = output.data;

	  var alphaFac = opaque ? 1 : 0;

	  for (var y=0; y<h; y++) {
		for (var x=0; x<w; x++) {
		  var sy = y;
		  var sx = x;
		  var dstOff = (y*w+x)*4;
		  var r=0, g=0, b=0, a=0;
		  for (var cy=0; cy<side; cy++) {
			for (var cx=0; cx<side; cx++) {
			  var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
			  var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
			  var srcOff = (scy*sw+scx)*4;
			  var wt = weights[cy*side+cx];
			  r += src[srcOff] * wt;
			  g += src[srcOff+1] * wt;
			  b += src[srcOff+2] * wt;
			  a += src[srcOff+3] * wt;
			}
		  }
		  dst[dstOff] = r;
		  dst[dstOff+1] = g;
		  dst[dstOff+2] = b;
		  dst[dstOff+3] = a + alphaFac*(255-a);
		}
	  }
	  return output;
	};

	if (!window.Float32Array)
	  Float32Array = Array;

	Filters.convoluteFloat32 = function(pixels, weights, opaque) {
	  var side = Math.round(Math.sqrt(weights.length));
	  var halfSide = Math.floor(side/2);

	  var src = pixels.data;
	  var sw = pixels.width;
	  var sh = pixels.height;

	  var w = sw;
	  var h = sh;
	  var output = {
		width: w, height: h, data: new Float32Array(w*h*4)
	  };
	  var dst = output.data;

	  var alphaFac = opaque ? 1 : 0;

	  for (var y=0; y<h; y++) {
		for (var x=0; x<w; x++) {
		  var sy = y;
		  var sx = x;
		  var dstOff = (y*w+x)*4;
		  var r=0, g=0, b=0, a=0;
		  for (var cy=0; cy<side; cy++) {
			for (var cx=0; cx<side; cx++) {
			  var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
			  var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
			  var srcOff = (scy*sw+scx)*4;
			  var wt = weights[cy*side+cx];
			  r += src[srcOff] * wt;
			  g += src[srcOff+1] * wt;
			  b += src[srcOff+2] * wt;
			  a += src[srcOff+3] * wt;
			}
		  }
		  dst[dstOff] = r;
		  dst[dstOff+1] = g;
		  dst[dstOff+2] = b;
		  dst[dstOff+3] = a + alphaFac*(255-a);
		}
	  }
	  return output;
};
		
		
var glowImage = document.images[1],
	glowMask = document.images[0],
	c = document.getElementById("canvas"),
	ctx = c.getContext("2d");

window.onload = function() {
	var pData = Filters.filterImage(Filters.glow, glowImage, 5, glowMask, 2);
	c.width = pData.width;
	c.height = pData.height;
	ctx.putImageData(pData, 0, 0);
}