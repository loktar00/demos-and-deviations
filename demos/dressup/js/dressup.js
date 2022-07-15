// More IE bullcrap.
if ( !window.Element )
{
        Element = function(){}
        var __createElement = document.createElement;
        document.createElement = function(tagName)
        {
                var element = __createElement(tagName);
                for(var key in Element.prototype)
                        element[key] = Element.prototype[key];
                return element;
        }
        var __getElementById = document.getElementById
        document.getElementById = function(id)
        {
                var element = __getElementById(id);
                for(var key in Element.prototype)
                        element[key] = Element.prototype[key];
                return element;
        }
}

/*
	main pool of items, each has a type they can be placed on, the image for them, and a value. 
	Values must be unique per type.
*/

var itemPool = [
	{type:"mask", image : "mask-1.png", value : 1},
	{type:"mask", image : "mask-2.png", value : 2},
	{type:"mask", image : "mask-3.png", value : 3},
	{type:"mask", image : "mask-4.png", value : 4},
	{type:"mask", image : "mask-5.png", value : 5},
	{type:"mask", image : "mask-6.png", value : 6},
	{type:"mask", image : "mask-7.png", value : 7},
	{type:"gloves", image : "gloves-1.png", value : 1},
	{type:"gloves", image : "gloves-2.png", value : 2},
	{type:"gloves", image : "gloves-3.png", value : 3},
	{type:"boots", image : "boots-1.png", value : 1},
	{type:"boots", image : "boots-2.png", value : 2},
	{type:"boots", image : "boots-3.png", value : 3},
	{type:"boots", image : "boots-4.png", value : 4},
	{type:"boots", image : "boots-5.png", value : 5},
	{type:"suit", image : "suit-1.png", value : 1},
	{type:"suit", image : "suit-2.png", value : 2},
	{type:"suit", image : "suit-3.png", value : 3},
	{type:"suit", image : "suit-4.png", value : 4},
	{type:"suit", image : "suit-5.png", value : 5}
];


var scenarios =[
				{
					"mask" : [{value : 1, safety : 2, effect : 2},{value : 2, safety : 2, effect : 1}, {value : 3, safety : 1, effect : 1}, {value : 4, safety : -5, effect : -10}, {value : 5, safety : -5, effect : -10}, {value : 6, safety : 10, effect : 10}, {value : 7, safety : 5, effect : -5}], 
					"suit" : [{value : 1, safety : 10, effect : 10},{value : 2, safety : -80, effect : -80}, {value : 3, safety : -5, effect : -40}, {value : 5, safety : -5, effect : -40}], 
					"gloves" : [{value : 1, safety : -20, effect : -20},{value : 3, safety : 5, effect : 5},{value : 2, safety : 5, effect : 5}], 
					"boots" : [{value : 5, safety : 5, effect : 5},{value : 4, safety : 4, effect : 4}, {value : 1, safety : -5, effect : 5},{value : 2, safety : -5, effect : -5},{value : 3, safety : -5, effect : -5}],
					"scoring" : {"mask" : 20, "suit" : 20, "gloves" : 20, "boots" : 10, "time" : 20},
					"text" : "You are on your way to a contaminated area. All the info we've been given is that there is an unknown agent in the air. Good luck!",
					"background" : "bga.png",
					"title" : "Unknown Agent"
				},
				{
					"mask" : [{value : 1, safety : 10, effect : 10},{value : 2, safety : 2, effect : 1}, {value : 3, safety : 5, effect : 5}, {value : 4, safety : 10, effect : -30}, {value : 5, safety : 10, effect : -50}, {value : 6, safety : 10, effect : -60}, {value : 7, safety : 5, effect : -5}], 
					"suit" : [{value : 1, safety : 10, effect : -60},{value : 2, safety : 10, effect : 10}, {value : 3, safety : 10, effect : -40}, {value : 5, safety : 10, effect : -40}], 
					"gloves" : [{value : 1, safety : 5, effect : 10},{value : 2, safety : 1, effect : 5}, {value : 3, safety : 10, effect : -20}], 
					"boots" : [{value : 1, safety : 5, effect : 5},{value : 2, safety : 5, effect : 8},{value : 3, safety : -20, effect : 10},{value : 4, safety : 10, effect : -40}, {value : 5, safety : 10, effect : 10}],
					"scoring" : {"mask" : 30, "suit" : 20, "gloves" : 15, "boots" : 20, "time" : 20},
					"text" : "A major exercise has just taken place and you have been put in charge of cleaning it. They hand you a broom",
					"background" : "bgd.png",
					"title" : "Exercise Cleanup"
				},
				{
					"mask" : [{value : 1, safety : -10, effect : 5},{value : 2, safety : -20, effect : -20}, {value : 3, safety : -5, effect : -5}, {value : 4, safety : 10, effect : 10}, {value : 5, safety : 10, effect : 10}, {value : 6, safety : 20, effect : -10}, {value : 7, safety : 5, effect : 5}], 
					"suit" : [{value : 1, safety : 10, effect : -20},{value : 2, safety : -20, effect : -20}, {value : 3, safety : 10, effect : 10}, {value : 5, safety : 10, effect : 10}], 
					"gloves" : [{value : 1, safety : -10, effect : 10},{value : 2, safety : 1, effect : 3}, {value : 3, safety : 10, effect : 10}], 
					"boots" : [{value : 1, safety : 10, effect : 10},{value : 2, safety : -10, effect : 5},{value : 3, safety : -20, effect : 5},{value : 4, safety : 20, effect : -40}, {value : 5, safety : 10, effect : 10}],
					"scoring" : {"mask" : 30, "suit" : 20, "gloves" : 24, "boots" : 20, "time" : 10},
					"text" : "You have just been called in to retrieve special documents from a warehouse. The warehouse contains radioactive material and debris.",
					"background" : "bgc.png",
					"title" : "Radioactive Material"
				},
				{
					"mask" : [{value : 1, safety : 2, effect : 2},{value : 2, safety : 2, effect : 1}, {value : 3, safety : 1, effect : 1}, {value : 4, safety : -5, effect : -10}, {value : 5, safety : -5, effect : -10}, {value : 6, safety : 10, effect : 10}, {value : 7, safety : 5, effect : -5}], 
					"suit" : [{value : 1, safety : 10, effect : -60},{value : 2, safety : -60, effect : 10}, {value : 3, safety : 10, effect : 10}, {value : 5, safety : 10, effect : 10}], 
					"gloves" : [{value : 1, safety : -10, effect : 10},{value : 2, safety : 1, effect : 3}, {value : 3, safety : 10, effect : 10}], 
					"boots" : [{value : 1, safety : 10, effect : 10},{value : 2, safety : -10, effect : 5},{value : 3, safety : -20, effect : 5},{value : 4, safety : 20, effect : -40}, {value : 5, safety : 10, effect : 10}],
					"scoring" : {"mask" : 30, "suit" : 20, "gloves" : 24, "boots" : 20, "time" : 10},
					"text" : "You have been called in to search a 3 level warehouse. Initial reports are that the warehouse is clear of personnel and tests conducted show signs of cyanide gas. Your HQ wants you to explooit the warehouse to the best of your ability and a decon/resupply team will be standing by to assist.",
					"background" : "bgb.png",
					"title" : "Gas Attack"
				}
			];

(function(){
	function Dressup(){
		// init
		this.gameContainer = document.getElementById("game-container");
		this.setupMenu();
		//this.setup();
	}
	
	this.Dressup = Dressup;

	// initial setup
	Dressup.prototype.setup = function(scenario){
		var docFrag = document.createDocumentFragment();
		
		//saves for restarting
		this.scenarioNumber = scenario;
		this.currentScenario = scenarios[scenario];
		
		// init
		this.gameArea = document.createElement("div");
		this.playArea = document.createElement("div");
		this.sortArea =  document.createElement("div");
		this.timer = document.createElement("div");
		this.timerBar = document.createElement("div");
				
		this.gameArea.setAttribute("id", "game");
		this.playArea.setAttribute("id", "play-area");
		this.sortArea.setAttribute("id", "sort-area");
		this.timer.setAttribute("id", "timer-container");
		this.timerBar.setAttribute("id", "timer-bar");
		
		this.gameContainer.appendChild(this.gameArea);
		this.gameArea.appendChild(this.playArea);
		this.gameArea.appendChild(this.sortArea);
		this.playArea.appendChild(this.timer);
		this.timer.appendChild(this.timerBar);
		
		this.sortNav = document.createElement("div");
		this.sortArea.appendChild(this.sortNav);
		this.sortNav.setAttribute("id", "sort-nav");
		
		// tabs
		this.tabSuit = document.createElement("button");
		text(this.tabSuit, "Suits");
		
		this.tabHead = document.createElement("button");
		text(this.tabHead, "Head");
		
		this.tabGloves = document.createElement("button");
		text(this.tabGloves, "Gloves");
		
		this.tabBoots = document.createElement("button");
		text(this.tabBoots, "Boots");
		
		this.sortNav.appendChild(this.tabSuit);
		this.sortNav.appendChild(this.tabHead);
		this.sortNav.appendChild(this.tabGloves);
		this.sortNav.appendChild(this.tabBoots);
		
		this.playArea.style.background = "url(images/bgs/" + this.currentScenario.background + ")";
		
		document.body.appendChild(this.gameContainer);
		
		var self = this;
		this.gameArea.addEventListener('mousedown', function(event){self.clicked(event,self);}, false);
		this.gameArea.addEventListener('mouseup', function(event){self.placement(event,self);}, false);		
		this.gameArea.addEventListener('mousemove', function(event){self.dragging(event,self);}, false);
		
		// tab events
		this.tabSuit.addEventListener('click', function(event){self.toggle(event,'suit');}, false);
		this.tabHead.addEventListener('click', function(event){self.toggle(event,'mask');}, false);
		this.tabGloves.addEventListener('click', function(event){self.toggle(event,'gloves');}, false);
		this.tabBoots.addEventListener('click', function(event){self.toggle(event,'boots');}, false);
		
		// TODO: add loading of items in the options
		this.itemPool = itemPool.slice(0);
		
		this.dragObj = null;
		this.dragEvent = null;
		
		this.targetParts = [];
		
		// store the items we are going to put onto the character
		this.sortItems = [];
		//var itemPool = this.itemPool;
		docFrag = document.createDocumentFragment();
		
		// go through the item pool
		for(var i = 0, len = this.itemPool.length; i < len; i++){
		
			// todo: account for spaceing of current elements
			var sortItem = document.createElement("div"),
				curItem = Math.floor(Math.random()*this.itemPool.length);

			this.sortItems.push({element : sortItem, type : this.itemPool[curItem].type, value : this.itemPool[curItem].value});
			
			addClass(sortItem, 'sort-item');
			addClass(sortItem, this.itemPool[curItem].type);
			
			sortItem.style.background = "url(images/items/" + this.itemPool[curItem].image + ")";
			this.itemPool.splice(curItem,1);

			docFrag.appendChild(sortItem);
		}
		
		this.sortArea.appendChild(docFrag);
		
		// after they have been added to the dom we can randomly place them
		for(i = 0; i < this.sortItems.length; i++){
			var sortItem = this.sortItems[i].element,
				rect = getOffsetRect(sortItem);
				
			sortItem.style.left = Math.random()*(480-rect.width) + 'px';
			sortItem.style.top =  50 + Math.random()*(550-rect.height) + 'px';
		}
		
		// setup the model and dressable areas
		docFrag = document.createDocumentFragment();
		
		this.modelHead = document.createElement("div");
		//this.modelBody = document.createElement("div");
		this.modelSuit = document.createElement("div");
		this.modelHands = document.createElement("div");
		//this.modelLegs = document.createElement("div");
		this.modelFeet = document.createElement("div");
		this.modelTemplate = document.createElement("div");
		
		this.modelHead.setAttribute("id", 'model-head');
		//this.modelBody.setAttribute("id", 'model-body');
		this.modelSuit.setAttribute("id", 'model-suit');
		this.modelHands.setAttribute("id", 'model-hands');
		//this.modelLegs.setAttribute("id", 'model-legs');
		this.modelFeet.setAttribute("id", 'model-feet');
		
		// setup the button to check our score
		this.checkButton = document.createElement("button");
		this.checkButton.setAttribute("id", 'check-button');
		
		text(this.checkButton, "Check");
		
		this.checkButton.addEventListener('click', function(event){self.score(event,self);}, false);
		
		// modelTemplate is just a graphical represenation and actually does nothing else
		this.modelTemplate.setAttribute("id", "man-template");
		
		docFrag.appendChild(this.modelHead);
		//docFrag.appendChild(this.modelBody);
		docFrag.appendChild(this.modelSuit);
		docFrag.appendChild(this.modelHands);
		//docFrag.appendChild(this.modelLegs);
		docFrag.appendChild(this.modelFeet);
		docFrag.appendChild(this.modelTemplate);
		docFrag.appendChild(this.checkButton);

		// set styles here like images.. or whatever
		this.playArea.appendChild(docFrag);

		// store the coordinates so we can validate the pieces
		/*
			targetParts : each one of these is dressable area on the screen
			type : can be one of any valid types mask/body/gloves/pants/boots 
			width/height/x/y : stores the coordinates for each part
			element : refers to the element that represents the part, which also has the style associated with it to control its hit box
			value : holds the current value of the last item placed on it (Subject to change if we want to support layering)
			curItems : an array that holds each element thats been placed on the model
		*/
		
		var rect = getOffsetRect(this.modelHead);
		this.targetParts.push({type : "mask" , width : rect.width, height : rect.height, x : rect.x, y : rect.y, element : this.modelHead, curItems : []});
		
		//rect = getOffsetRect(this.modelBody);
		//this.targetParts.push({type : "body", width : rect.width, height : rect.height, x : rect.x, y : rect.y, element : this.modelBody, curItems : []});
		
		rect = getOffsetRect(this.modelSuit);
		this.targetParts.push({type : "suit", width : rect.width, height : rect.height, x : rect.x, y : rect.y, element : this.modelSuit, curItems : []});
		
		rect = getOffsetRect(this.modelHands);
		this.targetParts.push({type : "gloves", width : rect.width, height : rect.height, x : rect.x, y : rect.y, element : this.modelHands, curItems : []});
		
		//rect = getOffsetRect(this.modelLegs);
		//this.targetParts.push({type : "pants", width : rect.width, height : rect.height, x : rect.x, y : rect.y, element : this.modelLegs, curItems : []});
		
		rect = getOffsetRect(this.modelFeet);
		this.targetParts.push({type : "boots", width : rect.width, height : rect.height, x : rect.x, y : rect.y, element : this.modelFeet, curItems : []});
		
		// options set round time and scenario
		/*
			dressable area : lets us know what area we are working with
			array of objects within dressable area represents every "correct" item, with its effect score, safety score, and value.
			the value property determines the relationship to the an item in the item pool.
		*/
		
		this.roundTime = 30000;
		this.gameTimeOut = null;
		// start with first tab checked
		self.toggle({},'suit');
		
		this.modal({content : this.currentScenario.text, dialog : {text:"Shall we begin?", callback : function(event, self){
					// init the timer
					self.countDownOverlay = document.createElement("div");
					addClass(self.countDownOverlay,"overlay");
					
					self.countDownElem = document.createElement("div");
					self.countDownElem.setAttribute("id", "countdown");
					self.counter = 4;
					
					text(self.countDownElem, self.counter);
					
					self.gameArea.appendChild(self.countDownOverlay);
					self.gameArea.appendChild(self.countDownElem);
					
					self.countDown();
		}}, noExit : true});
	}
	
	// pre game selection screen select easy hard, etc.
	Dressup.prototype.preGameScreen = function(){
		var self = this,
			docFrag = document.createDocumentFragment(),
			splash = document.createElement("div"),
			easy = document.createElement("div"),
			hard = document.createElement("div"),
			back = document.createElement("div");
			
		splash.setAttribute("id","splash");
		easy.setAttribute("id","easy");
		hard.setAttribute("id","hard");
		back.setAttribute("id","back");
		
		addClass(easy, 'ui-button');
		addClass(hard, 'ui-button');
		addClass(back, 'ui-button');
		
		docFrag.appendChild(splash);
		docFrag.appendChild(easy);
		docFrag.appendChild(hard);
		docFrag.appendChild(back);
		
		this.gameContainer.appendChild(docFrag);
		easy.addEventListener('click', function(event){self.changeLevel(); self.scenerioSelection();}, false);
		hard.addEventListener('click', function(event){self.changeLevel(); self.scenerioSelection();}, false);
		back.addEventListener('click', function(event){self.changeLevel(); self.setupMenu();}, false);
		
	}
	
	// Select the scenario to complete
	Dressup.prototype.scenerioSelection = function(){
		var self = this,
			docFrag = document.createDocumentFragment(),
			splash = document.createElement("div");
		
		splash.setAttribute("id","splash");
		docFrag.appendChild(splash);
		
		// pass scenario to the setup
		var scenarioEvent = function(i){
			return function(event){self.changeLevel(); self.setup(i);}
		};
		
		for(var i = 0; i < scenarios.length; i++){
			scenarioElem = document.createElement("div");
			addClass(scenarioElem, "ui-button scenario");
			scenarioElem.setAttribute("id", "scenario-"+i);
			scenarioElem.style.top = 190 + i*70 + "px";
			text(scenarioElem, scenarios[i].title);
			docFrag.appendChild(scenarioElem);
			scenarioElem.addEventListener('click', scenarioEvent(i));
		}
		
		var back = document.createElement("div");
		addClass(back, 'ui-button');
		back.setAttribute("id","back");
		//back.style.top = (150 + scenarios.length*60) + "px"
		docFrag.appendChild(back);
		back.addEventListener('click', function(event){self.changeLevel(); self.setupMenu();}, false);
		
		this.gameContainer.appendChild(docFrag);
	}
	
	// Setup splash screen area/menu
	Dressup.prototype.setupMenu = function(){
		var self = this,
			docFrag = document.createDocumentFragment(),
			splash = document.createElement("div"),
			newGame = document.createElement("div"),
			info = document.createElement("div");
			
		splash.setAttribute("id","splash");
		newGame.setAttribute("id","newgame");
		info.setAttribute("id","info");
		
		addClass(newGame, 'ui-button');
		addClass(info, 'ui-button');
		
		docFrag.appendChild(splash);
		docFrag.appendChild(newGame);
		docFrag.appendChild(info);
		
		this.gameContainer.appendChild(docFrag);
		newGame.addEventListener('click', function(event){self.changeLevel(); self.scenerioSelection();}, false);
		info.addEventListener('click', function(event){self.modal();}, false);
	}
	
	// setup the information portion, where to get training ect.
	Dressup.prototype.information = function(){
	
	}
	
	// TODO : Add code to switch between levels
	Dressup.prototype.changeLevel = function(){
		this.gameContainer.innerHTML = "";
	}
	
	// Countdown to the start OMGGGG!!11!!?!
	Dressup.prototype.countDown = function(){
		var self = this;
		
		this.counter --;
		
		// display it in the dom.
		
		if(this.counter < 0){
			// remove the counting stuffs.
			self.gameArea.removeChild(self.countDownOverlay);
			self.gameArea.removeChild(self.countDownElem);
			
			// do the normal update shiz
			self.startTime = new Date().getTime();
			self.endTime = self.startTime + self.roundTime;
			self.timeLeft = new Date().getTime() - self.startTime;
			self.update();
		}else{
			// keep on keeping on.
			if(this.counter === 0){
				text(self.countDownElem, "GO!");
			}else{
				text(self.countDownElem, this.counter);
			}
			setTimeout(function(){self.countDown();}, 800);
		}		
	}
	
	// update timer 
	Dressup.prototype.update = function(){
		this.timeLeft = this.endTime - new Date().getTime();
		
	    if(this.timeLeft>0){
			this.timer.style.width = (this.timeLeft/this.roundTime)*100 + "%";
		}
		
		var self = this;
		if(this.timeLeft/this.roundTime > 0){
			this.gameTimeOut = setTimeout(function(){self.update();},20);
		}else{
			this.modal({content : "You have failed", dialog : {text:"Retry", callback : function(event, self){	
					self.gameContainer.removeChild(self.gameArea);
					self.setup(self.scenarioNumber);
			}}});
		}
	}
	
	// piece is being clicked on
	Dressup.prototype.clicked = function(e, self){
		
		// for IE.
		if (e == null) {
			e = window.event; 
		}

		// get the target, clone it, and remove it so we can drag like a boss.
		var target = e.target != null ? e.target : e.srcElement;
		
		if ((e.button == 1 && window.event != null || e.button == 0) && hasClass(target,'sort-item')){
		
			//var cloneTarget = target.cloneNode(false);
			
			self.dragObj = {};
			self.dragObj.partsOver = {"mask" : false, "body" : false, "pants" : false, "gloves" : false, "boots" : false};
			
			// find what element it is and assign the type so we know what we are dragging
			for(var i = 0; i < this.sortItems.length; i++){
				if(target === this.sortItems[i].element){
					self.dragObj.type = this.sortItems[i].type;
					self.dragObj.value = this.sortItems[i].value;
				}
			}
			
			// get position
			self.dragObj.offset = getOffsetRect(target);
			
			var offset = self.dragObj.offset;
			offset.x = e.clientX-offset.x;
			offset.y = e.clientY-offset.y;
			
			target.style.zIndex = 1000;
			
			// we need to access the element in OnMouseMove
			self.dragObj.element = target;
			
			target.style.left = e.clientX-offset.x + 'px';
			target.style.top = e.clientY-offset.y + 'px';
			addClass(target, 'dragging');
			
			// This removes the item from its prev parent. I do this so coordinates are easier to calculate.
			this.gameArea.appendChild(target);
			
			// prevent text selection and image drag
			document.body.focus();
			document.onselectstart = function () { return false; };
			target.ondragstart = function() { return false; };
			
			self.checkOver(e, self);
			return false;
		}
	}
	
	// moving around YEEEAH BOOOOYYY!
	Dressup.prototype.dragging = function(e, self){
		if (e == null){
			var e = window.event; 
		}

		if(self.dragObj){
			self.checkOver(e, self);
		}
	}
	
	// check what part we are over.
	Dressup.prototype.checkOver = function(e, self){
		var dragObj = self.dragObj,
			offset = dragObj.offset;
			
		dragObj.element.style.left = e.clientX-offset.x + 'px';
		dragObj.element.style.top = e.clientY-offset.y + 'px';
		
		var dragRect = getOffsetRect(dragObj.element),
			x = dragRect.x,
			y = dragRect.y,
			width = dragRect.width,
			height = dragRect.height;
		
		for(var i = 0; i < self.targetParts.length; i++){
	
			var tX = self.targetParts[i].x,
				tY = self.targetParts[i].y,
				tWidth = self.targetParts[i].width,
				tHeight = self.targetParts[i].height;

			if((x > tX || (x + width) > tX) && x < tX + tWidth && (y > tY || (y + height) > tY) && y < tY + tHeight){
				dragObj.partsOver[self.targetParts[i].type] = true;
			}else{
				dragObj.partsOver[self.targetParts[i].type] = false;
			}
		}
	}
	
	// just placed a peice like a boss.
	Dressup.prototype.placement = function(e, self){
		var dragObj = self.dragObj;
		if (dragObj !== null)
		{
			removeClass(dragObj.element, 'dragging');
			removeClass(dragObj.element, 'placed');
			document.onselectstart = null;
			dragObj.element.ondragstart = null;
			
			// snap to position
			if(dragObj.partsOver[dragObj.type]){
				for(var i = 0; i < self.targetParts.length; i++){
					if(self.targetParts[i].type == dragObj.type){
						dragObj.element.style.left = self.targetParts[i].x + 'px';
						dragObj.element.style.top = self.targetParts[i].y + 'px';
						self.targetParts[i].value = self.dragObj.value;
						self.targetParts[i].curItems.push({el : dragObj.element, value : self.dragObj.value});
						addClass(dragObj.element, 'placed');
						break;
					}
				}
			}else{ 
				// if we are removing a piece update the values to reflect that
				for(var i = 0; i < self.targetParts.length; i++){
					var targetPart = self.targetParts[i],
						curItems = self.targetParts[i].curItems;
					
					for(var e = 0; e < curItems.length; e++){
						if(curItems[e].el === self.dragObj.element){
							curItems.splice(e,1);
							//targetPart.value -= self.dragObj.value;
							break;
						}
					}
				}
			}
			
			// clear dragobj
			self.dragObj = null;
		}
	}
	
	// calculate how good or bad they did
	Dressup.prototype.score = function(e, self){
		self.safetyScore = 0;
		self.effectScore = 0;
		self.timeScore = 0;
		self.overallScore = 0;
		
		var maxScores = self.currentScenario.scoring,
			overallMaxScore = 0,
			overallRank = "F",
			partScore = {
							"mask" : {safety : 0, effect : 0, rank : "F"}, 
							"suit" : {safety : 0, effect : 0, rank : "F"},  
							"gloves" :{safety : 0, effect : 0, rank : "F"},  
							"boots" : {safety : 0, effect : 0, rank : "F"}
						};
				
		// out loop goes through each of the item types body/mask/pants etc.
		for(var i = 0; i < self.targetParts.length; i++){
			var scenarioParts = this.currentScenario[self.targetParts[i].type],
				len = scenarioParts.length,
				targetPart = self.targetParts[i];

			// 2nd loop iterates through each of the scenario items for the current part were on
			for(var j = 0; j < len; j++){
				var curItemLen = targetPart.curItems.length,
					items = targetPart.curItems;
				
				// finally, last loop iterates over what the player has put on the model to see if it matches a scenario item.
				for(var k = 0; k < curItemLen; k++){		
					if(scenarioParts[j].value == items[k].value){
						// calculate effectiveness and safety scores
						self.safetyScore += scenarioParts[j].safety;
						self.effectScore += scenarioParts[j].effect;
						partScore[targetPart.type].safety += scenarioParts[j].safety;
						partScore[targetPart.type].effect += scenarioParts[j].effect;
					}
				}
			}
			// add up the max scores for the overall max
			overallMaxScore += maxScores[targetPart.type];
			partScore[targetPart.type].rank = rank((partScore[targetPart.type].safety + partScore[targetPart.type].effect) , maxScores[targetPart.type]); 
		}
		
		// stop execution
		clearTimeout(self.gameTimeOut);
		
		// calculate time score
		self.timeScore = Math.ceil(self.timeLeft/1000);
		self.overallScore = (self.safetyScore + self.effectScore) + self.timeScore;
		overallRank = rank((self.safetyScore + self.effectScore), overallMaxScore + maxScores.time);
		
		// clear sortarea.
		while (self.sortArea.hasChildNodes()) {
			self.sortArea.removeChild(self.sortArea.lastChild);
		}
		// hide any items that arent a part of the sort area, and not currently on the character
		self.toggle('');
		
		// Not a huge fan of this but meh itll work.
		var scoreMarkup = 	"<h3 class='rank'>Final Scores</h3>" + 
							"<table><thead><tr><th>Item</th><th>Safety</th><th>Effectiveness</th><th>Rank</th></tr></thead>" +
							"<tr><td>Head</td><td>" + partScore.mask.safety + "</td><td>" + partScore.mask.effect + "</td><td>" + partScore.mask.rank + "<td></tr>" +
							"<tr><td>Suit</td><td>" + partScore.suit.safety + "</td><td>" + partScore.suit.effect + "</td><td>" + partScore.suit.rank + "<td></tr>" +
							"<tr><td>Gloves</td><td>" + partScore.gloves.safety + "</td><td>" + partScore.gloves.effect + "</td><td>" + partScore.gloves.rank + "<td></tr>" +
							"<tr><td>Boots</td><td>" + partScore.boots.safety + "</td><td>" + partScore.boots.effect + "</td><td>" + partScore.boots.rank + "<td></tr>" +
							"<tr><td>Totals</td><td>" + self.safetyScore + "</td><td>" + self.effectScore + "</td></tr>" +
							"<tr><td>Overall</td><td> Time Bonus " + self.timeScore + "</td><td> Overall Score " + self.overallScore + "</td><td>Overall Rank " + overallRank + "</td></tr>" +
							"</table>" +
							"<h3 class='rank'>Overall Rank <span class='rank-" + overallRank + "'>" + overallRank + "</h3>";
							
		self.sortArea.innerHTML = scoreMarkup;
		
		// Retry Button
		var retryButton = document.createElement("button");
		addClass(retryButton, "score");
		text(retryButton, "Retry");
		
		// Restart the scenario.
		retryButton.addEventListener("click", function(event){	
					self.gameContainer.removeChild(self.gameArea);
					self.setup(self.scenarioNumber);
		});
		self.sortArea.appendChild(retryButton);
		
		// Exit
		var closeButton = document.createElement("button");
		addClass(closeButton, "score");
		text(closeButton, "Exit");
		
		closeButton.addEventListener('click', function(event){
					self.gameContainer.removeChild(self.gameArea);
					self.setupMenu();
		});
		
		self.sortArea.appendChild(closeButton);
	}
	
	Dressup.prototype.modal = function(options){
		var self = this,
			docFrag = document.createDocumentFragment(),
			parent = this.gameContainer,
			parentRect = getOffsetRect(this.gameContainer),
			overlay = document.createElement("div"),
			modal = document.createElement("div"),
			closeButton = document.createElement("button");
			
		addClass(overlay,"overlay");
		addClass(modal,"modal");
		//addClass(closeButton,"close");	
		
		docFrag.appendChild(overlay);
		docFrag.appendChild(modal);
		
		var content = document.createElement("div");
		addClass(content, "content");
		content.innerHTML = options.content;
		modal.appendChild(content);	
		
		if(options){
			if(options.width){
				modal.style.width = options.width + "px";
				modal.style.left = (parentRect.width - options.width)/2 + "px";
			}
			
			if(options.height){
				modal.style.height = options.height + "px";
				modal.style.top = (parentRect.height - options.height)/2 + "px";
			}
			
			if(options.dialog){
				// setup the button to check our score
				var okButton = document.createElement("button"),
					butText = "ok";
					
				if(options.dialog.text){
					butText = options.dialog.text;
				}
				
				text(okButton, butText);
		
				var callBack = function(event, self){return true};
				
				if(options.dialog.callback){
					callBack = options.dialog.callback;
				}

				okButton.addEventListener('click', function(event){callBack(event,self); parent.removeChild(modal);parent.removeChild(overlay);}, false);
				modal.appendChild(okButton);	
			}
		}else{
			options = {content : "forgot to pass params?"};
		}
		
		// hide the exit button if we want
		if(!options.noExit){
			text(closeButton, "Exit");
			modal.appendChild(closeButton);
			closeButton.addEventListener('click', function(event){
														parent.removeChild(modal);
														parent.removeChild(overlay);
														self.gameContainer.removeChild(self.gameArea);
														self.setupMenu();
												}, false);
		}
		
		parent.appendChild(docFrag);
		var modalDimensions = getOffsetRect(modal);
		modal.style.left = parseInt((parentRect.width - modalDimensions.width)/2, 10) + "px";
	}
	
	// toggles parts based on the tabs
	Dressup.prototype.toggle = function(event, itemClass){
		// hide all others show the class
		var classStatus = {'mask' : false, 'gloves':false, 'boots':false, 'suit':false},
			classes = ['mask', 'gloves', 'boots', 'suit'];
			
		// show the current one
		classStatus[itemClass] = true;

		for(var i = 0; i < classes.length; i++){
			var currentClass = classStatus[classes[i]],
				elements = byClass(classes[i]),
				display = 'none';
			if(currentClass){
				display = 'block';
			}
			
			var len = elements.length;
			while(len--){
				if(!hasClass(elements[len], 'placed')){
					elements[len].style.display = display;
				}
			}
			
		}
	}
	
	// utility functions	
	function rank(score, max){
		var rank = "N/A";

		if(max !== 0){	
			score = score/max;
			score *= 100;

			if(score <= 30){
				rank = "F";
			}else if(score > 30 && score <= 50){
				rank = "D";
			}else if(score > 50 && score <= 70){
				rank = "C";
			}else if(score > 70 && score <= 90){
				rank = "B";
			}else if(score > 90){
				rank = "A";
			}
		}
		
		return rank;
	}
	
	function text(_el, _text){
		if(_el.innerText !== undefined){
			_el.innerText = _text;
		}else{
			_el.textContent = _text;
		}
	}
	
	function byClass(matchClass){
		if (!document.getElementsByClassName){
			var elements = document.getElementsByTagName('*'),
				i=0,
				nodeList = [],
				reg = new RegExp('(^|\\s)' + matchClass + '(\\s|$)')
		   
			for (i=0; i < elements.length;i++)
			{
				if(elements[i].className.match(reg) !== null){
					 nodeList.push(elements[i]);
				}
			}
			return nodeList;
		}else{
			return document.getElementsByClassName(matchClass);
		}
	}

	function hasClass(_el, _class){
		return _el.className.match(new RegExp('(\\s|^)' + _class + '(\\s|$)'));
	}
	
	function addClass(_el, _class){
		if(!hasClass(_el, _class)){
			_el.className += ' ' + _class;
		}
	}
	
	function removeClass(_el, _class){
		if(hasClass(_el, _class)){
			var reg = new RegExp('(\\s|^)' + _class + '(\\s|$)');
			_el.className = _el.className.replace(reg, ' ');
		}
	}
	
	function getOffsetRect(elem) {
		var box = elem.getBoundingClientRect(),
			body = document.body,
			docElem = document.documentElement,
			scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
			scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
			clientTop = docElem.clientTop || body.clientTop || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top +  scrollTop - clientTop,
			left = box.left + scrollLeft - clientLeft,
			right = box.right + scrollLeft - clientLeft,
			bottom = box.bottom +  scrollTop - clientTop;

		return { x: Math.round(left), y: Math.round(top), width :  Math.round(right - left), height :Math.round(bottom - top)}
	}
})();

// Guess what this is for? Yeah IE < 9 because they dont support addevent listener.
if (!Element.prototype.addEventListener) {
	var oListeners = {};
	function runListeners(oEvent) {
		if (!oEvent) { oEvent = window.event; }
		for (var iLstId = 0, iElId = 0, oEvtListeners = oListeners[oEvent.type]; iElId < oEvtListeners.aEls.length; iElId++) {
			if (oEvtListeners.aEls[iElId] === this) {
				for (iLstId; iLstId < oEvtListeners.aEvts[iElId].length; iLstId++) { oEvtListeners.aEvts[iElId][iLstId].call(this, oEvent); }
				break;
			}
		}
	}
  Element.prototype.addEventListener = function (sEventType, fListener /*, useCapture (will be ignored!) */) {
    if (oListeners.hasOwnProperty(sEventType)) {
      var oEvtListeners = oListeners[sEventType];
      for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
        if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
      }
      if (nElIdx === -1) {
        oEvtListeners.aEls.push(this);
        oEvtListeners.aEvts.push([fListener]);
        this["on" + sEventType] = runListeners;
      } else {
        var aElListeners = oEvtListeners.aEvts[nElIdx];
        if (this["on" + sEventType] !== runListeners) {
          aElListeners.splice(0);
          this["on" + sEventType] = runListeners;
        }
        for (var iLstId = 0; iLstId < aElListeners.length; iLstId++) {
          if (aElListeners[iLstId] === fListener) { return; }
        }     
        aElListeners.push(fListener);
      }
    } else {
      oListeners[sEventType] = { aEls: [this], aEvts: [ [fListener] ] };
      this["on" + sEventType] = runListeners;
    }
  };
  Element.prototype.removeEventListener = function (sEventType, fListener /*, useCapture (will be ignored!) */) {
    if (!oListeners.hasOwnProperty(sEventType)) { return; }
    var oEvtListeners = oListeners[sEventType];
    for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
      if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
    }
    if (nElIdx === -1) { return; }
    for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
      if (aElListeners[iLstId] === fListener) { aElListeners.splice(iLstId, 1); }
    }
  };
}