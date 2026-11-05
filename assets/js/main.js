/* ═══════════════════════════════════════════════════════════
   Intesar Alam — Portfolio JavaScript
   Features: sticky nav, scroll spy, reveal animations,
             project filter, accordion toggle, mobile menu
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. HERO REVEAL (immediate) ─── */
  document.querySelectorAll('#hero .reveal-up').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });

  /* ─── 2. SCROLL-AWARE NAVBAR ─── */
  const navbar = document.getElementById('navbar');

  function updateNav() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ─── 3. SCROLL SPY — highlight active nav link ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');

  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.dataset.section === entry.target.id
          );
        });
      }
    });
  }, {
    rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-h').trim()} 0px -60% 0px`
  });

  sections.forEach(s => spyObserver.observe(s));

  /* ─── 4. REVEAL ON SCROLL ─── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Exclude hero (handled separately), observe all others
  document.querySelectorAll('.reveal-up:not(#hero .reveal-up)').forEach(el => {
    revealObserver.observe(el);
  });

  // Auto-apply reveal-up to key list items
  const autoRevealTargets = [
    '.pub-item', '.exp-item', '.lead-item',
    '.project-card', '.skill-group', '.cert-item'
  ];

  autoRevealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal-up')) {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${i * 0.07}s`;
        revealObserver.observe(el);
      }
    });
  });

  /* ─── 5. PROJECT FILTER ─── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const cat = card.dataset.cat || '';
        const show = filter === 'all' || cat.includes(filter);
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ─── 6. PROJECT ACCORDION ─── */
  document.querySelectorAll('.proj-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const details = btn.nextElementSibling;
      const isOpen  = details.classList.contains('open');

      details.classList.toggle('open', !isOpen);
      btn.classList.toggle('open', !isOpen);
      btn.textContent = isOpen
        ? 'Problem & Approach ↓'
        : 'Problem & Approach ↑';
    });
  });

  /* ─── 7. SHOW MORE PROJECTS ─── */
  const showMoreBtn = document.getElementById('show-more-projects');
  const additionalProjects = document.getElementById('additional-projects');

  if (showMoreBtn && additionalProjects) {
    showMoreBtn.addEventListener('click', () => {
      if (additionalProjects.style.display === 'none') {
        additionalProjects.style.display = 'block';
        showMoreBtn.textContent = 'Show Fewer Projects ↑';

        // Animate in
        additionalProjects.querySelectorAll('.add-proj-item').forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.transitionDelay = `${i * 0.06}s`;
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'none';
          });
        });
      } else {
        additionalProjects.style.display = 'none';
        showMoreBtn.textContent = 'Show Additional Projects ↓';
      }
    });
  }

  /* ─── 8. MOBILE HAMBURGER MENU ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinksMenu = document.getElementById('nav-links');

  if (hamburger && navLinksMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinksMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);

      // Animate hamburger to X
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -5px)';
      } else {
        spans.forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      }
    });

    // Close menu on link click
    navLinksMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }

  /* ─── 9. SMOOTH SCROLL for same-page anchors ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── 10. BLUEPRINT GRID PARALLAX (subtle) ─── */
  const blueprintGrid = document.querySelector('.blueprint-grid');
  if (blueprintGrid) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.3;
      blueprintGrid.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }


  /* ─── 11. STANDOUT LAYER ─── */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* 11a. Scroll progress line */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* 11b. Hero title block (engineering-drawing corner) */
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    const tb = document.createElement('div');
    tb.className = 'hero-titleblock';
    tb.setAttribute('aria-hidden', 'true');
    tb.innerHTML = [
      ['Drawn by', 'I. Alam'],
      ['Institute', 'GIKI · BS MechE'],
      ['Dwg no.', 'IA-2026-01'],
      ['Scale', '1 : 1'],
      ['Sheet', '1 of 1']
    ].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
    heroEl.appendChild(tb);
  }

  /* 11c. Count-up for numeric hero stats */
  document.querySelectorAll('.hero-stats .stat-n').forEach(el => {
    const txt = el.textContent.trim();
    if (!/^\d+$/.test(txt) || reduceMotion) return;
    const target = parseInt(txt, 10);
    el.textContent = '0';
    setTimeout(() => {
      const t0 = performance.now(), dur = 1100;
      const step = now => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 650);
  });

  /* 11d. Gears spin faster while scrolling, then settle back */
  if (!reduceMotion) {
    window.addEventListener('load', () => {
      const gears = document.getAnimations().filter(a => a.animationName === 'spin');
      if (!gears.length) return;
      let lastY = window.scrollY, rate = 1, boost = 1, running = false;
      const tick = () => {
        boost += (1 - boost) * 0.04;
        rate  += (boost - rate) * 0.1;
        gears.forEach(a => { a.playbackRate = rate; });
        if (Math.abs(rate - 1) > 0.01 || Math.abs(boost - 1) > 0.01) {
          requestAnimationFrame(tick);
        } else {
          gears.forEach(a => { a.playbackRate = 1; });
          running = false;
        }
      };
      window.addEventListener('scroll', () => {
        boost = Math.min(1 + Math.abs(window.scrollY - lastY) * 0.4, 9);
        lastY = window.scrollY;
        if (!running) { running = true; requestAnimationFrame(tick); }
      }, { passive: true });
    });
  }

  /* 11e. Hero mechanism drifts opposite the cursor (desktop only) */
  const mech = document.querySelector('.hero-mech');
  if (mech && heroEl && finePointer && !reduceMotion) {
    heroEl.addEventListener('mousemove', e => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mech.style.translate = `${(-x * 28).toFixed(1)}px ${(-y * 20).toFixed(1)}px`;
    });
    heroEl.addEventListener('mouseleave', () => { mech.style.translate = ''; });
  }

  /* 11f. Cursor-follow spotlight on cards */
  if (finePointer) {
    document.addEventListener('mousemove', e => {
      const card = e.target.closest && e.target.closest('.project-card, .skill-group, .lead-item, .cert-item');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

});
