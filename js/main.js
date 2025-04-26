// js/main.js
import { updateContent, adjustLayout } from "./content.js";
import { isMobile, updateTitle } from "./utils.js";
import { bindEventListeners } from "./eventListeners.js";
import { initCarousel } from "./carousel.js";
import { initPopup } from "./popup.js";

document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    contentArea: document.querySelector(".content-area"),
    navLinks: document.querySelectorAll("nav a"),
    logoLink: document.querySelector(".logo-link"),
    popup: document.getElementById("carousel-popup"),
    closePopup: document.querySelector(".close-popup"),
    popupTitle: document.querySelector("#popup-title"),
    popupBody: document.querySelector("#popup-body"),
    logo: document.querySelector(".logo"),
    nav: document.querySelector("nav"),
  };

  const state = { currentContentHeight: 0 };

  // Wrap initial load and setup in an async IIFE
  (async () => {
    // Initial content load by calling updateContent
    const initialHash = window.location.hash || "#home";
    await updateContent(initialHash.substring(1) || 'home', elements, state, isMobile);

    // Bind event listeners
    bindEventListeners(
      elements,
      state,
      updateContent,
      adjustLayout,
      isMobile,
      initCarousel,
      initPopup
    );

    // Adjust layout and initialize carousel if needed
    adjustLayout(elements, state, isMobile);
    if (initialHash === "#music") {
      const showPopup = initPopup(elements);
      initCarousel(elements, showPopup);
    }

    // Update title based on initial hash
    updateTitle(initialHash.substring(1) || 'home');
  })();
});

// Preload carousel images
const preloadImages = [
  "/assets/vol0-cover.png",
  "/assets/rivers-of-bblon-cover.png",
  "/assets/tsns-cover.png",
  "/assets/willyou-cover.png",
  // Add your image paths here
];

function preload() {
  preloadImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Run on page load
window.addEventListener("load", preload);
