


			var b = document.body;
			var c = document.getElementsByTagName('canvas')[0];
			var a = c.getContext('2d');
			document.body.clientWidth; // fix bug in webkit: http://qfox.nl/weblog/218

			var ma = Math,
				si = ma.sin,
				co = ma.cos,
				ra = ma.random,
				perspective,
				size = 16,
				size1 = size+1,
				angle = 0,
				angle2 = 180,
				W = 0,
				H = 0,
				points = [],
				setPoint = function(x,y,z,c,nodes){
					if(!z){return y.zp[3] - x.zp[3]}
					t = this;
					t.xp = x;
					t.yp = y;
					t.zp = z;
					t.x = t.y = t.z = 0;
					t.c = c;
					t.nodes = nodes;
					return t;
				}

			with(c){
				with(style)width=(W=innerWidth-9)+"px",height=(H=innerHeight-25)+"px";
			}
			// Set width/height
			perspective = 256;

			for (i=0; i <size; i++) {
				for (j=0; j<size; j++) {
					var x = -500 + i * 80,
						z = 10 + j * 80,
						y = 100;//+ra()*30;
						points[j * size1 + i] = new setPoint(x,y,z,[0,10+i*15,40+j*20],[((j+1) * size1)+i,(j+1) * size1+(i+1),(j * size1)+(i+1)]);
				}
			}

			for(p in a){
				a[p[0]+(p[6]||'')]=a[p];
			}

			// render loop
			setInterval(function () {
				 with(a) {
					fillStyle = "rgba(0,0,0,0.1)"
					fc(0, 0, W, H)

					//points.sort(setPoint)

					//for (i = 0; i < points.length; i++) {
					for (j=0; j <size; j++) {
						for (i=0; i<size; i++) {
							var point = points[j * size1 + i],
								px = point.xp,
								py = point.yp,
								pz = point.zp,
								color = point.c,
								cosY = co(.03),
								sinY = si(.03);

							//point.xp = px * 1 - pz * .01;
							//point.zp = pz * 1 + px * .01;
							//point.yp[ve] = py[ve] * cosY - pz[ve] * sinY,
							//point.zp[ve] = pz[ve] * cosY + py[ve] * sinY;
							scl = perspective / (perspective + pz);
							point.x= 128 + px * scl;
							point.y = 64 + py * scl;

							m(~~point.x,~~point.y);

							for(ve = 0; ve < 3; ve++){
								if(points[point.nodes[ve]] !== undefined && points[point.nodes[ve]] !== undefined){
									l(~~points[point.nodes[ve]].x,~~points[point.nodes[ve]].y);
								}
							}
							l(~~point.x,~~point.y);
							a(~~point.x,~~point.y,scl*4,0,ma.PI*2,true);
							fillStyle = 'rgb(' + ~~(color[0]) + ',' + ~~(color[1]) + ',' + ~~(color[2]) + ')';
							f();
							ba();
						}
					}

					for (i=0; i <size; i++) {
						for (j=0; j<size; j++) {
						angle+=.0007;
							points[j * size1 + i].yp +=  si(angle+i+j);
						}
					}
				 }
			}, 10);
