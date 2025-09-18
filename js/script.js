/* =========================================================
   Minimal interactivity: mobile nav, active link, header scroll, reveal
   ========================================================= */

(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-nav');
  const root = document.documentElement;

  // --- Mobile menu toggle ---
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      // Allow body scroll lock if you want (optional):
      root.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked (mobile)
    nav.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        root.style.overflow = '';
      }
    });
  }

  // --- Add a shadow/border when scrolled ---
  const onScroll = () => {
    if (window.scrollY > 2) {
      header && header.classList.add('is-scrolled');
    } else {
      header && header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mark active nav link by current file name ---
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    // Normalize index route
    const isActive =
      (current === '' && href.includes('index.html')) ||
      href.toLowerCase().endsWith(current) ||
      (current === 'index.html' && href.toLowerCase().endsWith('index.html'));
    if (isActive) link.setAttribute('aria-current', 'page');
  });

  // --- IntersectionObserver for reveal animations ---
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  } else {
    // Fallback: make all reveal elements visible immediately
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }
})();
