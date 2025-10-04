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

// Warsztaty — prosta karuzela
(function workshopsCarousel(){
  const viewport = document.querySelector('.ws-viewport');
  const track = document.querySelector('.ws-track');
  const prev = document.querySelector('.ws-btn.prev');
  const next = document.querySelector('.ws-btn.next');
  if (!viewport || !track) return;
  let index = 0;
  const slides = Array.from(track.children);
  function update(){ track.style.transform = `translateX(-${index * 100}%)`; }
  function go(delta){ index = (index + delta + slides.length) % slides.length; update(); }
  prev && prev.addEventListener('click', () => go(-1));
  next && next.addEventListener('click', () => go(1));
})();

// Wolne miejsca — pobieranie i wyświetlanie
(async function slots(){
  const BADGES = document.querySelectorAll('[data-slot]');
  if (!BADGES.length) return;

  async function fetchJSON(url){
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  let data = null;
  try {
    // Najpierw próbuj przez PHP API
    data = await fetchJSON('api/slots.php?action=get');
  } catch {
    // Fallback do statycznego pliku (do podmiany ręcznej lub jeśli PHP nie działa)
    try { data = await fetchJSON('data/slots.json'); } catch {}
  }
  if (!data) return;

  const map = new Map(Object.entries(data)); // key -> {capacity, booked}
  BADGES.forEach(el => {
    const key = el.getAttribute('data-slot');
    const rec = map.get(key);
    if (!rec) { el.textContent = 'Wolne: —'; return; }
    const free = Math.max(0, (rec.capacity ?? 0) - (rec.booked ?? 0));
    el.textContent = `Wolne: ${free} / ${rec.capacity}`;
    if (free <= 2) el.style.background = '#fff3cd'; // soft warning
    if (free === 0) { el.style.background = '#ffe0e0'; el.style.color = '#991b1b'; }
  });

  // Tryb admin: ?admin=1 — pokaż przyciski +/- i aktualizuj przez PHP z tokenem
  const params = new URLSearchParams(location.search);
  if (params.get('admin') === '1') {
    const token = prompt('Podaj token administracyjny (ustawiony w api/slots.php):');
    if (!token) return;

    BADGES.forEach(el => {
      const key = el.getAttribute('data-slot');
      const wrap = el.parentElement;
      const minus = document.createElement('button');
      const plus = document.createElement('button');
      minus.textContent = '−'; plus.textContent = '+';
      [minus, plus].forEach(b => {
        b.type = 'button';
        b.style.cssText = 'border:1px solid #d1d5db;border-radius:8px;padding:0 .5rem;height:28px;background:#fff;cursor:pointer';
      });
      wrap?.appendChild(minus); wrap?.appendChild(plus);

      async function send(delta){
        try{
          const res = await fetch('api/slots.php', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ token, key, delta })
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json?.error || 'Błąd');
          // odśwież badge
          const rec = json[key];
          const free = Math.max(0, (rec.capacity ?? 0) - (rec.booked ?? 0));
          el.textContent = `Wolne: ${free} / ${rec.capacity}`;
        } catch (e){
          alert('Nie udało się zaktualizować: ' + e.message);
        }
      }
      minus.addEventListener('click', () => send(-1));
      plus.addEventListener('click', () => send(+1));
    });
  }
})();