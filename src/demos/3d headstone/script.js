var b = document.body;
var c = document.getElementsByTagName('canvas')[0];
var a = c.getContext('2d');
document.body.clientWidth;


var ma = Math,
    si = ma.sin,
    co = ma.cos,
    ra = ma.random,
    perspective,
    points = [],
    setPoint = function(x,y,z,headstone){
        if(!z){return y.zp[2] - x.zp[2]}
        t = this;
        t.xp = x;
        t.yp = y;
        t.zp = z;
        t.x = [];
        t.y = [];
        t.z = [];
        t.h = headstone;
        return t;
    }

// Set width/height
perspective = c.width = c.height = 512;

// Sets up points for the cone
for (i=0; i <400; i+=2) {
    //an = .3925* i;
    //an2 = .3925 * (i+1);
    //angl = 1.256;
    var x = ra()*700-350,
        z = ra()*800-400,
        y = ra()*20;

    points[i] = new setPoint([x-y,x,x-y+2],[50,30-y+1,50],[z,z,z]);
    points[i+1] = new setPoint([x,x,x],[50,30-y+1,50],[z-y,z-20,z-y+2]);
}

//right
points[401] = new setPoint([10,-10,10],[-100,50,50],[-100,-100,-100],1);
points[402] = new setPoint([-10,10,-10],[-100,-100,50],[-100,-100,-100],1);

//front
points[403] = new setPoint([10,10,10],[-100,50,50],[50,50,-100],1);
points[404] = new setPoint([10,10,10],[-100,-100,50],[50,-100,-100],1);

//left
points[405] = new setPoint([10,-10,10],[-100,50,50],[50,50,50],1);
points[406] = new setPoint([-10,10,-10],[-100,-100,50],[50,50,50],1);

//back
points[407] = new setPoint([-10,-10,-10],[-100,50,50],[50,50,-100],1);
points[408] = new setPoint([-10,-10,-10],[-100,-100,50],[50,-100,-100],1);


for(p in a){
    a[p[0]+(p[6]||'')]=a[p];
}

// render loop
function render () {
    requestAnimationFrame(render);
     with(a) {
        fillStyle = "#b5ebf1"
        fc(0, 0, perspective, 256)
        fillStyle = "#573f00"
        fc(0, 256, perspective, perspective)
        points.sort(setPoint)
        for (i = 0; i < 409; i++) {

            var point = points[i],
                px = point?.xp,
                py = point?.yp,
                pz = point?.zp,
                cosY = co(.003),
                sinY = si(.003);
            if (point) {
                for(ve = 0; ve < 3; ve++){
                    point.xp[ve] = px[ve] * cosY - pz[ve] * sinY;
                    point.zp[ve] = pz[ve] * cosY + px[ve] * sinY;

                    scl = perspective / (perspective + pz[ve]);
                    point.x[ve] = 256 + px[ve] * scl;
                    point.y[ve] = 256 + py[ve] * scl;

                    l(~~point.x[ve],~~point.y[ve]); //lineTo
                    (point.h)?fillStyle = 'rgb(100,100,100)':fillStyle = 'rgb(0, ' + ~~(100+i/4) + ', 0)';
                    f();
                }
                ba();
            }

        }
     }
};

render();