(function () {
	
	function Renderer(canvas){
		this._renderItems  = [];
		this.init(canvas);
	}

	this.Renderer = Renderer;

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
		// for ze blur
		this._context.fillStyle = "rgba(0,0,0,0.2)"
		this._context.fillRect(0,0,this._width,this._height);
		
		for (id =0; id < this._renderItems.length; id++) {
			var curObject = this._renderItems[id];	
			curObject.draw(this._context);
		}
    }

})();