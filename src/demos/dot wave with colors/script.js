const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

let hue = 0;
let shift = 0;
let roll = 0;

class Dot {
  constructor(x = 0, y = 0, yOff = 1, xOff = 1) {
    this.x = x;
    this.y = y;
    this.offset = (Math.max(yOff, xOff) / 4) - 1;
    this.size = 1;
    this.hue = 0;
  }

  update(val, mod) {
    this.size = Math.abs(this.offset + val);
    this.hue = (2 * this.size * -4) + mod * 2;
  }
}

const dim = 16;
const xOffset = width / 4;
const yOffset = height / 4;
const spaceX = (xOffset * 2) / dim;
const spaceY = (yOffset * 2) / dim;
let dots = [];

for (let x = 0; x <= dim; x++) {
  for (let y = 0; y <= dim; y++) {
    dots.push(new Dot(xOffset + (x * spaceX), yOffset + (y * spaceY), spaceX, spaceY));
  }
}

function draw() {
  requestAnimationFrame(draw);
  ctx.reset();
  shift += 0.08;
  roll += 0.001;
  dots.forEach((dot, idx) => {
    dot.update(Math.sin((idx + shift) * Math.cos(roll * 0.1)) * 5, Math.cos(shift));
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
    ctx.fillStyle = `hsl(${dot.hue}, 86%, 30%)`;
    ctx.fill();
  });

}

draw();
