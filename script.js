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

});

// Warsztaty — ładowanie zdjęć i w pełni działający slider z automatem i aspect-ratio
(function() {
  const track = document.querySelector('.ws-track');
  const viewport = document.querySelector('.ws-viewport');
  const prevBtn = document.querySelector('.ws-btn.prev');
  const nextBtn = document.querySelector('.ws-btn.next');
  if (!track || !viewport) return;
  const imageCount = 27; // Zmień na liczbę zdjęć w folderze
  let slidesHtml = '';
  for (let i = 1; i <= imageCount; i++) {
    slidesHtml += `<figure class="ws-slide"><img src="pictures/lessons/zdjecie (${i}).jpg" alt="Warsztat — ${i}"></figure>`;
  }
  track.innerHTML = slidesHtml;

  const slides = Array.from(track.children);
  let current = 0;
  let interval = null;

  function isMobile() {
    return window.innerWidth <= 700;
  }

  function getCurrentIndex() {
    if (isMobile()) {
      const slideWidth = viewport.offsetWidth;
      return Math.round(viewport.scrollLeft / slideWidth);
    } else {
      return current;
    }
  }

  function goToSlide(idx) {
    current = (idx + slides.length) % slides.length;
    const imgs = track.querySelectorAll('img');
    const img = imgs[current];
    if (isMobile()) {
      const slideWidth = viewport.offsetWidth;
      viewport.scrollTo({ left: slideWidth * current, behavior: 'smooth' });
    } else {
      track.style.transform = 'translateX(-' + (100 * current) + '%)';
    }
  }

  function nextSlide() {
    current = getCurrentIndex();
    goToSlide(current + 1);
  }
  function prevSlide() {
    current = getCurrentIndex();
    goToSlide(current - 1);
  }

  function startAuto() {
    if (interval) { clearInterval(interval); }
    interval = setInterval(nextSlide, 2500);
  }
  function stopAuto() {
    if (interval) { clearInterval(interval); }
  }

  window.addEventListener('resize', function() { goToSlide(current); });
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);
  viewport.addEventListener('touchstart', stopAuto);
  viewport.addEventListener('touchend', startAuto);
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
  }

  // Synchronizuj current z aktualnym slajdem przy scrollu na mobile
  viewport.addEventListener('scroll', function() {
    if (isMobile()) {
      current = getCurrentIndex();
    }
  });

  goToSlide(0);
  startAuto();
})();

