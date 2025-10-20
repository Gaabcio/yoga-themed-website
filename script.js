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
})();

// Modal dla galerii zdjęć
(function() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.querySelector('.modal-close');
  const prevBtn = document.querySelector('.modal-arrow--prev');
  const nextBtn = document.querySelector('.modal-arrow--next');
  
  let allImages = [];
  let currentIndex = 0;

  // Zbierz wszystkie zdjęcia z galerii
  function updateImagesList() {
    allImages = Array.from(document.querySelectorAll('.gallery-grid img'));
  }

  // Pokaż zdjęcie o danym indeksie z animacją przesuwania
  function showImage(index, direction) {
    if (index < 0 || index >= allImages.length) return;

    if (typeof direction === 'string') {
      // Tworzymy nowy obrazek do animacji
      const newImg = document.createElement('img');
      newImg.className = 'modal-content animating';
      newImg.src = allImages[index].src;
      newImg.alt = allImages[index].alt;
      // newImg.style.position = 'absolute';
      // newImg.style.top = '0';
      newImg.style.left = direction === 'left' ? '-100%' : '100%';
      newImg.style.width = '100%';
      newImg.style.transition = 'left 0.35s';

      // Stary obrazek
      modalImg.style.position = 'absolute';
      modalImg.style.left = '0';
      modalImg.style.transition = 'left 0.35s';

      // Dodaj nowy obrazek do modalu
      modalImg.parentNode.appendChild(newImg);

      // Wywołaj animację
      setTimeout(() => {
        modalImg.style.left = direction === 'left' ? '100%' : '-100%';
        newImg.style.left = '0';
      }, 10);

      // Po animacji podmień obrazek
      setTimeout(() => {
        modalImg.src = newImg.src;
        modalImg.alt = newImg.alt;
        modalImg.style.position = '';
        modalImg.style.left = '';
        modalImg.style.transition = '';
        newImg.remove();
        modalCaption.textContent = allImages[index].alt;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === allImages.length - 1;
        currentIndex = index;
      }, 360);
    } else {
      // Bez animacji, normalnie
      modalImg.src = allImages[index].src;
      modalImg.alt = allImages[index].alt;
      modalCaption.textContent = allImages[index].alt;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === allImages.length - 1;
      currentIndex = index;
    }
  }

  // Dodaj event listener do wszystkich zdjęć w galeriach
  function attachImageListeners() {
    updateImagesList();
    allImages.forEach((img, index) => {
      img.addEventListener('click', function() {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        showImage(index);
      });
    });
  }

  // Inicjalizacja
  attachImageListeners();

  // Poprzednie zdjęcie
  prevBtn.addEventListener('click', function() {
    if (currentIndex > 0) {
      showImage(currentIndex - 1, 'left');
    }
  });

  // Następne zdjęcie
  nextBtn.addEventListener('click', function() {
    if (currentIndex < allImages.length - 1) {
      showImage(currentIndex + 1, 'right');
    }
  });

  // Zamknij modal
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  // Zamknij po kliknięciu poza zdjęciem
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Obsługa klawiatury
  document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      if (currentIndex > 0) showImage(currentIndex - 1, 'left');
    } else if (e.key === 'ArrowRight') {
      if (currentIndex < allImages.length - 1) showImage(currentIndex + 1, 'right');
    }
  });

  // Aktualizuj listę zdjęć gdy otwierają się nowe galerie
  document.querySelectorAll('.gallery-group').forEach(group => {
    group.addEventListener('toggle', function() {
      if (this.open) {
        setTimeout(attachImageListeners, 100);
      }
    });
  });

  let touchStartX = null;
  let touchEndX = null;

  // Dodaj obsługę swipe w modalu
  modal.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
    }
  });

  modal.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) {
      touchEndX = e.touches[0].clientX;
    }
  });

  modal.addEventListener('touchend', function(e) {
    if (touchStartX !== null && touchEndX !== null) {
      const deltaX = touchEndX - touchStartX;
      if (Math.abs(deltaX) > 50) { // minimalny dystans do uznania za swipe
        if (deltaX > 0 && currentIndex > 0) {
          showImage(currentIndex - 1, 'left'); // swipe w prawo — poprzednie
        } else if (deltaX < 0 && currentIndex < allImages.length - 1) {
          showImage(currentIndex + 1, 'right'); // swipe w lewo — następne
        }
      }
    }
    touchStartX = null;
    touchEndX = null;
  });
})();