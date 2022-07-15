/*
 Copyright (c) 2010, Jason Brown
 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.

*/

var global = this;

(function () {

// class variables
	var idCounter = 0;
	
// constructor
    function Level (_x, _y, _imgSrc, _width, _height)
    {
        this.id = idCounter+=1; 
        
		this.x  = _x;
        this.y  = _y;
		
		this.imgSrc = _imgSrc;
		this.mapWidth = _imgSrc.width;
		this.mapHeight = _imgSrc.height;
		
		// Width and height that is displayed
		this.width = _width;
		this.height = _height;
		
		this.time  = 0;
		this.speed = 12;
		this.xSpeed = 0;
		this.ySpeed = 0;
		
		// Controls the maps scrolling. Once it gets to the point where it the edge would show it is locked, this allows the character to move from the middle of the screen to the extreme edge.
		this.lockUp = false;
		this.lockDown = false;
		this.lockLeft = false;
		this.lockRight = false;
    }
    
    global.Level = Level;
    
// public
    Level.prototype.update = function (deltaTime)
    {
		
		if (rightDown == true){
			this.xSpeed = -this.speed;
		}
		
		if (leftDown == true){
			this.xSpeed = this.speed;
		}
		
		if(upDown == true){
			this.ySpeed = this.speed;
		}
		
		if(downDown == true){
			this.ySpeed = -this.speed;
		}
		
		if (this.lockUp === false && this.lockDown === false){
			this.y += this.ySpeed * deltaTime;
		}
		
		if (this.lockRight === false && this.lockLeft === false){
			this.x += this.xSpeed * deltaTime; 
		}
		
		this.xSpeed = 0;		
		this.ySpeed = 0;
		checkBounds.apply(this);
	};
	
	Level.prototype.draw = function(_context){
		_context.save();
		_context.drawImage(this.imgSrc,this.x,this.y);	
		_context.restore();
	}
	
// private
	function checkBounds(){
		if (this.y >= 0){	 
			this.lockUp = true;
		}else{
			this.lockUp = false;
		}
		if (this.y < (this.height - this.mapHeight)){
			this.lockDown = true;
		}else{
			this.lockDown = false;
		}
		if (this.x < (this.width - this.mapWidth)){
			this.lockRight = true;
		}else{
			this.lockRight = false;
		}
		if (this.x > 0){
			this.lockLeft = true;
		}else{
			this.lockLeft = false;
		}
	}
	
})();