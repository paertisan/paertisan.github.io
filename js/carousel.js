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
  let startTime = 0,
    lastX = 0,
    velocity = 0;

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
    isDragging = true;
    startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    lastX = startX;
    startTime = performance.now();
    track.style.transition = "none";
    e.preventDefault(); // Prevent page scrolling
  }

  function handleMove(e) {
    if (!isDragging) return;
    currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    const diff = currentX - startX;
    const containerWidth = contentArea.querySelector(
      ".carousel-container"
    ).offsetWidth;
    const currentOffset = -currentIndex * containerWidth;

    // Update velocity (pixels per millisecond)
    const timeDelta = performance.now() - startTime;
    if (timeDelta > 0) {
      velocity = (currentX - lastX) / timeDelta;
    }
    lastX = currentX;
    startTime = performance.now();

    requestAnimationFrame(() => {
      track.style.transform = `translateX(${currentOffset + diff}px)`;
    });
    e.preventDefault(); // Prevent page scrolling
  }

  function handleEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = "transform 0.5s ease-out"; // Easing for momentum
    const diff = currentX - startX;
    const containerWidth = contentArea.querySelector(
      ".carousel-container"
    ).offsetWidth;
    const swipeThreshold =
      Math.abs(velocity) > 0.5 ? containerWidth / 8 : containerWidth / 4; // Velocity-based threshold

    if (Math.abs(diff) > swipeThreshold) {
      if (diff < 0 && currentIndex < items.length - 1) {
        currentIndex++;
      } else if (diff > 0 && currentIndex > 0) {
        currentIndex--;
      }
    } else {
      // Apply momentum based on velocity
      const momentum = velocity * 200; // Adjust multiplier for feel
      const newOffset = -currentIndex * containerWidth + momentum;
      const maxOffset = 0;
      const minOffset = -(items.length - 1) * containerWidth;

      if (newOffset > maxOffset) {
        currentIndex = 0;
      } else if (newOffset < minOffset) {
        currentIndex = items.length - 1;
      } else {
        currentIndex = Math.round(-newOffset / containerWidth);
      }
    }
    updateCarousel();
    e.preventDefault(); // Prevent page scrolling
  }

  // Bind touch/mouse events for swiping
  track.addEventListener("touchstart", handleStart, { passive: false });
  track.addEventListener("touchmove", handleMove, { passive: false });
  track.addEventListener("touchend", handleEnd);
  track.addEventListener("mousedown", handleStart);
  track.addEventListener("mousemove", handleMove);
  track.addEventListener("mouseup", handleEnd);
  track.addEventListener("mouseleave", handleEnd);

  // Handle item clicks to open popup
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
