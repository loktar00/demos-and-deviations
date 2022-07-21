var mousePos = {x:0, y:0},
    settings = {
        message : "testing some words I'm a snake!",
        FollowMouse : false
    },
    gui = new dat.GUI();
    gui.add(settings, 'FollowMouse');
    var messageController = gui.add(settings, 'message');
    messageController.onFinishChange(function(value) {
       wordString.destroy();
       wordString = new WordString({text:settings.message});
    });

var container = document.querySelectorAll('.container')[0];
    container.style.width = window.innerWidth + 'px';
    container.style.height = window.innerHeight + 'px';
    container.addEventListener('mousemove', function(e){
        mousePos = {
                x : e.clientX,
                y : e.clientY
        };
    });

var Segment = function (settings) {
    settings = settings || {};
    this.angle = settings.angle || 0;

    this.x = settings.x || 0;
    this.y = settings.y || 0;

    this.element = document.createElement('span');
    this.element.classList.add('letter');
    this.element.textContent = settings.letter;
    container.appendChild(this.element);

    this.width = parseInt(window.getComputedStyle(this.element,null).getPropertyValue('width'), 10);
    this.height = parseInt(window.getComputedStyle(this.element,null).getPropertyValue('height'),10);
}

Segment.prototype.getJoint = function () {
    var x = this.x + Math.cos(this.angle) * this.width,
        y = this.y + Math.sin(this.angle) * this.width;
    return {
        x: x,
        y: y
    };
};

Segment.prototype.render = function (el) {
    el.style.left = this.x +'px';
    el.style.top = this.y + 'px';
    el.style.webkitTransform = "rotate(" + this.angle + "deg)";
};

// this is only to make the words do something if you're not moving the mouse
var Ball = function(){
    this.x = ~~(Math.random()*window.innerWidth);
    this.y =  ~~(Math.random()*window.inneHeight);
    this.speed = 6;
    this.dx = this.speed;
    this.dy = this.speed;
};

Ball.prototype.update = function(){
    if(this.x >= window.innerWidth){
     this.dx = -this.speed;
    }
    if(this.x <= 0){
     this.dx = this.speed;
    }
    if(this.y >= window.innerHeight){
     this.dy = -this.speed;
    }
    if(this.y <= 0){
     this.dy = this.speed;
    }

    this.x += this.dx;
    this.y += this.dy;
};


var WordString = function (settings) {
    settings = settings || {};
    this.x = settings.x || 0;
    this.y = settings.y || 0;
    this.text = settings.text.split('');
    this.text.reverse().join('');

    this.segNum = settings.text.length;
    this.angle = (Math.random() * 360 - 180) * Math.PI / 180;
    this.segments = [];

    this.segments.push(new Segment({
        x: this.x,
        y: this.y,
        angle: this.angle,
        letter: this.text[0]
    }));

    for (var s = 1; s < this.segNum; s++) {
        this.segments.push(new Segment({
            letter: this.text[s],
            angle: (Math.random() * 360 - 180) * Math.PI / 180
        }));
    }
}

WordString.prototype.move = function (segment, x, y) {
    var dx = x - segment.x,
        dy = y - segment.y;

    segment.angle = Math.atan2(dy, dx);

    var w = segment.getJoint().x - segment.x,
        h = segment.getJoint().y - segment.y;

    segment.x = x - w;
    segment.y = y - h;
}

WordString.prototype.update = function () {
    this.move(this.segments[0], this.x, this.y);

    var move = this.move;

    if(settings.FollowMouse){
        move(this.segments[0], mousePos.x, mousePos.y);
    }else{
        move(this.segments[0], followBall.x, followBall.y);
    }

    this.segments.forEach(function (e, i, arr) {
        if (i !== 0) {
            move(e, arr[i - 1].x, arr[i - 1].y);
        }
    });

    followBall.update();
};

WordString.prototype.render = function () {
    this.segments.forEach(function (e) {
        e.render(e.element);
    });
};

WordString.prototype.destroy = function(){
    this.segments.forEach(function (e, i, arr) {
        e.element.remove();
    });
}

var wordString = new WordString({text:settings.message}),
    followBall = new Ball();

function update(){
    wordString.update();
    wordString.render();
    requestAnimationFrame(update);
}

update();
