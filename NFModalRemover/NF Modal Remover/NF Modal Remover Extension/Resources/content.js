// Only ever injected on the sites listed in the popup.
(() => {
  if (globalThis.__nfModalRemover) return; // already running in this frame
  globalThis.__nfModalRemover = true;

  const SELECTOR = '.nf-modal';

  // 1) Hide it with CSS straight away: no flash, no cost.
  const style = document.createElement('style');
  style.textContent = `${SELECTOR} { display: none !important; }`;
  (document.head || document.documentElement).appendChild(style);

  // Modals often lock scrolling on <html>/<body>; undo that after removal.
  const unlockScroll = () => {
    for (const el of [document.documentElement, document.body]) {
      if (el && getComputedStyle(el).overflow === 'hidden') {
        el.style.setProperty('overflow', 'visible', 'important');
      }
    }
  };

  // 2) Remove it from the page entirely.
  const sweep = () => {
    const found = document.querySelectorAll(SELECTOR);
    if (!found.length) return;
    found.forEach((e) => e.remove());
    unlockScroll();
  };

  // 3) Watch for it appearing later. Event-driven, at most one check per frame.
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      sweep();
    });
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });

  sweep();
})();
