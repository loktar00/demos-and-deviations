function calcPointsCirc( cx,cy, rad, dashLength)
{
    var n = rad/dashLength,
        alpha = Math.PI * 2 / n,
        pointObj = {},
        points = [],
        i = -1;

    while( i < n )
    {
        var theta = alpha * i,
            theta2 = alpha * (i+1);

        points.push({x : (Math.cos(theta) * rad) + cx, y : (Math.sin(theta) * rad) + cy, ex : (Math.cos(theta2) * rad) + cx, ey : (Math.sin(theta2) * rad) + cy});
   i+=2;
    }
    return points;
}


var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = canvas.height= 200;

var pointArray= calcPointsCirc(50,50,50, 1);
    ctx.strokeStyle = "rgb(0,255,0)";
    ctx.beginPath();

    for(p = 0; p < pointArray.length; p++){
        ctx.moveTo(pointArray[p].x, pointArray[p].y);
        ctx.lineTo(pointArray[p].ex, pointArray[p].ey);

        ctx.stroke();
        ctx.closePath();
    }


