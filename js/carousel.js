// js/carousel.js
export function initCarousel(elements, showPopup) {
  const { contentArea } = elements;
  const track = contentArea.querySelector(".carousel-track");
  const items = contentArea.querySelectorAll(".carousel-item");
  const dotsContainer = contentArea.querySelector(".carousel-dots");
  let currentIndex = 0;
  let startX = 0,
    currentX = 0,
    isDragging = false;

  if (!track || !items.length || !dotsContainer) {
    console.warn("Carousel elements not found");
    return;
  }

  // Create navigation dots
  dotsContainer.innerHTML = "";
  items.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("carousel-dot");
    dot.setAttribute("data-index", index);
    if (index === currentIndex) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });

  // Handle image loading with smooth height transition
  const images = contentArea.querySelectorAll(".carousel-image");
  let loadedImages = 0;

  function adjustHeightSmoothly() {
    const currentHeight = contentArea.offsetHeight;
    contentArea.style.height = `${currentHeight}px`;
    contentArea.offsetHeight;
    contentArea.style.height = "auto";
    const newHeight = contentArea.scrollHeight;
    contentArea.style.height = `${currentHeight}px`;
    requestAnimationFrame(() => {
      contentArea.style.height = `${newHeight}px`;
    });
    setTimeout(() => {
      contentArea.style.height = "auto";
    }, 300);
  }

  images.forEach((image) => {
    if (image.complete) {
      loadedImages++;
      if (loadedImages === images.length) {
        adjustHeightSmoothly();
      }
    } else {
      image.addEventListener("load", () => {
        loadedImages++;
        if (loadedImages === images.length) {
          adjustHeightSmoothly();
        }
      });
    }
  });

  function updateCarousel() {
    items.forEach((item) => item.classList.remove("active"));
    items[currentIndex].classList.add("active");
    const dots = contentArea.querySelectorAll(".carousel-dot");
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[currentIndex].classList.add("active");
    const containerWidth = contentArea.querySelector(
      ".carousel-container"
    ).offsetWidth;
    const offset = -currentIndex * containerWidth;
    track.style.transform = `translateX(${offset}px)`;
  }

  function handleStart(e) {
    isDragging = false; // Reset initially
    startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    currentX = startX;
    track.style.transition = "none";
    if (e.type === "mousedown") {
      isDragging = true; // Only set for mouse if button is pressed
    }
  }

  function handleMove(e) {
    if (!isDragging) return;
    currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    const diff = currentX - startX;
    const containerWidth = contentArea.querySelector(
      ".carousel-container"
    ).offsetWidth;
    const currentOffset = -currentIndex * containerWidth;

    // Apply threshold for touch devices only
    if (e.type.includes("touch") && Math.abs(diff) > 10) {
      isDragging = true;
      e.preventDefault(); // Prevent scrolling on touch devices during swipe
      requestAnimationFrame(() => {
        track.style.transform = `translateX(${currentOffset + diff}px)`;
      });
    } else if (e.type === "mousemove") {
      // Only move if initiated by mousedown
      requestAnimationFrame(() => {
        track.style.transform = `translateX(${currentOffset + diff}px)`;
      });
    }
  }

  function handleEnd(e) {
    if (e.type === "touchend") {
      if (!isDragging) {
        // Treat as a tap on mobile
        const tappedItem = e.target.closest(".carousel-item");
        if (tappedItem) {
          currentIndex = parseInt(tappedItem.getAttribute("data-index"));
          updateCarousel();
          showPopup(tappedItem);
        }
      } else {
        // Handle swipe completion on mobile
        track.style.transition = "transform 0.5s ease";
        const diff = currentX - startX;
        const containerWidth = contentArea.querySelector(
          ".carousel-container"
        ).offsetWidth;
        if (Math.abs(diff) > containerWidth / 4) {
          if (diff < 0 && currentIndex < items.length - 1) {
            currentIndex++;
          } else if (diff > 0 && currentIndex > 0) {
            currentIndex--;
          }
        }
        updateCarousel();
      }
    } else if (e.type === "mouseup" && isDragging) {
      // Handle mouse drag completion on desktop
      track.style.transition = "transform 0.5s ease";
      const diff = currentX - startX;
      const containerWidth = contentArea.querySelector(
        ".carousel-container"
      ).offsetWidth;
      if (Math.abs(diff) > containerWidth / 4) {
        if (diff < 0 && currentIndex < items.length - 1) {
          currentIndex++;
        } else if (diff > 0 && currentIndex > 0) {
          currentIndex--;
        }
      }
      updateCarousel();
    }
    isDragging = false; // Reset after every interaction
  }

  // Bind touch/mouse events for swiping
  track.addEventListener("touchstart", handleStart);
  track.addEventListener("touchmove", handleMove, { passive: false });
  track.addEventListener("touchend", handleEnd);
  track.addEventListener("mousedown", handleStart);
  track.addEventListener("mousemove", handleMove);
  track.addEventListener("mouseup", handleEnd);
  track.addEventListener("mouseleave", handleEnd);

  // Handle item clicks or taps (for desktop and fallback)
  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (isDragging) return;
      e.preventDefault();
      currentIndex = parseInt(item.getAttribute("data-index"));
      updateCarousel();
      showPopup(item);
    });
  });

  // Handle dot navigation
  contentArea.querySelectorAll(".carousel-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      currentIndex = parseInt(dot.getAttribute("data-index"));
      updateCarousel();
    });
  });

  updateCarousel();
}
