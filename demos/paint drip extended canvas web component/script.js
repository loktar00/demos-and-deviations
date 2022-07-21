(function () {
  class Dot {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.init();
    }

    init() {
      this.x = Math.random() * this.width;
      this.size = 1 + Math.random() * 20;
      this.y = -this.size * 2;

      this.color = {
        h: Math.floor(Math.random() * 360),
        s: Math.floor(30 + Math.random() * 20),
        v: Math.floor(50 + Math.random() * 20)
      };

      this.speed = 0.1 + Math.random() * 0.5;
    }

    update() {
      this.y += this.speed;

      if (this.y > this.height) {
        this.init();
      }
    }
  }

  class PaintDrip extends HTMLCanvasElement {
    constructor() {
      super();
      const fullScreen = this.getAttribute("fullscreen") || false;
      const drips = this.getAttribute("drips") || 100;

      if (fullScreen) {
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight;
      }

      this.ctx = this.getContext("2d");
      this.dots = [];
      for (let i = 0; i < drips; i++) {
        this.dots.push(new Dot(this.width, this.height));
      }
      this.render();
    }

    render() {
      requestAnimationFrame(() => {
        this.render();
      });

      const { ctx } = this;
      this.dots.forEach((dot) => {
        dot.update();
        ctx.fillStyle = `hsl(${dot.color.h},${dot.color.s}% ,${
          dot.color.v + (dot.y / this.height) * 50
        }%)`;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur = 2;
        ctx.shadowColor = `hsl(${dot.color.h}, 40% ,${
          50 + (dot.y / this.height) * 50
        }%`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }

  window.customElements.define("paint-drip", PaintDrip, {
    extends: "canvas"
  });
})();
