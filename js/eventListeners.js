// js/eventListeners.js
export function bindEventListeners(
  elements,
  state,
  updateContent,
  adjustLayout,
  isMobile
) {
  const { navLinks, logoLink, popup, closePopup, popupBody } = elements;

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      // Remove 'active' class from all nav links
      navLinks.forEach(navLink => navLink.classList.remove('active'));

      // Add 'active' class to the clicked link
      link.classList.add('active');

      const href = link.getAttribute("href");
      updateContent(href, elements, state, isMobile);
    });
  });

  logoLink.addEventListener("click", (event) => {
    event.preventDefault();
    updateContent("#home", elements, state, isMobile);
  });

  closePopup.addEventListener("click", () => {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.style.display = "none";
      popupBody.innerHTML = ""; // Clear the popup content to stop the video
      const lastFocused = document.querySelector('[data-last-focused="true"]');
      if (lastFocused) {
        lastFocused.focus();
        delete lastFocused.dataset.lastFocused;
      }
    }, 300);
  });

  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup.click();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popup.classList.contains("show")) {
      closePopup.click();
    }
  });

  window.addEventListener("popstate", (event) => {
    updateContent(window.location.hash || "#home", elements, state, isMobile);
  });

  window.addEventListener("resize", () => {
    adjustLayout(elements, state, isMobile);
  });
}
