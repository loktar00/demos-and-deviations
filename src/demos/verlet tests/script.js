(function() {
    var canvas = document.getElementById("verlet"),
        ctx = canvas.getContext("2d"),
    pointMass = [], pointConstraints = [],
        bodyCount = 0;

    canvas.width = 756;
    canvas.height = 756;

    createPoint = function(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.ox = x;
        this.oy = y;
        this.vx = vx;
        this.vx = vy;
        this.id = bodyCount;
        return this;
    }

    createConstraint = function(pMassA, pMassB, spring) {
        this.p1 = pMassA;
        this.p2 = pMassB;
        this.spring = spring;
        this.cLength = Math.sqrt((pMassA.x - pMassB.x) * (pMassA.x - pMassB.x) + (pMassA.y - pMassB.y) * (pMassA.y - pMassB.y));
        this.id = bodyCount;
        return this;
    }

    box = function(sx, sy, width, height, spring) {
        bodyCount++;
        var localPoints = [],
            localConstraints = [];

        localPoints.push(new createPoint(sx, sy, 0, 0));
        localPoints.push(new createPoint(sx, sy + height, 0, 0));
        localPoints.push(new createPoint(sx + width, sy, 0, 0));
        localPoints.push(new createPoint(sx + width, sy + height, 0, 0));

        localConstraints.push(new createConstraint(localPoints[0], localPoints[1], spring));
        localConstraints.push(new createConstraint(localPoints[0], localPoints[2], spring));
        localConstraints.push(new createConstraint(localPoints[0], localPoints[3], spring));

        localConstraints.push(new createConstraint(localPoints[1], localPoints[3], spring));
        localConstraints.push(new createConstraint(localPoints[3], localPoints[2], spring));
        localConstraints.push(new createConstraint(localPoints[1], localPoints[2], spring));

        pointMass = pointMass.concat(localPoints);
        pointConstraints = pointConstraints.concat(localConstraints);
    }

    ball = function(cx, cy, rad, spring) {
        bodyCount++;
        var localPoints = [],
            localConstraints = [];

        // Create points around the center
        for (var angle = 0; angle < 6; angle += 0.9) {
            localPoints.push(new createPoint(Math.sin(angle) * rad + cx, Math.cos(angle) * rad + cy, 0, 0));
        }

        // Create center point
        localPoints.push(new createPoint(cx, cy, 0, 0));

        // Create constraints around the points
        for (var i = 1; i < localPoints.length; i++) {
            localConstraints.push(new createConstraint(localPoints[i - 1], localPoints[i], spring));
            // Connect to the center
            localConstraints.push(new createConstraint(localPoints[i], localPoints[localPoints.length - 1], spring));
        }

        localConstraints.push(new createConstraint(localPoints[localPoints.length - 1], localPoints[0], spring));

        // Connect last 2 points on the circle
        localConstraints.push(new createConstraint(localPoints[localPoints.length - 2], localPoints[0], spring));

        pointMass = pointMass.concat(localPoints);
        pointConstraints = pointConstraints.concat(localConstraints);
    }

    var verlet = function() {
        var updatePointMass = function() {
            for (var i = 0; i < pointMass.length; i++) {
                var point = pointMass[i];

                ctx.beginPath();
                ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();

                var dx = point.x - point.ox,
                    dy = point.y - point.oy + .1;

                point.ox = point.x;
                point.oy = point.y;

                point.x = point.x + dx;
                point.y = point.y + dy;

                for(var j = 0; j < pointConstraints.length; j++){
                    if(pointConstraints[j].id !== point.id){
                        var constraint = pointConstraints[j];
                        var x1 = constraint.p1.x - point.x;
                        var y1 = constraint.p1.y - point.y;

                        var x2 = constraint.p2.x - point.x;
                        var y2 = constraint.p2.y - point.x;


                        //------------
                    }
                }

                if (point.y > 756) {
                    point.y = 756;
                    dx = point.x - point.ox;
                    dx = dx * .5;
                    point.ox = point.ox + dx;
                }
            }
        },

            updateConstraints = function() {
                for (var i = 0; i < 10; i++) {
                    for (var c = 0; c < pointConstraints.length; c++) {
                        var constraint = pointConstraints[c],
                            dist = Math.sqrt((constraint.p1.x - constraint.p2.x) * (constraint.p1.x - constraint.p2.x) + (constraint.p1.y - constraint.p2.y) * (constraint.p1.y - constraint.p2.y)),
                            diff = dist - constraint.cLength;

                        var dx = constraint.p1.x - constraint.p2.x,
                            dy = constraint.p1.y - constraint.p2.y;

                        if (constraint.cLength > 0) {
                            diff = diff / constraint.cLength;
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

                for (var c = 0; c < pointConstraints.length; c++) {
                    var constraint = pointConstraints[c];

                    ctx.beginPath();
                    ctx.moveTo(constraint.p1.x, constraint.p1.y);
                    ctx.lineTo(constraint.p2.x, constraint.p2.y);
                    ctx.stroke();
                }
            }

            return {
                render: function() {
                    ctx.fillStyle = "#000";
                    ctx.strokeStyle = "rgb(0,255,0)";
                    ctx.fillRect(0, 0, 756, 756);
                    ctx.fillStyle = "rgb(255,0,0)";
                    updatePointMass();
                    updateConstraints();

                    var t = setTimeout(function() {
                        verlet.render()
                    }, 20);
                }
            };
    }();
    ball(520, 10, 100, 5);
     ball(50, 10, 80, 5);
    ball(300, 10, 100, 25);
    box(180, 10, 30, 30, 45);
    box(220, 10, 30, 30, 45);
    box(180, 50, 30, 30, 45);
    verlet.render();
})();