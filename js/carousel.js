// js/carousel.js
export function initCarousel(elements, showPopup) {
  const { contentArea } = elements;
  const track = contentArea.querySelector(".carousel-track");
  const items = contentArea.querySelectorAll(".carousel-item");
  const dotsContainer = contentArea.querySelector(".carousel-dots");
  const prevArea = contentArea.querySelector(".carousel-prev");
  const nextArea = contentArea.querySelector(".carousel-next");
  let currentIndex = 0;
  let startX = 0,
    currentX = 0,
    isDragging = false,
    dragThreshold = 15;

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
    contentArea.offsetHeight; // Force reflow
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

  track.style.display = "block"; // Show the carousel after setup

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

  // Apply 3D transformations to items based on virtualIndex
  function updateTransformations(virtualIndex) {
    const perspective = 16; // Perspective value in pixels
    items.forEach((item, i) => {
      const distance = i - virtualIndex;
      const translateX = 120 * distance; // Horizontal shift in pixels
      const scale = Math.max(1 - 0.2 * Math.abs(distance), 0); // Scale down based on distance
      const rotateY = distance > 0 ? -1 : distance < 0 ? 1 : 0; // Slight rotation
      const zIndex = -Math.floor(Math.abs(distance)); // Stack order
      const filter = Math.abs(distance) > 2 ? "blur(5px)" : "none"; // Blur distant items
      const opacity = Math.abs(distance) > 2 ? 0 : 0.9; // Fade distant items

      item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) scale(${scale}) perspective(${perspective}px) rotateY(${rotateY}deg)`;
      item.style.zIndex = zIndex;
      item.style.filter = filter;
      item.style.opacity = opacity;
    });
  }

  // Update carousel state (active item and dots)
  function updateCarousel() {
    items.forEach((item, i) => {
      if (i === currentIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
    const dots = contentArea.querySelectorAll(".carousel-dot");
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
    updateTransformations(currentIndex);
  }

  // Touch start handler
  function handleStart(e) {
    if (e.type === "touchstart") {
      isDragging = false; // Reset dragging flag
      startX = e.touches[0].pageX;
      currentX = startX;
      // Remove transition during swipe for responsiveness
      items.forEach((item) => (item.style.transition = "none"));
    }
  }

  // Touch move handler for swipe
  function handleMove(e) {
    if (e.type === "touchmove") {
      currentX = e.touches[0].pageX;
      const diff = currentX - startX;
      // Start dragging only if movement exceeds threshold
      if (!isDragging && Math.abs(diff) > dragThreshold) {
        isDragging = true;
      }

      if (isDragging) {
        e.preventDefault(); // Prevent page scroll while swiping carousel
        const virtualIndex = currentIndex - diff / 120; // Adjust sensitivity with divisor
        updateTransformations(virtualIndex);
      }
    }
  }

  // Touch end handler for swipe or tap
  function handleEnd(e) {
    if (e.type === "touchend") {
      // Add transition back for smooth snapping
      items.forEach((item) =>
        (item.style.transition =
          "transform 0.3s ease-out, opacity 0.3s ease-out, filter 0.3s ease-out")
      );

      if (!isDragging) {
        // Handle tap
        const tappedItem = e.target.closest(".carousel-item");
        if (tappedItem) {
          currentIndex = parseInt(tappedItem.getAttribute("data-index"));
          updateCarousel();
          showPopup(tappedItem);
        }
      } else {
        // Handle swipe completion
        const diff = currentX - startX;
        const virtualIndex = currentIndex - diff / 100;
        currentIndex = Math.round(virtualIndex);
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > items.length - 1) currentIndex = items.length - 1;
        updateCarousel();
      }

      // Reset isDragging after handling end event
      isDragging = false;
    }
  }

  // Bind touch events for swiping
  track.addEventListener("touchstart", handleStart);
  track.addEventListener("touchmove", handleMove, { passive: false });
  track.addEventListener("touchend", handleEnd);

  // Handle item clicks (desktop and mobile fallback)
  items.forEach((item) => {
    item.addEventListener("click", (e) => {
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

  // Handle invisible navigation regions
  if (prevArea) {
    prevArea.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  }
  if (nextArea) {
    nextArea.addEventListener("click", () => {
      if (currentIndex < items.length - 1) {
        currentIndex++;
        updateCarousel();
      }
    });
  }

  // Initialize carousel
  updateCarousel();
}
