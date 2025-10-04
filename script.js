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

// Wolne miejsca — pobieranie i (opcjonalnie) tryb admin
(async function slots(){
  const params = new URLSearchParams(location.search);
  const isAdmin = params.get('admin') === '1';

  const BADGES = document.querySelectorAll('[data-slot]');
  if (!BADGES.length) {
    if (isAdmin) {
      alert('Tryb admin jest włączony, ale na tej stronie nie znaleziono żadnych liczników (data-slot). Upewnij się, że w grafiku są elementy <span class="badge" data-slot="...">.');
    }
    console.warn('[slots] Brak elementów [data-slot] na stronie.');
    return;
  }

  async function fetchJSON(url){
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  let data = null;
  try {
    data = await fetchJSON('api/slots.php?action=get');
  } catch (e) {
    console.warn('[slots] API niedostępne, próba wczytania data/slots.json. Powód:', e);
    try { data = await fetchJSON('data/slots.json'); }
    catch (e2) { console.error('[slots] Nie udało się pobrać danych slotów:', e2); }
  }
  if (!data) return;

  const map = new Map(Object.entries(data));
  BADGES.forEach(el => {
    const key = el.getAttribute('data-slot');
    const rec = map.get(key);
    if (!rec) { el.textContent = 'Wolne: —'; return; }
    const free = Math.max(0, (rec.capacity ?? 0) - (rec.booked ?? 0));
    el.textContent = `Wolne: ${free} / ${rec.capacity}`;
    if (free <= 2) el.style.background = '#fff3cd';
    if (free === 0) { el.style.background = '#ffe0e0'; el.style.color = '#991b1b'; }
  });

  if (isAdmin) {
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
        b.style.cssText = 'border:1px solid #d1d5db;border-radius:8px;padding:0 .5rem;height:28px;background:#fff;cursor:pointer;margin-left:4px';
      });
      wrap?.appendChild(minus); wrap?.appendChild(plus);

      async function send(delta){
        try{
          const res = await fetch('api/slots.php', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ token, key, delta })
          });
          const json = await res.json().catch(()=>({}));
          if (!res.ok) throw new Error(json?.error || 'Błąd zapisu');
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