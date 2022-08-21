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
	
	function Renderer(canvas){
		this._renderItems  = [];
		this.init(canvas);
	}

	global.Renderer = Renderer;

	Renderer.prototype.init = function (canvas)
	{
		this._canvas    = canvas;
		this._context   = this._canvas.getContext("2d");
		this._width     = this._canvas.width;
		this._height    = this._canvas.height;
	};

	Renderer.prototype.redraw = function ()
	{
		draw.apply(this);
	};
    
	Renderer.prototype.addToRenderer = function (object)
    {
        this._renderItems.push(object);
    };
	
	Renderer.prototype.removeFromRenderer = function (object)
    {
		for (var id in this._renderItems) {
			if(this._renderItems[id] === object){
				this._renderItems.splice(id,1);
			}
		}
    };
	
// private
    function draw ()
    {	
		var id = 0;
		
		for (id = 0; id <= this._renderItems.length - 1; id+=1) {
			var curObject = this._renderItems[id];	
			curObject.draw(this._context);
		}
		
		currentLevel.drawOverLay(this._context);
    }

})();