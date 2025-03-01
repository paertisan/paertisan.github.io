// js/eventListeners.js
export function bindEventListeners(elements, state, updateContent, adjustLayout, isMobile, updateThemeColor) {
  const { navLinks, logoLink, popup, closePopup } = elements;

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      updateContent(href, elements, state, isMobile, updateThemeColor);
    });
  });

  logoLink.addEventListener('click', (event) => {
    event.preventDefault();
    updateContent('#home', elements, state, isMobile, updateThemeColor);
    if (isMobile()) {
      updateThemeColor('#f9f8f7');
    }
  });

  closePopup.addEventListener('click', () => {
    popup.classList.remove('show');
    setTimeout(() => {
      popup.style.display = 'none';
      document.body.classList.remove('vol0-active');
      if (isMobile()) {
        updateThemeColor('#f9f8f7');
      }
      const lastFocused = document.querySelector('[data-last-focused="true"]');
      if (lastFocused) {
        lastFocused.focus();
        delete lastFocused.dataset.lastFocused;
      }
    }, 300);
  });

  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      closePopup.click();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup.classList.contains('show')) {
      closePopup.click();
    }
  });

  window.addEventListener('popstate', (event) => {
    updateContent(window.location.hash || '#home', elements, state, isMobile, updateThemeColor);
    if (isMobile()) {
      updateThemeColor('#f9f8f7');
    }
  });

  window.addEventListener('resize', () => {
    adjustLayout(elements, state, isMobile);
  });
}