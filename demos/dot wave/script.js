const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

let shift = 0;

class Dot {
  constructor(x = 0, y = 0, yOff = 1, xOff = 1) {
    this.x = x;
    this.y = y;
    this.offset = (Math.max(yOff, xOff) / 4) - 1;
    this.size = 1;
  }

  update(val) {
    this.size = Math.abs(this.offset + val);
    this.hue = ((this.offset) * this.size);
  }
}

const dim = 16;
const xOffset = width / 4;
const yOffset = height / 4;
const spaceX = (xOffset * 2) / dim;
const spaceY= (yOffset * 2) / dim;
let dots = [];

for (let x = 0; x <= dim; x++) {
   for (let y = 0; y <= dim; y++) {
       dots.push(new Dot(xOffset + (x * spaceX), yOffset + (y * spaceY), spaceX, spaceY));
   }
}

function draw() {
  requestAnimationFrame(draw);
  ctx.reset();
	shift += 0.04;
  dots.forEach((dot, idx) => {
  	dot.update(Math.sin(idx + shift) * 3);
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
    ctx.fill();
  });

}

draw();
