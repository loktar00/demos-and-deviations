var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

canvas.width = canvas.height = 2048;

var PI = Math.PI*2,
    trees = [];

function drawTree(tree){
    var x = tree.x,
        y = tree.y,
        radius = tree.radius;

    // shadow
    ctx.fillStyle = "#a56007";
    ctx.beginPath();
        ctx.lineTo(x,y+28);
        ctx.lineTo(x+22,y+35);
        ctx.lineTo(x,y+32);
    ctx.fill();

    // Trunk
    ctx.fillStyle = "#000";
    ctx.beginPath();
        ctx.lineTo(x,y);
        ctx.lineTo(x+radius/4,y+30);
        ctx.lineTo(x,y+32);
        ctx.lineTo(x-radius/4,y+30);
    ctx.fill();


    ctx.fillStyle = tree.canopyFill;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,PI,0);
    ctx.fill();

    // Canopy
    for( var i = 0; i < 10; i++ ){
        var ranRad = tree.points[i],
            angle = i/10 * PI,
            xl = x + Math.cos(angle)*radius,
            yl = y + Math.sin(angle)*radius;

        ctx.beginPath();
        ctx.arc(xl,yl,ranRad,0,PI,0);
        ctx.fill();
    }

}

for(var i = 0; i < 1000; i++){
    trees[i] = {};
    trees[i].y = (i*10)+180;
    trees[i].x = Math.random()*canvas.width;
    trees[i].radius = Math.random()*12+2;
    trees[i].points = [];
    trees[i].canopyFill = "rgb("+(233+~~(Math.random()*20))+"," + (117+~~(Math.random()*100)) + ",18)";

    for( var p = 0; p < 5; p++ ){
        var ranRad = (Math.random() * trees[i].radius/ 2)+6;
        trees[i].points[p] = ranRad;
    }
}

function render(){
    ctx.fillStyle = "rgb(180,210,230)";
    ctx.fillRect(0,0,canvas.width,180);
    ctx.fillStyle = "#c77b1a";
    ctx.fillRect(0,180,canvas.width,canvas.height);

    for(var i = 0; i < trees.length; i++){
        trees[i].x-= 0.2 + (trees[i].y/300);
        if(trees[i].x <=-50){
            trees[i].x = canvas.width+50;
        }
        drawTree(trees[i]);
    }

    setTimeout(render, 20);
}

render();
