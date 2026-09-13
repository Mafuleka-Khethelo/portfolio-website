(function () {
  document.documentElement.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;

  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.style.setProperty('--d', (i % 8) * 70 + 'ms');
  });

  document.querySelectorAll('.marquee-track').forEach((track) => {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  if (!reduce && fine) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    document.body.classList.add('has-cursor');
    let x = 0, y = 0, rx = 0, ry = 0;
    window.addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
    });
    (function loop() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('pointerenter', () => document.body.classList.add('cursor-hot'));
      el.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hot'));
    });
  }
})();
