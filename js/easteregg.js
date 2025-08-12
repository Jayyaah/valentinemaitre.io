// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
(function () {
  const SEQ = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let pos = 0;

  // Helpers
  function applyRetro(on) {
    const html = document.documentElement;
    const body = document.body;
    html.classList.toggle('retro-mode', on);
    body.classList.toggle('retro-mode', on);
    localStorage.setItem('retro-mode', on ? '1' : '0');
    console.log('[retro]', on ? 'ON' : 'OFF');
  }

  // Restaure l’état au chargement (utile pour tester sur GitHub Pages)
  document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('retro-mode') === '1') applyRetro(true);
    // Expose des helpers pour tester depuis la console
    window.__retro_on = () => applyRetro(true);
    window.__retro_off = () => applyRetro(false);
    window.__retro_toggle = () => applyRetro(!document.documentElement.classList.contains('retro-mode'));
  });

  // Écoute clavier
  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === SEQ[pos]) {
      pos++;
      if (pos === SEQ.length) {
        applyRetro(!document.documentElement.classList.contains('retro-mode'));
        pos = 0;
      }
    } else {
      pos = (key === SEQ[0]) ? 1 : 0;
    }
  }, { passive: true });
})();
