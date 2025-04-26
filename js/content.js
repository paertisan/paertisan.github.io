// js/content.js
import { initCarousel } from "./carousel.js";
import { initPopup } from "./popup.js";
import { updateTitle } from "./utils.js";

// Helper function to fetch content
async function fetchContent(pageName) {
  try {
    const response = await fetch(`/_content/${pageName}.html`);
    if (!response.ok) {
      console.error(`Failed to fetch content for ${pageName}. Status: ${response.status}`);
      // Fallback to home page content on error
      const fallbackResponse = await fetch('/_content/home.html');
      if (!fallbackResponse.ok) { 
        console.error('Failed to fetch fallback content (home.html)');
        return '<p>Error loading content.</p>'; // Final fallback
      }
      return await fallbackResponse.text();
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching content for ${pageName}:`, error);
     // Fallback to home page content on network error
    try {
      const fallbackResponse = await fetch('/_content/home.html');
       if (!fallbackResponse.ok) { 
        console.error('Failed to fetch fallback content (home.html) after network error');
        return '<p>Error loading content.</p>'; // Final fallback
      }
      return await fallbackResponse.text();
    } catch (fallbackError) {
       console.error('Error fetching fallback content:', fallbackError);
       return '<p>Error loading content.</p>'; // Final fallback
    }
  }
}

export async function updateContent(
  hash,
  elements,
  state,
  isMobile,
  updateThemeColor
) {
  const { contentArea, logo, nav, popup } = elements;
  let pageName = hash.substring(1); // Remove '#' e.g., 'home', 'about'

  // Default to 'home' if hash is empty or invalid (basic check)
  if (!pageName || !['home', 'about', 'music', 'contact'].includes(pageName)) {
     console.warn(`Invalid hash '${hash}', defaulting to #home`);
     pageName = 'home';
     hash = '#home'; // Ensure hash variable is also updated for title logic etc.
  }

  // Fetching content triggers the exit animation
  contentArea.classList.add("content-area--exit");

  // Wait for the exit animation to roughly complete AND content to fetch
  const contentPromise = fetchContent(pageName);
  const timeoutPromise = new Promise(resolve => setTimeout(resolve, 300));

  const newContent = await contentPromise;
  await timeoutPromise; // Ensure minimum delay for animation

  // Inject fetched content
  contentArea.innerHTML = newContent;
  contentArea.style.height = "auto";
  const newContentHeight = contentArea.scrollHeight;
  
  // Set initial height for transition effect, or use current if available
  const startHeight = state.currentContentHeight > 0 ? state.currentContentHeight : newContentHeight;
  contentArea.style.height = `${startHeight}px`;
  
  contentArea.offsetHeight; // Force reflow
  
  // Animate to new height
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

  // Initialize components specific to the loaded content
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
  updateTitle(hash); // Update browser title
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
