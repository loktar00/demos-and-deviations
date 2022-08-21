(function () {

	function Utilities(){
		// Constructor
	}

	this.Utilities = Utilities;

	Utilities.prototype.getRandomRange = function(_min, _max){   
		return Math.random()*_max+_min
	}
	
	Utilities.prototype.getDistance = function(a, b){
		return Math.sqrt(((b.globalX + b.width/2)-a.x)*((b.globalX + b.width/2)-a.x)+((b.globalY + b.height/2)-a.y)*((b.globalY + b.height/2)-a.y));
	}
	
	Utilities.prototype.dot = function(a, b)
	{
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	
	// http://binnyva.blogspot.com/2006/01/javascript-functions-for-converting.html
	Utilities.prototype.hex2num = function(hex) {
		if(hex.charAt(0) == "#"){
			hex = hex.slice(1); //Remove the '#' char - if there is one.
		}
		
		hex = hex.toUpperCase();
		var hex_alphabets = "0123456789ABCDEF",
			value = [],
			k = 0,
			int1,
			int2;
			
		for(var i=0;i<6;i+=2) {
			int1 = hex_alphabets.indexOf(hex.charAt(i));
			int2 = hex_alphabets.indexOf(hex.charAt(i+1)); 
			value[k] = (int1 * 16) + int2;
			k++;
		}
		
		return(value);
	}
	
	//http://binnyva.blogspot.com/2006/02/color-fade-effect-using-javascript.html
	Utilities.prototype.fadeColor =function(start_hex,stop_hex,step) {
		var start = this.hex2num(start_hex),
			stop = this.hex2num(stop_hex),
			colorArr = [];
			
		for(var i=0;i<3;i++) {
			start[i] = Number(start[i]);
			stop[i] = Number(stop[i]);
		}

		while(start[0] !== stop[0] || start[1] !== stop[1] || start[2] !== stop[2]){
			for(var i=0;i<3;i++) {
				if (start[i] < stop[i]) {
					start[i] += step;

					if(start[i] > stop[i]){
						start[i] = stop[i];
					}
				}
				else if(start[i] > stop[i]) {
					start[i] -= step;

					if(start[i] < stop[i]){
						start[i] = stop[i];
					}
				}
			}
			var color = start[0]+","+start[1]+","+start[2];
			colorArr.push(color);
		}
		
		return colorArr;
	}
})();