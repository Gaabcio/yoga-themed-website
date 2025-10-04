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

document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Toggle mobile menu
  function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      navMenu.classList.toggle('active');
    }
  }

  // Run on load and on resize
  toggleMobileMenu();
  window.addEventListener('resize', toggleMobileMenu);

  // Center hero image on mobile
  function centerHeroImage() {
    if (window.matchMedia('(max-width: 767px)').matches) {
      const gallery = document.querySelector('.hero-gallery');
      const middleCard = gallery.querySelector('.hg-card--emph');
      if (gallery && middleCard) {
        const scrollTarget = middleCard.offsetLeft - (gallery.offsetWidth - middleCard.offsetWidth) / 2;
        gallery.scrollTo({
          left: scrollTarget,
          behavior: 'auto'
        });
      }
    }
  }

  // Run after all content (including images) is loaded
  window.addEventListener('load', centerHeroImage);
  window.addEventListener('resize', centerHeroImage);

  // Back to top button visibility
  const backToTopButton = document.querySelector('.back-to-top');

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
  }

  // Scrollspy for navigation links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav .nav-menu a[href^="#"]');
  const headerHeight = document.querySelector('.site-header').offsetHeight;

  function updateActiveLink() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + headerHeight + 60;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSectionId = section.id;
      }
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1) {
      currentSectionId = sections[sections.length - 1].id;
    }

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Set initial state on load

  // Workshop carousel functionality
  const prevBtn = document.querySelector('.ws-btn.prev');
  const nextBtn = document.querySelector('.ws-btn.next');
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      const gallery = document.querySelector('.hero-gallery');
      if (gallery) {
        gallery.scrollLeft -= 300;
      }
    });
    nextBtn.addEventListener('click', () => {
      const gallery = document.querySelector('.hero-gallery');
      if (gallery) {
        gallery.scrollLeft += 300;
      }
    });
  }
});

