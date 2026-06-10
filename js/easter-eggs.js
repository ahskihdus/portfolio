document.addEventListener('DOMContentLoaded', () => {
  initKonamiCode();
  initTerminalMode();
  initKeyboardHints();
});

/* ─── Konami Code ─── */
function initKonamiCode() {
  const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === sequence[pos]) {
      pos++;
      if (pos === sequence.length) {
        pos = 0;
        triggerPixelConfetti();
        showAchievement('KONAMI CODE', 'You found the secret code!');
      }
    } else {
      pos = 0;
    }
  });
}

function triggerPixelConfetti() {
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#7C3AED', '#3B82F6', '#06B6D4', '#A78BFA', '#F59E0B', '#10B981'];
  const particles = [];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15 - 5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.3,
      life: 120
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      if (p.life <= 0) return;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life--;

      ctx.globalAlpha = p.life / 120;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    });

    ctx.globalAlpha = 1;
    if (alive) requestAnimationFrame(animate);
  }

  animate();
}

/* ─── Terminal Mode ─── */
function initTerminalMode() {
  let buffer = '';

  document.addEventListener('keypress', (e) => {
    if (document.querySelector('.terminal-overlay.active')) return;
    buffer += e.key;
    if (buffer.length > 10) buffer = buffer.slice(-10);
    if (buffer.includes('sudo')) {
      buffer = '';
      openTerminal();
    }
  });
}

function openTerminal() {
  let overlay = document.querySelector('.terminal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'terminal-overlay';
    overlay.innerHTML = `
      <div class="terminal-header">
        <span>sudhiksha@portfolio:~$</span>
        <button class="terminal-close" onclick="closeTerminal()">EXIT</button>
      </div>
      <div class="terminal-body">
Welcome to Sudhiksha's Terminal v1.0
=====================================

Available commands:
  help       - Show available commands
  about      - About Sudhiksha
  skills     - List skills
  projects   - List projects
  contact    - Contact info
  clear      - Clear terminal
  exit       - Close terminal
  neofetch   - System info

Type a command below:
      </div>
      <div class="terminal-input-line">
        <span class="terminal-prompt">$</span>
        <input type="text" class="terminal-input" autofocus>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  overlay.classList.add('active');
  showAchievement('TERMINAL UNLOCKED', 'You found the hidden terminal!');

  const input = overlay.querySelector('.terminal-input');
  input.focus();
  input.addEventListener('keydown', handleTerminalInput);
}

function closeTerminal() {
  const overlay = document.querySelector('.terminal-overlay');
  if (overlay) overlay.classList.remove('active');
}

function handleTerminalInput(e) {
  if (e.key !== 'Enter') return;

  const input = e.target;
  const cmd = input.value.trim().toLowerCase();
  const body = document.querySelector('.terminal-body');
  input.value = '';

  body.textContent += `\n$ ${cmd}\n`;

  const commands = {
    help: 'Commands: help, about, skills, projects, contact, clear, exit, neofetch',
    about: 'Sudhiksha Sadige\nHonors CS Major @ University of Oklahoma\nMinors: Data Analytics & MIS\nCertificate: Data Science\nPresident, AI/ML Club\n\nPassionate about Software Engineering, AI/ML,\nCybersecurity, and emerging tech.',
    skills: 'Languages: Java, Python, C, C++, HTML/CSS, JavaScript,\n          TypeScript, SQL, PHP\nTools: Git, GitHub, VS Code, Microsoft Office, Cerner,\n       SharePoint, Eclipse, Adobe, Wireshark, L2L, Power BI\nAreas: Software Dev, Cybersecurity, Data Analytics, AI/ML',
    projects: '1. Timestamp - 2D historical era game\n2. Seed Vault - Indigenous document archive\n3. CANSEC CTF - 2nd place finish\n4. AI/ML Club Website - Club web presence\n5. Refined Vehicles - BPA competition website\n6. Data Analytics Projects - Analysis & visualization',
    contact: 'GitHub:   github.com/ahskihdus\nLinkedIn: linkedin.com/in/sudhiksha-sadige\nEmail:    ssadige14115@gmail.com',
    clear: '__CLEAR__',
    exit: '__EXIT__',
    neofetch: `
  ████████  sudhiksha@portfolio
  ██    ██  ──────────────────
  ████████  OS: Portfolio v1.0
  ██        Host: GitHub Pages
  ██        Shell: pixel-bash
              Theme: Retro Pixel (Light)
              Icons: Pixel Art
              Terminal: CSS Terminal
              CPU: Creativity @ 100%
              Memory: Full of ideas`,
  };

  if (cmd === '') return;

  const result = commands[cmd];
  if (result === '__CLEAR__') {
    body.textContent = 'Terminal cleared.\n';
  } else if (result === '__EXIT__') {
    closeTerminal();
  } else if (result) {
    body.textContent += result + '\n';
  } else {
    body.textContent += `Command not found: ${cmd}. Type "help" for available commands.\n`;
  }

  body.scrollTop = body.scrollHeight;
}

/* ─── Keyboard hints ─── */
function initKeyboardHints() {
  document.addEventListener('keydown', (e) => {
    if (e.key === '?') {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
      showAchievement('KEYBOARD SHORTCUTS', 'Konami Code: ↑↑↓↓←→←→BA | Terminal: type "sudo" | ? = this hint');
    }
  });
}

/* ─── Achievement toast ─── */
function showAchievement(title, description) {
  let toast = document.querySelector('.achievement-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'achievement-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<h4><span class="pixel-star"></span> ${title}</h4><p>${description}</p>`;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 4000);
}

window.closeTerminal = closeTerminal;
