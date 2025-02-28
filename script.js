document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.querySelector('.content-area');
    const navLinks = document.querySelectorAll('nav a');
    const logoLink = document.querySelector('.logo-link');
    const popup = document.getElementById('streaming-popup');
    const closePopup = popup.querySelector('.close-popup');
    const logo = document.querySelector('.logo');
    const nav = document.querySelector('nav');

    // Cache the current height
    let currentContentHeight = 0;

    // Content for each "page"
    const pages = {
        '#home': `
            <div class="block-quote">
                <i>
                    The <span class="highlight">Word</span> is my
                    <span class="highlight">music</span>
                </i>
            </div>
        `,
        '#about': `
            <div class="content-about text-body">
                <p>My name is <span class="highlight">Robert Rust</span>.</p>
                <p>I was born in Springfield, Oregon, and I love music. 
                I'm drawn to 
                <span class="highlight">beautiful</span> 
                sounds that wear their structures on their sleeves.
                I'm a 
                <span class="highlight">composer</span> 
                and 
                <span class="highlight">pianist</span>. 
                I'm a 7th generation 
                <span class="highlight">Oregonian</span>. 
                I'm a Christian. 
                I love the 
                <span class="highlight">Word</span>, 
                and even more: I love to share it with people through my 
                <span class="highlight">music</span>.
            </div>
        `,
        '#music': `
            <div class="music-links">
                <a href="#" class="vol0">Vol. 0</a>
            </div>
        `,
        '#contact': `
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
        `
    };

    // Function to check if the device is mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Function to update page title
    function updateTitle(hash) {
        const titles = {
            '#home': 'RWR Music - Home',
            '#about': 'RWR Music - About',
            '#music': 'RWR Music - Music',
            '#contact': 'RWR Music - Contact'
        };
        document.title = titles[hash] || 'RWR Music';
    }

    // Function to update theme color
    function updateThemeColor(color) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
        } else {
            const newMeta = document.createElement('meta');
            newMeta.name = 'theme-color';
            newMeta.content = color;
            document.head.appendChild(newMeta);
        }
    }

    // Function to adjust layout smoothly (for resize or initial load)
    function adjustLayout() {
        contentArea.style.height = 'auto';
        const newContentHeight = contentArea.scrollHeight;

        if (isMobile()) {
            contentArea.style.height = `${currentContentHeight}px`;
            contentArea.offsetHeight; // Force reflow
            contentArea.style.height = `${newContentHeight}px`;
            // No transforms needed; row-gap handles spacing
        } else {
            contentArea.style.height = 'auto';
        }
        currentContentHeight = newContentHeight;
    }

    // Function to update content with smooth height transition
    function updateContent(hash) {
        if (!pages[hash] && hash !== '#home') {
            console.warn(`Hash ${hash} not found, defaulting to #home`);
        }

        // Start fade-out transition
        contentArea.classList.add('content-area--exit');

        setTimeout(() => {
            // Lock the current height before changing content
            contentArea.style.height = `${currentContentHeight}px`;

            // Update content
            contentArea.innerHTML = pages[hash] || pages['#home'];

            // Calculate true new height by temporarily unsetting height
            contentArea.style.height = 'auto';
            const newContentHeight = contentArea.scrollHeight;

            // Set back to current height and transition to new height
            contentArea.style.height = `${currentContentHeight}px`;
            contentArea.offsetHeight; // Force reflow

            requestAnimationFrame(() => {
                contentArea.style.height = `${newContentHeight}px`;

                // No transforms needed; row-gap handles spacing
                if (isMobile()) {
                    logo.style.transform = 'none';
                    nav.style.transform = 'none';
                } else {
                    logo.style.transform = 'none';
                    nav.style.transform = 'none';
                }

                // Update cached height
                currentContentHeight = newContentHeight;

                // Fade in the new content
                contentArea.classList.remove('content-area--exit');
                contentArea.classList.add('content-area--enter');

                setTimeout(() => {
                    contentArea.classList.remove('content-area--enter');
                    if (!isMobile()) {
                        contentArea.style.height = 'auto';
                    }
                }, 300);
            });

            // Handle body class and theme color
            if (hash !== '#music' && !popup.classList.contains('show')) {
                document.body.classList.remove('vol0-active');
                if (isMobile()) {
                    updateThemeColor('#f9f8f7');
                }
            } else if (hash === '#music' && isMobile()) {
                updateThemeColor('#333');
            }
            bindVol0Link();
            updateTitle(hash);
        }, 300); // Match transition duration
    }

    // Function to bind click event to .vol0
    function bindVol0Link() {
        const vol0Link = document.querySelector('.vol0');
        if (vol0Link) {
            vol0Link.addEventListener('click', (event) => {
                event.preventDefault();
                popup.style.display = 'flex';
                popup.classList.add('show');
                document.body.classList.add('vol0-active');
                closePopup.focus();
                vol0Link.dataset.lastFocused = 'true';
            });
        }
    }

    // Bind nav links once
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href');
            if (href === '#music' && isMobile()) {
                document.body.classList.add('vol0-active');
                updateThemeColor('#333');
            }
            updateContent(href);
        });
    });

    // Logo click to home
    logoLink.addEventListener('click', (event) => {
        event.preventDefault();
        updateContent('#home');
        if (isMobile()) {
            updateThemeColor('#f9f8f7');
        }
    });

    // Close popup and revert styles
    closePopup.addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
            document.body.classList.remove('vol0-active');
            if (isMobile()) {
                updateThemeColor('#f9f8f7');
            }
            const lastFocused = document.querySelector('.vol0[data-last-focused="true"]');
            if (lastFocused) {
                lastFocused.focus();
                delete lastFocused.dataset.lastFocused;
            }
        }, 300);
    });

    // Close popup when clicking outside
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup.click();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && popup.classList.contains('show')) {
            closePopup.click();
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
        updateContent(window.location.hash || '#home');
        if (isMobile()) {
            const hash = window.location.hash || '#home';
            updateThemeColor(hash === '#music' ? '#333' : '#f9f8f7');
        }
    });

    // Handle window resize to adjust layout dynamically
    window.addEventListener('resize', adjustLayout);

    // Load initial content based on URL hash
    const initialHash = window.location.hash || '#home';
    contentArea.innerHTML = pages[initialHash] || pages['#home'];
    currentContentHeight = contentArea.scrollHeight; // Cache initial height
    contentArea.style.height = `${currentContentHeight}px`; // Set initial height explicitly
    adjustLayout(); // Apply initial layout
    if (isMobile() && initialHash === '#music') {
        updateThemeColor('#333');
    } else if (isMobile()) {
        updateThemeColor('#f9f8f7');
    }
});