// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
(function () {
  const SEQ = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let pos = 0;

  // Fonction bip
  function playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 800; // Hz
      gain.gain.setValueAtTime(0.05, ctx.currentTime); // volume bas
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15); // durée 150 ms
    } catch (err) {
      console.warn('Audio non supporté', err);
    }
  }

  function applyRetro(on) {
    const html = document.documentElement;
    const body = document.body;
    html.classList.toggle('retro-mode', on);
    body.classList.toggle('retro-mode', on);
    localStorage.setItem('retro-mode', on ? '1' : '0');
    console.log('[retro]', on ? 'ON' : 'OFF');
  }

  // Restaurer l’état au chargement
  document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('retro-mode') === '1') applyRetro(true);
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
        const isActive = !document.documentElement.classList.contains('retro-mode');
        applyRetro(isActive);
        playBeep();
        pos = 0;
      }
    } else {
      pos = (key === SEQ[0]) ? 1 : 0;
    }
  }, { passive: true });
})();
