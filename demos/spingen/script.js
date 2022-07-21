const canvas = document.querySelector('canvas');
let main;

class Spr {
  constructor(x, y, angle, speed) {
    this.size = Math.random() * 2;
    this.x = x;
    this.y = y;
    this.z = 0;
    this.speed = speed;
    this.rad = (angle + (23 - Math.random() * 45)) * Math.PI / 180;
  }

  update(rot) {
    this.speed *= 0.98;
    this.x += this.speed * Math.cos(this.rad);
    this.y += this.speed * Math.sin(this.rad);
    this.z -= this.speed * Math.sin(this.rad);

    let x = this.x * Math.cos(rot) - this.y * Math.sin(rot);
    let y = this.y * Math.cos(rot) + this.x * Math.sin(rot);
    let z = this.z;

    this.x = x;
    this.y = y;

    const cosY = Math.cos(rot);
    const sinY = Math.sin(rot);

    x = this.x * cosY - this.z * sinY;
    z = this.z * cosY + this.x * sinY;

    this.x = x;
    this.z = z;

  }

  render(ctx, vpX, vpY, fL) {

    if (this.z > -fL) {
      const scale = fL / (fL + this.z);
      this.renderSize = scale + this.size;
      this.xPos = vpX + this.x * scale;
      this.yPos = vpY + this.y * scale;
    }

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, this.renderSize, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class Main {
  constructor(canvas, width, height) {
    this.vpY = width / 2;
    this.vpX = height / 2;
    this.focalLength = 500;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.height = height;
    this.width = width;
    this.entities = [];
    this.rot = 0;

    canvas.height = height;
    canvas.width = width;
  }

  addEntity(entity) {
    if (this.entities.length < 5000) {
      this.entities.push(entity);
    }
  }

  update() {
    requestAnimationFrame(() => {
      this.update();
    });
    this.rot = -0.003;

    const total = this.entities.length;
    let i = 0;
    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    while (i < total) {
      this.entities[i].update(this.rot);
      i++;
    }

    i = 0;

    while (i < total) {
      this.entities[i].render(this.ctx, this.vpY, this.vpX, this.focalLength);
      i++;
    }
  }
}

class Emitter {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.spawnTime = 100;
    this.timeStart = Date.now();
    this.timePassed = 0;
    this.lastSpawn = Date.now();
    this.thrust = 0.5;
    this.angle = 0;
  }

  update() {
    const rad = this.angle * Math.PI / 180;
    const speed = Math.min(Math.random() * this.thrust, 3);

    if (Date.now() > this.lastSpawn + this.spawnTime) {
      this.lastSpawn = Date.now();
      main.addEntity(new Spr(this.x, this.y, this.angle, speed));
    }

    this.x -= Math.cos(rad) * this.thrust;
    this.y -= Math.sin(rad) * this.thrust;
    this.thrust += 0.003;
    this.thrust = Math.min(this.thrust, 8);
    this.angle += 1.2;
    this.spawnTime -= 0.1;

  }

  render() {
    return;
  }
}

function create() {
  const canvas = document.querySelector('canvas');
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  main = new Main(canvas, width, height);
  main.addEntity(new Emitter(0, 0));

  main.update();
}


create();
