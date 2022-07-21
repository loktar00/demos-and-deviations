'use strict';

// requestanimation polyfill
(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        },
        timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}());


var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var Segment = function (settings) {
    settings = settings || {};
    this.angle = settings.angle || 0;

    this.x = settings.x || 0;
    this.y = settings.y || 0;

    this.width = settings.width || 10;
    this.height = settings.height || 2;

    this.color = settings.color || {
        r: 255,
        g: 50,
        b: 100
    };
}

Segment.prototype.getJoint = function () {
    var x = this.x + Math.cos(this.angle) * this.width,
        y = this.y + Math.sin(this.angle) * this.width;
    return {
        x: x,
        y: y
    };
};

Segment.prototype.render = function (ctx) {
    ctx.fillStyle = "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillRect(-this.height / 2, -this.height / 2, this.width + this.height, this.height);
    ctx.restore();
};

var Snake = function (settings) {
    settings = settings || {};
    this.x = settings.x || 0;
    this.y = settings.y || 0;
    this.color = settings.color || {
        r: ~~ (Math.random() * 255),
        g: ~~ (Math.random() * 255),
        b: ~~ (Math.random() * 255)
    };
    this.vX = 0;
    this.vY = 0;

    this.wiggle = 0;
    this.bounds = settings.bounds || {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    };
    this.segNum = settings.segNum || 10;
    this.angle = (Math.random() * 360 - 180) * Math.PI / 180;

    this.setTarget(settings.target);

    this.segments = [];

    this.segments.push(new Segment({
        x: this.x,
        y: this.y,
        angle: this.angle,
        color: this.color
    }));

    for (var s = 1; s < this.segNum; s++) {
        this.segments.push(new Segment({
            angle: (Math.random() * 360 - 180) * Math.PI / 180,
            color: this.color
        }));
    }
}

Snake.prototype.setTarget = function (target) {
    var tX = Math.random() * this.bounds.width,
        tY = Math.random() * this.bounds.height;

    if (target) {
        tX = target.x;
        tY = target.y;
    }
    this.target = {
        x: tX,
        y: tY
    };
};

Snake.prototype.move = function (segment, x, y) {
    var dx = x - segment.x,
        dy = y - segment.y;

    segment.angle = Math.atan2(dy, dx);

    var w = segment.getJoint().x - segment.x,
        h = segment.getJoint().y - segment.y;

    segment.x = x - w;
    segment.y = y - h;
}

Snake.prototype.update = function () {
    this.move(this.segments[0], this.x, this.y);

    var move = this.move,
        color = this.color;

    this.segments.forEach(function (e, i, arr) {
        e.color = color;
        if (i !== 0) {
            move(e, arr[i - 1].x, arr[i - 1].y);
        }
    });
};

Snake.prototype.render = function (ctx) {
    this.segments.forEach(function (e) {
        e.render(ctx);
    });
};

var Light = function (settings) {
    this.ease = settings.ease || 20;
    this.bounds = settings.bounds || {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    };

    this.angle = 0;

    this.x = Math.random() * this.bounds.width/2;
    this.y = Math.random() * this.bounds.height/2;

    this.setTarget();
};

Light.prototype.update = function () {
    var dX = this.target.x - this.x,
        dY = this.target.y - this.y,
        dist = Math.sqrt(dX * dX - dY * dY);

    if (dist > this.ease) {
        this.x += dX / this.ease;
        this.y += dY / this.ease;
    } else {
        this.setTarget();
    }
};

Light.prototype.setTarget = function () {
    var tX = Math.random() * this.bounds.width,
        tY = Math.random() * this.bounds.height;

    this.target = {
        x: tX,
        y: tY
    };
};

function Demo(canvas) {
    var that = this;

    this.canvas = canvas;

    this.ctx = canvas.getContext("2d");
    this.ctx.fillStyle = "#000";
    this.req = null;

    this.settings = {
        brightness: 120,
        lightness: 120,
        snakeSpread: 30,
        mouseFollow: false,
        snakeCount: 100,
        snakeLength: 8,
        snakeSpeed: 5,
        restart: function () {
            that.init();
        }
    };

    this.mouseX = 0;
    this.mouseY = 0;

    this.canvas.addEventListener("mousemove", function (e) {
        that.mouseX = e.pageX;
        that.mouseY = e.pageY;
    });

    this.update = function () {
        this.brightness = this.settings.brightness;
        this.lightness = this.settings.lightness;

        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.light.update();

        for (var s = 0, sLen = this.snakes.length; s < sLen; s++) {
            var snake = this.snakes[s],
                dX = snake.x - snake.target.x,
                dY = snake.y - snake.target.y,
                heading = Math.atan2(dY, dX),
                dist = Math.sqrt(dX * dX + dY * dY);

            snake.angle = heading + Math.cos(snake.wiggle += 0.1);
            snake.vX = Math.cos(snake.angle) * this.settings.snakeSpeed;
            snake.vY = Math.sin(snake.angle) * this.settings.snakeSpeed;

            snake.color = this.colorCycle(this.cycle, this.brightness, this.lightness);

            if (dist > 10) {
                snake.x -= snake.vX;
                snake.y -= snake.vY;
            } else {
               var x =  this.light.x + this.snakeSpread - Math.random() * this.snakeSpread,
                   y = this.light.y + this.snakeSpread - Math.random() * this.snakeSpread;
                if (this.settings.mouseFollow) {
                    x = this.mouseX - this.snakeSpread*2 + Math.random() * this.snakeSpread*5;

                    y = this.mouseY - this.snakeSpread*2 + Math.random() * this.snakeSpread*5;

                }

              snake.setTarget({
                x: x,
                y: y
              });
            }

            snake.update();
            snake.render(this.ctx);
        }

        this.cycle += 0.4;
        this.req = requestAnimationFrame(this.update.bind(this));
    }

    this.colorCycle = function (cycle, bright, light) {
        bright = bright || 255;
        light = light || 0;
        cycle *= .1;
        var r = ~~ (Math.sin(.3 * cycle + 0) * bright + light),
            g = ~~ (Math.sin(.3 * cycle + 2) * bright + light),
            b = ~~ (Math.sin(.3 * cycle + 4) * bright + light);

        return {
            r: Math.min(r, 255),
            g: Math.min(g, 255),
            b: Math.min(b, 255)
        };
    }

    this.init = function () {
        cancelAnimationFrame(this.req);

        this.snakes = [];
        this.light = null;

        this.cycle = 0;
        this.brightness = this.settings.brightness;
        this.lightness = this.settings.lightness;

        this.snakeSpread = this.settings.snakeSpread;

        this.snakeCount = this.settings.snakeCount;
        this.light = new Light({
            bounds: {
                x: 0,
                y: 0,
                width: this.canvas.width,
                height: this.canvas.height,
                ease: 25 - this.settings.snakeSpeed
            }
        });

        for (var s = 0; s < this.snakeCount; s++) {
            var x = canvas.width/2 - Math.random() * canvas.width/4,
                y = canvas.height/2 - Math.random() * canvas.height/4;

            this.snakes.push(new Snake({
                x: x,
                y: y,
                segNum: this.settings.snakeLength,
                bounds: {
                    x: 0,
                    y: 0,
                    width: this.canvas.width,
                    height: this.canvas.height
                },
                target: {
                    x: this.light.y,
                    y: this.light.x
                }
            }));
        }
        this.update();
    }

    var gui = new dat.GUI();
    gui.add(this.settings, 'mouseFollow');
    gui.add(this.settings, 'brightness', 1, 255);
    gui.add(this.settings, 'lightness', 1, 255);

    var snakeSettings = gui.addFolder('Snake Settings');
    snakeSettings.add(this.settings, 'snakeCount', 1, 300);
    snakeSettings.add(this.settings, 'snakeLength', 1, 50);
    snakeSettings.add(this.settings, 'snakeSpeed', 1, 10);
    gui.add(this.settings, 'restart');

    this.init();
}

var demo = null;
setTimeout(function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    demo = new Demo(canvas);
}, 100);