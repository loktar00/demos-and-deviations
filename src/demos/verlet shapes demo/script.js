(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();



var canvas = document.getElementById("verlet"),
    ctx = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight,
    simSteps = 15,
    pointMass = [],
    pointConstraints = [],
    bodies = [],
    bodyCount = 0,
    cycle = 0,
    colors = {
      r: 0,
      g: 150,
      b: 150
    };

canvas.width = width;
canvas.height = height;

var createPoint = function (x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.ox = x;
    this.oy = y;
    this.vx = vx;
    this.vy = vy;
    this.id = bodyCount;
    return this;
},

createConstraint = function (pMassA, pMassB, spring) {
    this.p1 = pMassA;
    this.p2 = pMassB;
    this.spring = spring;
    this.cLength = Math.sqrt((pMassA.x - pMassB.x) * (pMassA.x - pMassB.x) + (pMassA.y - pMassB.y) * (pMassA.y - pMassB.y));
    this.id = bodyCount;
    return this;
},

body = function (x, y, width, height, points, constraints) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.points = points;
    this.constraints = constraints;

    this.color = colorCycle();
},
ball = function (cx, cy, rad, segments, spring) {
    bodyCount++;
    var localPoints = [],
        localConstraints = [],
        di = rad / 2;

    // Create points around the center
    for (var angle = 0; angle < segments; angle++) {
        var pointX = cx + di * Math.cos(2 * Math.PI * angle / segments),
            pointY = cy + di * Math.sin(2 * Math.PI * angle / segments);

        localPoints.push(new createPoint(pointX, pointY, 0, 0));
    }

    // Create center point
    localPoints.push(new createPoint(cx, cy, 10-Math.random()*20, 0));

    // Create constraints around the points
    for (var i = 1; i < localPoints.length; i++) {
        localConstraints.push(new createConstraint(localPoints[i - 1], localPoints[i], spring));

        // Connect to the center
        localConstraints.push(new createConstraint(localPoints[i], localPoints[localPoints.length - 1], spring));
    }

    localConstraints.push(new createConstraint(localPoints[localPoints.length - 1], localPoints[0], spring));

    // Connect last 2 points on the circle
    localConstraints.push(new createConstraint(localPoints[localPoints.length - 2], localPoints[0], spring));

    bodies.push(new body(cx, cy, rad, rad, localPoints, localConstraints));
    pointMass = pointMass.concat(localPoints);
    pointConstraints = pointConstraints.concat(localConstraints);
},

verlet = function () {
    var updatePointMass = function () {
        for (var i = 0; i < pointMass.length; i++) {
            var point = pointMass[i],
                dx = point.x - point.ox + point.vx,
                dy = point.y - point.oy + point.vy + .1;

            point.vx *= .8;
            point.vy *= .8;
            point.ox = point.x;
            point.oy = point.y;

            point.x = point.x + dx;
            point.y = point.y + dy;

            for (var j = 0; j < pointConstraints.length; j++) {
                if (pointConstraints[j].id !== point.id) {
                    var constraint = pointConstraints[j],
                        x1 = constraint.p1.x - point.x,
                        y1 = constraint.p1.y - point.y,
                        x2 = constraint.p2.x - point.x,
                        y2 = constraint.p2.y - point.x;
                }
            }

            if (point.y > height) {
                point.y = height;
                dx = point.x - point.ox;
                dx = dx * .5;
                point.ox += dx;
            }

            if (point.x > width || point.x < 0) {

                if (point.x > width) {
                    point.x = width;
                } else if (point.x < 0) {
                    point.x = 0;
                }
                dy = point.y - point.oy;
                dy = dy * .5;
                point.oy += dy;
            }
        }
    },

    updateConstraints = function () {
        for (var i = 0; i < simSteps; i++) {
            for (var c = 0; c < pointConstraints.length; c++) {
                var constraint = pointConstraints[c],
                    dist = Math.sqrt((constraint.p1.x - constraint.p2.x) * (constraint.p1.x - constraint.p2.x) + (constraint.p1.y - constraint.p2.y) * (constraint.p1.y - constraint.p2.y)),
                    diff = dist - constraint.cLength;

                var dx = constraint.p1.x - constraint.p2.x,
                    dy = constraint.p1.y - constraint.p2.y;

                if (constraint.cLength > 0) {
                    diff /= constraint.cLength;
                } else {
                    diff = 0;
                }

                dx = dx * .5;
                dy = dy * .5;

                constraint.p1.x = constraint.p1.x - (diff * dx) / constraint.spring;
                constraint.p1.y = constraint.p1.y - (diff * dy) / constraint.spring;

                constraint.p2.x = constraint.p2.x + (diff * dx) / constraint.spring;
                constraint.p2.y = constraint.p2.y + (diff * dy) / constraint.spring;
            }
        }
    };

    return {
        render: function () {
            ctx.strokeStyle = "rgb(255,0,0)";
            ctx.clearRect(0, 0, width, height);

            updatePointMass();
            updateConstraints();

            for (var b = 0; b < bodies.length; b++) {
                ctx.fillStyle = "rgb(" + bodies[b].color.r + "," + bodies[b].color.g + "," + bodies[b].color.b + ")";
                var points = bodies[b].points;
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (var c = 1; c < points.length; c++) {
                    var point = points[c];
                    ctx.lineTo(point.x, point.y);
                }
                ctx.lineTo(points[points.length - 2].x, points[points.length - 2].y);
                ctx.closePath();
                ctx.fill();
            }

          if(settings.showConstraints){
            for (var c = 0; c < pointConstraints.length; c++) {
                var constraint = pointConstraints[c];
                ctx.beginPath();
                ctx.moveTo(constraint.p1.x, constraint.p1.y);
                ctx.lineTo(constraint.p2.x, constraint.p2.y);
                ctx.closePath();
                ctx.stroke();
            }
          }

            requestAnimationFrame(function () {
                verlet.render();
            });
        }
    };
}();


setTimeout(function () {
  width = canvas.width = window.innerWidth,
  height = canvas.height = document.body.offsetHeight;

for(var i = 0; i < 6; i++){
   size = 5+Math.random()*150;
   ball(5+settings.size + (Math.random()*width-settings.size-5), 10, size, 2 + Math.random()*10, size/10);
}
   verlet.render();
},100);

// I use this in so many pens...
function colorCycle() {
  cycle +=2;
  var r = colors.r,
      g = colors.g,
      b = colors.b;

  if (cycle > 100) {
      cycle = 0;
  }
  r = ~~ (Math.sin(.3 * cycle + 0) * 127 + 128);
  g = ~~ (Math.sin(.3 * cycle + 2) * 127 + 128);
  b = ~~ (Math.sin(.3 * cycle + 4) * 127 + 128);
return {r : r, g : g, b: b};
}

var gui = new dat.GUI(),
  settings = {
      size : 150,
      sides : 10,
      softness : 25,
      create : function(){
          ball(5+settings.size + (Math.random()*width-settings.size-5), 10,
               settings.size,
               settings.sides,
               settings.softness);
      },
      showConstraints : false
  };

gui.add(settings, 'size');
gui.add(settings, 'sides', 3, 60);
gui.add(settings, 'softness', 1, 200);
gui.add(settings, 'showConstraints');
gui.add(settings, 'create');