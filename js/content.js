// js/content.js
import { initCarousel } from "./carousel.js";
import { initPopup } from "./popup.js";
import { updateTitle } from "./utils.js";

export const pages = {
  "#home": `
    <div class="block-quote">
      <i>The <span class="highlight">Word</span> is my <span class="highlight">music</span></i>
    </div>
  `,
  "#about": `
    <div class="content-about text-body">
      <p><span class="highlight">Robert W. Rust</span> is a composer. His journey began quietly in a home without music.
      A transformative encounter with <span class="highlight">The Word</span>—The Divine Logos—ignited his artistic mission: <span class="highlight">to translate the sacred into sound.</span></p>
    </div>
  `,
  "#music": `
    <div class="music-carousel">
      <div class="carousel-container">
        <div class="carousel-prev"></div>
        <div class="carousel-track">
          <a href="#" class="carousel-item active" data-index="0" data-title="Vol. 0" data-type="album" data-asset="/assets/vol0-cover.png" data-spotify="https://open.spotify.com/album/0WfLbvhHHCECRfAMwyAjzD" data-applemusic="https://music.apple.com/us/album/vol-0/1790153891" data-youtubemusic="https://music.youtube.com/playlist?list=OLAK5uy_k5R_yKTcS0hHuu4Rkb29F_l1sn80Eplso" data-amazonmusic="https://music.amazon.com/albums/B0DSVVSLHM" data-tidal="https://listen.tidal.com/album/411252419">
            <img src="/assets/vol0-cover.png" alt="Vol. 0 Album Cover" class="carousel-image">
          </a>
          <a href="#" class="carousel-item" data-index="1" data-title="By the Rivers of Babylon" data-youtube-id="POOuNTrZLFs" data-type="video">
            <img src="/assets/rivers-of-bblon-cover.png" alt="By the Rivers of Babylon Album Cover" class="carousel-image">
          </a>
          <a href="#" class="carousel-item" data-index="2" data-title="Things Seen and Not Seen" data-youtube-id="XDFWQK8Jpy8" data-type="video">
            <img src="/assets/tsns-cover.png" alt="Things Seen and Not Seen Album Cover" class="carousel-image">
          </a>
          <a href="#" class="carousel-item" data-index="3" data-title="Will You..." data-youtube-id="oyePz-J7spw" data-type="video">
            <img src="/assets/willyou-cover.png" alt="Will You... Album Cover" class="carousel-image">
          </a>
        </div>
        <div class="carousel-next"></div>
      </div>
      <div class="carousel-dots"></div>
    </div>
  `,
  "#contact": `
    <div class="contact-section">
      <h2><i>If you want to get in touch, DM me on 𝕏, or send me an email!</i></h2>
      <p>info [at] rwrmusic [dot] com</p>
      <div class="contact-icons">
        <a href="https://x.com/rwalterrust" target="_blank" rel="noopener noreferrer" class="contact-link" aria-label="Follow on X">
          <svg viewBox="0 0 24 24" width="32" height="32" class="contact-icon">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"></path>
          </svg>
        </a>
        <a href="mailto:info@rwrmusic.com" class="contact-link" aria-label="Email info@rwrmusic.com">
          <svg viewBox="0 0 24 24" width="32" height="32" class="contact-icon">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"></path>
          </svg>
        </a>
      </div>
    </div>
  `,
};

export function updateContent(
  hash,
  elements,
  state,
  isMobile,
  updateThemeColor
) {
  const { contentArea, logo, nav, popup } = elements;
  if (!pages[hash]) {
    console.warn(`Hash ${hash} not found, defaulting to #home`);
    hash = "#home";
  }

  contentArea.classList.add("content-area--exit");

  setTimeout(() => {
    contentArea.innerHTML = pages[hash];
    contentArea.style.height = "auto";
    const newContentHeight = contentArea.scrollHeight;
    contentArea.style.height = `${state.currentContentHeight}px`;
    contentArea.offsetHeight; // Force reflow
    contentArea.style.height = `${newContentHeight}px`;
    state.currentContentHeight = newContentHeight;

    logo.style.transform = "none";
    nav.style.transform = "none";
    contentArea.classList.remove("content-area--exit");
    contentArea.classList.add("content-area--enter");

    setTimeout(() => {
      contentArea.classList.remove("content-area--enter");
      if (!isMobile()) {
        contentArea.style.height = "auto";
      }
    }, 300);

    if (hash === "#music") {
      const showPopup = initPopup(elements);
      initCarousel(elements, showPopup);
    }

    if (!popup.classList.contains("show")) {
      document.body.classList.remove("vol0-active");
      if (isMobile()) {
        updateThemeColor("#f9f8f7");
      }
    }
    updateTitle(hash);
  }, 300);
}

export function adjustLayout(elements, state, isMobile) {
  const { contentArea } = elements;
  contentArea.style.height = "auto";
  const newContentHeight = contentArea.scrollHeight;

  if (isMobile()) {
    contentArea.style.height = `${state.currentContentHeight}px`;
    contentArea.offsetHeight; // Force reflow
    contentArea.style.height = `${newContentHeight}px`;
  } else {
    contentArea.style.height = "auto";
  }
  state.currentContentHeight = newContentHeight;

  if (document.querySelector(".music-carousel")) {
    const showPopup = initPopup(elements);
    initCarousel(elements, showPopup);
  }
}
