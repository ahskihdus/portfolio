class PixelParticle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 4 + 2;
    this.speedY = -(Math.random() * 0.5 + 0.1);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.3 + 0.1;
    this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    this.life = Math.random() * 200 + 100;
    this.maxLife = this.life;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;

    if (this.life <= 0 || this.y < -10 || this.x < -10 || this.x > this.canvas.width + 10) {
      this.reset();
      this.y = this.canvas.height + 10;
    }
  }

  draw(ctx) {
    const fadeRatio = this.life / this.maxLife;
    ctx.globalAlpha = this.opacity * fadeRatio;
    ctx.fillStyle = this.color;
    ctx.fillRect(
      Math.round(this.x),
      Math.round(this.y),
      this.size,
      this.size
    );
  }
}

const PARTICLE_COLORS = [
  '#7C3AED', '#A78BFA', '#3B82F6',
  '#06B6D4', '#C4B5FD', '#5B21B6'
];

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 25000);
    particles = [];
    for (let i = 0; i < Math.min(count, 60); i++) {
      particles.push(new PixelParticle(canvas));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

document.addEventListener('DOMContentLoaded', initParticles);
