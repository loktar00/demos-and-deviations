const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = document.body.offsetHeight;

const gridSize = 5;

let canvasSize = Math.max(canvas.width, canvas.height);
canvasSize = gridSize * Math.round(canvasSize / gridSize);

let gridArray = Array(canvasSize / gridSize).fill(0).map(_ => Array(canvasSize / gridSize).fill(0));
const dataPoints = [];

for (let i = 0; i < 4; i++) {
  dataPoints.push({
    x: ~~(Math.random() * (canvasSize / gridSize)),
    y: ~~(Math.random() * (canvasSize / gridSize)),
    radius: 0
  });
}

function render() {
  requestAnimationFrame(render);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  const r = 0;
  const g = ~~(100 + Math.random() * 150);
  const b = ~~(100 + Math.random() * 150);
  ctx.fillStyle = `rgb(${r}, ${150}, ${200})`;

  gridArray = Array(canvasSize / gridSize).fill(0).map(_ => Array(canvasSize / gridSize).fill(0));
  dataPoints.forEach(filled => {
    if (filled.radius < canvasSize / gridSize * 1.5) {
      filled.radius++;
    } else {
      filled.radius = 0;
      filled.x = ~~(Math.random() * (canvasSize / gridSize));
      filled.y = ~~(Math.random() * (canvasSize / gridSize));
    }

    for (let deg = 0; deg <= 360; deg += 0.6) {

      const tx = Math.cos(deg) * filled.radius;
      const ty = Math.sin(deg) * filled.radius;
      const x = tx;
      const y = ty;
      const radians = Math.atan2(y, x);

      const px = filled.x - (filled.radius) * Math.cos(radians);
      const py = filled.y - (filled.radius) * Math.sin(radians);
      const gridX = gridSize * Math.round(px / gridSize);
      const gridY = gridSize * Math.round(py / gridSize);

      if (gridArray[gridX] !== undefined && gridArray[gridX][gridY] !== undefined) {
        gridArray[gridSize * Math.round(px / gridSize)][gridSize * Math.round(py / gridSize)] = 1;
      }
    }
  });

  gridArray.forEach((grid, xIndex) => {
    grid.forEach((el, yIndex) => {
      if (el) {
        ctx.fillRect(xIndex * gridSize, yIndex * gridSize, gridSize * gridSize, gridSize * gridSize);
      }
    });
  });
}

render();