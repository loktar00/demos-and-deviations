function Person(options) {
    options = options || {};
    this.bounds = options.bounds || {
        width: 500,
        height: 500
    };
    this.x = options.x || Math.random() * this.bounds.width;
    this.y = options.y || Math.random() * this.bounds.height;
    this.xDir = Math.round(Math.random() * 2) - 1;
    this.yDir = Math.round(Math.random() * 2) - 1;

    this.color = [200, 100, 100];
    this.state = "idle";
    this.xDir = 0;
    this.yDir = 0;
}

Person.prototype = {
    checkPixel: function (x, y, data) {
        var pData = (~~ (x) + ~~ (y) * this.bounds.width) * 4,
            val = 0;

        if (data[pData + 3] > 0) {
            val = 1; // normal civ

            if (data[pData + 2] >= 150) {
                val = 2; // panicked civ
            }

            if (data[pData + 1] >= 190) {
                val = 3; // zombie
            }
        }

        return val;
    },
    checkNieghbors: function (data) {
        var val = 0;
        for (var x = this.x - 2; x < this.x + 3; x++) {
            for (var y = this.y - 2; y < this.y + 3; y++) {
                if (x !== this.x && y !== this.y) {
                    if (this.checkPixel(x, y, data) >= 2) {
                        this.state = "panic";
                    }
                }
            }
        }
    },
    kill : function(){
        this.state = "killed";
        this.color = [255, 0, 0];
    },
    update: function (data) {
        if (this.state == "idle" && Math.random() > 0.4) {
            this.xDir = Math.round(Math.random() * 2) - 1;
            this.yDir = Math.round(Math.random() * 2) - 1;
        } else if (this.state == "panic") {
            this.xDir = Math.round(Math.random() * 2) - 1;
            this.yDir = Math.round(Math.random() * 2) - 1;
        }

        if (this.x + this.xDir < 0 && this.x + this.xDir > this.bounds.width) {
            this.xDir = 0;
        }
        if (this.y + this.yDir < 0 && this.y + this.yDir > this.bounds.height) {
            this.yDir = 0;
        }

        this.state = "idle";

        var val = this.checkPixel(this.x + this.xDir, this.y + this.yDir, data);
        this.checkNieghbors(data);

        switch (val) {
            case 1:
                this.xDir = 0;
                this.yDir = 0;
                break;
            case 2:
                this.state = "panic";
                this.xDir = -this.xDir;
                this.yDir = -this.yDir;
                break;
        }

        val = this.checkPixel(this.x, this.y, data);

        if (val == 3) {
            this.state = "dead";
        }

        this.x += this.xDir;
        this.y += this.yDir;

        switch (this.state) {
            case "idle":
                this.color = [200, 100, 100];
                break;
            case "panic":
                this.color = [200, 150, 150];
                break;
        }
    }
}

function Zombie(options) {
    options = options || {};
    this.bounds = options.bounds || {
        width: 500,
        height: 500
    };
    this.x = options.x || Math.random() * this.bounds.width;
    this.y = options.y || Math.random() * this.bounds.height;
    this.color = [0, 190, 0];
    this.state = "idle";
}

Zombie.prototype = {
    checkPixel: function (x, y, data) {
        var pData = (~~ (x) + ~~ (y) * this.bounds.width) * 4,
            val = 0;

        if (data[pData + 1] >= 200) {
            val = 1; // normal civ
        }

        return val;
    },
    kill : function(){
        this.state = "killed";
        this.color = [255, 0, 0];
    },
    checkNieghbors: function (data) {
      var val = 0;
      const checkDistance = 3;
        for (var x = this.x - checkDistance - 1; x < this.x + checkDistance; x++) {
            for (var y = this.y - checkDistance - 1; y < this.y + checkDistance; y++) {
                if (x !== this.x && y !== this.y) {
                    if (this.checkPixel(x, y, data) >= 2) {
                        this.state = "chase";
                        this.xDir = this.x - x;
                        this.yDir = this.y - y;
                    }
                }
            }
        }
    },
    update: function (data) {
        if (this.state == "idle") {
            this.xDir = Math.round(Math.random() * 2) - 1,
            this.yDir = Math.round(Math.random() * 2) - 1;
        }

        if (this.x + this.xDir < 0 && this.x + this.xDir > this.bounds.width) {
            this.xDir = 0;
        }
        if (this.y + this.yDir < 0 && this.y + this.yDir > this.bounds.height) {
            this.yDir = 0;
        }
        this.state = "idle";
        this.checkNieghbors(data);

        this.x += this.xDir;
        this.y += this.yDir;
        switch (this.state) {
            case "idle":
                this.color = [0, 190, 0];
                break;
            case "chase":
                this.color = [0, 255, 100];
                break;
        }
    }
}


function ZSim(options) {
    options = options || {};
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.peopleLabel = document.getElementById("survivors");
    this.zombieLabel = document.getElementById("zombies");
    this.reqId = null;
    this.init(options);
}

ZSim.prototype = {
    update: function () {
        var imgData = this.ctx.createImageData(this.width, this.height),
            oldData = this.ctx.getImageData(0, 0, this.width, this.height).data,
            data = imgData.data;

        for (var p = 0; p < this.people.length; p++) {
           if(this.people[p].state !=="killed"){
            this.people[p].update(oldData);
           }
            if (this.people[p].state !== "dead") {
                this.drawPixel(data, this.people[p]);
            } else {
                this.zombies.push(new Zombie({
                    x: this.people[p].x,
                    y: this.people[p].y
                }));
                this.people.splice(p, 1);
            }
        }

        for (var z = 0; z < this.zombies.length; z++) {
          if(this.zombies[z].state !=="killed"){
            this.zombies[z].update(oldData);
          }
          this.drawPixel(data, this.zombies[z]);

        }

        for (var k = 0; k < this.killed.length; k++) {
          this.drawPixel(data, this.killed[k]);
        }

        this.peopleLabel.textContent = this.people.length;
        this.zombieLabel.textContent = this.zombies.length;
        this.ctx.putImageData(imgData, 0, 0);
        this.reqId = requestAnimationFrame(this.update.bind(this));
    },
    drawPixel: function (data, pixel) {
        var pData = null;
        pData = (~~pixel.x + ~~pixel.y * this.canvas.width) * 4;
        data[pData] = pixel.color[0];
        data[pData + 1] = pixel.color[1];
        data[pData + 2] = pixel.color[2];
        data[pData + 3] = 255;
    },
    kill : function(e){
      var cX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
          cY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      cX -= this.canvas.offsetLeft;
      cY -= this.canvas.offsetTop;

      for (var z = 0; z < this.zombies.length; z++) {
        var dist = Math.sqrt((this.zombies[z].x - cX) *(this.zombies[z].x - cX) + (this.zombies[z].y - cY) * (this.zombies[z].y - cY));

        if(dist < this.killRadius){
            this.zombies[z].kill();
            this.killed.push(this.zombies.splice(z,1)[0]);
        }
      }

      for (var p = 0; z < this.people.length; p++) {
        var dist = Math.sqrt((this.people[p].x - cX) *(this.people[p].x - cX) + (this.people[p].y - cY) * (this.people[p].y - cY));

        if(dist < this.killRadius){
            this.people[p].kill();
            this.killed.push(this.people.splice(p,1)[0]);
        }
      }
    },
    init: function (options) {
        options = options || {};
        this.width = options.width || 500;
        this.height = options.height || 500;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.bounds = {
            width: this.width,
            height: this.height
        };

        this.canvas.addEventListener("click", this.kill.bind(this));
        this.canvas.style.marginLeft = -this.width/2 + "px";
        this.personCount = options.people || 18000;
        this.zombieCount = options.zombies || 10;
        this.killRadius = options.killRadius || 50;

        if (this.people && this.zombies && this.killed) {
            this.people.length = 0;
            this.zombies.length = 0;
            this.killed.length = 0;
        }

        this.people = [];
        this.zombies = [];
        this.killed = [];

        for (var p = 0; p < this.personCount; p++) {
            this.people.push(new Person({
                x: ~~ (Math.random() * this.canvas.width),
                y: ~~ (Math.random() * this.canvas.height),
                bounds: this.bounds
            }));
        }

        for (var z = 0; z < this.zombieCount; z++) {
            this.zombies.push(new Zombie({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                bounds: this.bounds
            }));
        }
        cancelAnimationFrame(this.reqId);
        this.update();
    }
}

var zSim = new ZSim();
var gui = new dat.GUI(),
    settings = {
        width: 500,
        height: 500,
        people: 18000,
        zombies: 10,
        killRadius : 50,
        start: function () {
            zSim.init(settings);
        }
    };
gui.add(settings, 'width');
gui.add(settings, 'height');
gui.add(settings, 'people', 1, 60000);
gui.add(settings, 'zombies', 1, 10000);
gui.add(settings, 'killRadius', 1, 500);
gui.add(settings, 'start');