(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const rustValue = document.getElementById('rustFps');
  const javaValue = document.getElementById('javaFps');
  const rustMeter = document.getElementById('rustMeter');
  const javaMeter = document.getElementById('javaMeter');
  const randomIn = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const updateFps = () => {
    const rust = randomIn(199, 203);
    const java = randomIn(68, 72);
    if (rustValue) rustValue.textContent = rust;
    if (javaValue) javaValue.textContent = java;
    if (rustMeter) rustMeter.style.width = `${rust / 203 * 100}%`;
    if (javaMeter) javaMeter.style.width = `${java / 203 * 100}%`;
  };
  updateFps();
  window.setInterval(updateFps, 1100);

  // Lightweight snowfall overlay. It never captures clicks and respects reduced motion.
  const snowCanvas = document.getElementById('snowfall');
  if (snowCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = snowCanvas.getContext('2d');
    let width = 0;
    let height = 0;
    let flakes = [];
    let frame = 0;
    const makeFlake = (randomY = true) => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -8,
      radius: Math.random() * 1.8 + 0.7,
      speed: Math.random() * 0.8 + 0.45,
      drift: Math.random() * 0.55 - 0.275,
      sway: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.38 + 0.28
    });
    const resizeSnow = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      snowCanvas.width = Math.round(width * dpr);
      snowCanvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(105, Math.max(38, Math.round(width / 13)));
      flakes = Array.from({ length: count }, () => makeFlake());
    };
    const drawSnow = () => {
      ctx.clearRect(0, 0, width, height);
      flakes.forEach(flake => {
        flake.sway += 0.012;
        flake.y += flake.speed;
        flake.x += flake.drift + Math.sin(flake.sway) * 0.22;
        if (flake.y > height + 8) Object.assign(flake, makeFlake(false));
        if (flake.x < -8) flake.x = width + 8;
        if (flake.x > width + 8) flake.x = -8;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242,247,255,${flake.alpha})`;
        ctx.fill();
      });
      frame = window.requestAnimationFrame(drawSnow);
    };
    resizeSnow();
    drawSnow();
    window.addEventListener('resize', resizeSnow, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) window.cancelAnimationFrame(frame);
      else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) drawSnow();
    });
  }
})();
