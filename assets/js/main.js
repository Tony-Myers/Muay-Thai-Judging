(function () {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('nav.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Mark current page in nav (best-effort)
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('nav.primary-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
    if (href === current) a.setAttribute('aria-current', 'page');
  });
})();
