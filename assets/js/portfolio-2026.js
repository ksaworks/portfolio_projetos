(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.dataset.open = 'false';
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.dataset.open = String(!expanded);
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
})();


// A prévia do editor é apenas visual. Não executa Python nem faz requisições.
(() => {
  const panel = document.querySelector('[data-code-demo]');
  if (!panel) return;

  const replay = panel.querySelector('[data-code-replay]');
  const rows = [...panel.querySelectorAll('.code-source')];
  const parts = rows.map(row => [...row.childNodes].map(node => ({
    node,
    original: node.textContent || ''
  })));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let currentRun = 0;

  function restore() {
    rows.forEach((row, i) => {
      row.classList.remove('is-cursor');
      parts[i].forEach(part => { part.node.textContent = part.original; });
    });
  }

  function play() {
    currentRun += 1;
    const thisRun = currentRun;
    window.clearTimeout(timer);
    restore();
    if (motion.matches) return;

    parts.forEach(group => group.forEach(part => { part.node.textContent = ''; }));
    let rowIndex = 0;
    let partIndex = 0;
    let characterIndex = 0;

    function typeCharacter() {
      if (thisRun !== currentRun) return;
      if (rowIndex >= parts.length) {
        rows.forEach(row => row.classList.remove('is-cursor'));
        return;
      }

      const row = rows[rowIndex];
      row.classList.add('is-cursor');
      const group = parts[rowIndex];
      const part = group[partIndex];

      if (!part) {
        row.classList.remove('is-cursor');
        rowIndex += 1;
        partIndex = 0;
        characterIndex = 0;
        timer = window.setTimeout(typeCharacter, 115);
        return;
      }

      const content = part.original;
      if (characterIndex < content.length) {
        part.node.textContent += content[characterIndex++];
        timer = window.setTimeout(typeCharacter, content[characterIndex - 1] === ' ' ? 16 : 23);
      } else {
        partIndex += 1;
        characterIndex = 0;
        typeCharacter();
      }
    }
    typeCharacter();
  }

  replay.addEventListener('click', play);
  motion.addEventListener?.('change', () => {
    if (motion.matches) {
      currentRun += 1;
      window.clearTimeout(timer);
      restore();
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        play();
      }
    }, { threshold: 0.15 });
    observer.observe(panel);
  } else {
    play();
  }
})();
