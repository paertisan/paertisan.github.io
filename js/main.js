// js/main.js
import { updateContent, adjustLayout, pages } from './content.js';
import { isMobile, updateThemeColor } from './utils.js';
import { bindEventListeners } from './eventListeners.js';
import { initCarousel } from './carousel.js';
import { initPopup } from './popup.js';

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    contentArea: document.querySelector('.content-area'),
    navLinks: document.querySelectorAll('nav a'),
    logoLink: document.querySelector('.logo-link'),
    popup: document.getElementById('carousel-popup'),
    closePopup: document.querySelector('.close-popup'),
    popupTitle: document.querySelector('#popup-title'),
    popupBody: document.querySelector('#popup-body'),
    logo: document.querySelector('.logo'),
    nav: document.querySelector('nav'),
  };

  const state = { currentContentHeight: 0 };

  // Initial content load
  const initialHash = window.location.hash || '#home';
  elements.contentArea.innerHTML = pages[initialHash] || pages['#home'];
  state.currentContentHeight = elements.contentArea.scrollHeight;
  elements.contentArea.style.height = `${state.currentContentHeight}px`;

  // Bind event listeners
  bindEventListeners(elements, state, updateContent, adjustLayout, isMobile, updateThemeColor);

  // Adjust layout and initialize carousel if needed
  adjustLayout(elements, state, isMobile);
  if (initialHash === '#music') {
    const showPopup = initPopup(elements);
    initCarousel(elements, showPopup);
  }

  if (isMobile()) {
    updateThemeColor('#f9f8f7');
  }
});