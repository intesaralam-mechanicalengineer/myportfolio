/* Project carousel: scroll-snap track + prev/next buttons + counter.
   Works with the existing category filters (main.js hides non-matching cards). */
(() => {
  const track = document.querySelector('.projects-grid');
  const prev = document.getElementById('proj-prev');
  const next = document.getElementById('proj-next');
  const count = document.getElementById('proj-count');
  if (!track || !prev || !next || !count) return;

  track.setAttribute('tabindex', '0');
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Featured projects. Scroll horizontally to browse.');

  const visible = () => [...track.querySelectorAll('.project-card')].filter(c => c.style.display !== 'none');
  const step = () => {
    const c = visible()[0];
    return c ? c.getBoundingClientRect().width + 24 : 320;
  };

  function update() {
    const n = visible().length;
    const i = Math.min(n, Math.round(track.scrollLeft / step()) + 1);
    count.textContent = n ? `${i} / ${n}` : '0 / 0';
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  }

  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  document.querySelectorAll('.filter-btn').forEach(b =>
    b.addEventListener('click', () => { track.scrollLeft = 0; requestAnimationFrame(update); }));
  update();
})();
