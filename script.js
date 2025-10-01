// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  // Zamykaj po kliknięciu w link
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Smooth scroll (z drobnym offsetem dla sticky header)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        const headerOffset = 72;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  });
});

// Bieżący rok w stopce
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Karuzela zdjęć (vanilla)
(function initCarousel(){
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(setupCarousel);

  function setupCarousel(root){
    const track = root.querySelector('.carousel__track');
    const slides = Array.from(root.querySelectorAll('.carousel__slide'));
    const prev = root.querySelector('.carousel__btn.prev');
    const next = root.querySelector('.carousel__btn.next');
    const dotsWrap = root.querySelector('.carousel__dots');

    let index = 0;
    let autoTimer;

    // Dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Przejdź do slajdu ${i+1}`);
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    });

    function update(){
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dotsWrap.querySelectorAll('button').forEach((b, i) => {
        if (i === index) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    }

    function goTo(i){
      index = (i + slides.length) % slides.length;
      update();
      restartAuto();
    }
    function nextFn(){ goTo(index + 1); }
    function prevFn(){ goTo(index - 1); }

    if (next) next.addEventListener('click', nextFn);
    if (prev) prev.addEventListener('click', prevFn);

    // Swipe (prosty)
    let startX = 0, dx = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dx = 0; }, {passive:true});
    track.addEventListener('touchmove', e => { dx = e.touches[0].clientX - startX; }, {passive:true});
    track.addEventListener('touchend', () => {
      if (Math.abs(dx) > 50) (dx < 0 ? nextFn() : prevFn());
    });

    // Auto-rotacja
    function startAuto(){ autoTimer = setInterval(nextFn, 5000); }
    function stopAuto(){ clearInterval(autoTimer); }
    function restartAuto(){ stopAuto(); startAuto(); }
    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', startAuto);

    update();
    startAuto();
  }
})();