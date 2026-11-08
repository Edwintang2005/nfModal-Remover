// ==UserScript==
// @name         Remove nf-modal
// @description  Hides and removes .nf-modal overlays the moment they appear
// @version      1.0
// @run-at       document-start
// --- List your sites below, one @match per line ---
// @match        *://example.com/*
// @match        *://*.example.com/*
// ==/UserScript==

(() => {
  const SELECTOR = '.nf-modal';

  // 1) Hide it with CSS straight away. This works before any JS sees the
  //    modal, so there's no flash, and it costs nothing.
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

  // 2) Remove it from the page entirely (your original command).
  const sweep = () => {
    const found = document.querySelectorAll(SELECTOR);
    if (!found.length) return;
    found.forEach((e) => e.remove());
    unlockScroll();
  };

  // 3) Watch for it being added later (or a class being switched on).
  //    Event-driven, no polling; batched to at most one check per frame.
  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      sweep();
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });

  sweep();
})();
