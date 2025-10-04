// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Smooth scroll (z offsetem)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    const headerOffset = 72;
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  });
});

// Rok w stopce
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Auto-scroll the carousel so the emphasized image is centered on mobile load.
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.hero-gallery');
  if (!gallery || window.matchMedia('(min-width: 768px)').matches) return;

  const cards = gallery.querySelectorAll('.hg-card');
  if (cards.length < 2) return;

  const middle = cards[1];
  const center = middle.offsetLeft - (gallery.clientWidth - middle.offsetWidth) / 2;

  requestAnimationFrame(() => {
    gallery.scrollLeft = Math.max(0, center);
  });
});

