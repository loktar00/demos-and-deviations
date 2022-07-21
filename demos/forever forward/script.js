const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;
ctx.lineWidth = "3";


class Segment {
  constructor(context, color, size) {
    this.size = size;
    this.color = color;
  }

  update() {
    if (this.size > maxSize) {
      this.size = 0;
    }

    this.x = width / 2 + (Math.sin(globalCount * 0.01) * 200);
    this.y = height / 2 + (Math.cos(globalCount * 0.025) * 80);

    this.size += 0.20;
  }

  render() {
    const { x, y, size, color } = this;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function render() {
  requestAnimationFrame(render);

  ctx.fillStyle = "rgba(0,0,0,0.03)";
  ctx.fillRect(0, 0, width, height);
  globalCount++;
  segments.forEach((segment) => {
    segment.update();
    segment.render();
  });
}

const gapSize = 25;
const segments = [];
let globalCount = 0;

let segmentSize = gapSize;
const maxSize = Math.max(width, height);

while (segmentSize <= maxSize) {
  const color = `hsl(${(segmentSize / maxSize) * 360}, 50%, 50%)`;
  segments.push(new Segment(ctx, color, segmentSize));
  segmentSize += gapSize;
}

render();
