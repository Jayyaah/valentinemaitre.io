// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
(function () {
  const konami = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let position = 0;

  // Préparer un bip sonore rétro
  const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konami[position]) {
      position++;
      if (position === konami.length) {
        // Active/désactive le mode rétro
        document.body.classList.toggle('retro-mode');

        // Joue le bip
        beep.currentTime = 0; // reset si on spamme
        beep.play().catch(() => {
          console.warn("Le bip n'a pas pu être joué (peut-être bloqué par le navigateur).");
        });

        position = 0;
      }
    } else {
      position = (key === konami[0]) ? 1 : 0;
    }
  }, { passive: true });
})();
