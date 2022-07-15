(function () {

	function Utilities(){
		// Constructor
	}

	this.Utilities = Utilities;

	Utilities.prototype.getRandomRange = function(_min, _max){   
		return Math.floor(Math.random()*_max+_min)
	}
	
	Utilities.prototype.getDistance = function(a, b){
		return Math.sqrt(((b.globalX + b.width/2)-a.x)*((b.globalX + b.width/2)-a.x)+((b.globalY + b.height/2)-a.y)*((b.globalY + b.height/2)-a.y));
	}
	
	Utilities.prototype.dot = function(a, b)
	{
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	
})();